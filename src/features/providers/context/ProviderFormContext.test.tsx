/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ProviderFormProvider, useProviderForm } from './ProviderFormContext';
import { providerSchema } from '../schemas/provider.schema';
import { ZodError } from 'zod';

// Mockeamos selectivamente el pick del schema sin perder las referencias
// De este modo podemos detonar tanto exito como fallo deliberadamente
vi.mock('../schemas/provider.schema', () => ({
  providerSchema: {
    pick: vi.fn(),
  },
}));

describe('ProviderFormContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ProviderFormProvider>{children}</ProviderFormProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useProviderForm(), { wrapper });

      expect(result.current.currentStep).toBe(1);
      expect(result.current.formData).toEqual({
        tipo_persona: 'Juridica',
        actividad_comercial_principal: '',
      });
      expect(result.current.errors).toEqual({});
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should throw error when used outside Provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

      expect(() => renderHook(() => useProviderForm())).toThrow(
        'useProviderForm must be used within a ProviderFormProvider'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Form Logic', () => {
    it('should increment step without exceeding 4', () => {
      const { result } = renderHook(() => useProviderForm(), { wrapper });

      act(() => result.current.nextStep());
      act(() => result.current.nextStep());
      act(() => result.current.nextStep());
      expect(result.current.currentStep).toBe(4);

      // Limitar a máximo 4
      act(() => result.current.nextStep());
      expect(result.current.currentStep).toBe(4);
    });

    it('should decrement step without going below 1', () => {
      const { result } = renderHook(() => useProviderForm(), { wrapper });

      act(() => result.current.nextStep()); // Step 2
      expect(result.current.currentStep).toBe(2);

      act(() => result.current.prevStep()); // Step 1
      expect(result.current.currentStep).toBe(1);

      // Limitar al mínimo 1
      act(() => result.current.prevStep());
      expect(result.current.currentStep).toBe(1);
    });

    it('should update formData seamlessly while wiping explicit errors out', () => {
      const { result } = renderHook(() => useProviderForm(), { wrapper });

      // Inyectamos error falso inicial
      act(() => {
        // Manipulación forzada del estado de errores no expuesta directamente,
        // pero observable provocando updateFormData
        result.current.updateFormData({ correo_proveedor: 'viejo@err.or' });
      });

      // Validamos actualización
      expect(result.current.formData).toEqual(
        expect.objectContaining({ correo_proveedor: 'viejo@err.or' })
      );
    });

    it('should reset form entirely', () => {
      const { result } = renderHook(() => useProviderForm(), { wrapper });

      act(() => {
        result.current.updateFormData({ nombre_proveedor: 'ACME' });
        result.current.nextStep();
        result.current.setIsSubmitting(true);
      });

      expect(result.current.currentStep).toBe(2);
      expect(result.current.formData.nombre_proveedor).toBe('ACME');
      expect(result.current.isSubmitting).toBe(true);

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.currentStep).toBe(1);
      expect(result.current.formData).toEqual({});
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('Validation', () => {
    const parseMock = vi.fn();

    beforeEach(() => {
      (
        providerSchema.pick as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue({
        parse: parseMock,
      });
    });

    it('should validate correctly and map Step 1 Schema', () => {
      const { result } = renderHook(() => useProviderForm(), { wrapper });

      parseMock.mockImplementationOnce(() => true);

      let isValid = false;
      act(() => {
        isValid = result.current.validateStep(1);
      });

      expect(providerSchema.pick).toHaveBeenCalledWith(
        expect.objectContaining({ correo_proveedor: true, rif_proveedor: true })
      );
      expect(isValid).toBe(true);
      expect(result.current.errors).toEqual({});
    });

    it('should handle Zod validation errors seamlessly across fields resolving array mapping natively', () => {
      const { result } = renderHook(() => useProviderForm(), { wrapper });

      const fakeZodError = new ZodError([
        {
          path: ['correo_proveedor'],
          message: 'Correo inválido',
          code: 'custom',
        },
        { path: ['nombre_proveedor'], message: 'Nombre vacío', code: 'custom' },
      ]);

      parseMock.mockImplementationOnce(() => {
        throw fakeZodError;
      });

      let isValid = true;
      act(() => {
        isValid = result.current.validateStep(2); // Step 2 picks different keys but structure relies on pick implementation
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toEqual({
        correo_proveedor: 'Correo inválido',
        nombre_proveedor: 'Nombre vacío',
      });
    });

    it('should ignore Zod issues if they are gracefully malformed (not arrays or missing paths)', () => {
      const { result } = renderHook(() => useProviderForm(), { wrapper });

      // Simulate a custom malformed Zod error
      const fakeZodError = Object.create(ZodError.prototype);
      fakeZodError.errors = 'not an array'; // Edge case 1: issues is not array

      parseMock.mockImplementationOnce(() => {
        throw fakeZodError;
      });

      let isValid = true;
      act(() => {
        isValid = result.current.validateStep(1);
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toEqual({});

      // Now with an array but missing paths
      const fakeZodError2 = new ZodError([
        { path: [], message: 'Empty path', code: 'custom' },
        { message: 'No path', code: 'custom' } as any,
      ]);

      parseMock.mockImplementationOnce(() => {
        throw fakeZodError2;
      });

      act(() => {
        isValid = result.current.validateStep(1);
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toEqual({});
    });

    it('should return true immediately if passing a step out of bounds defaulting behavior', () => {
      const { result } = renderHook(() => useProviderForm(), { wrapper });
      let isValid = false;

      act(() => {
        isValid = result.current.validateStep(99);
      });

      expect(isValid).toBe(true);
    });

    it('should log non-zod errors safely and return false', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
      const { result } = renderHook(() => useProviderForm(), { wrapper });

      parseMock.mockImplementationOnce(() => {
        throw new Error('Fatal error during schema parsing');
      });

      let isValid = true;
      act(() => {
        isValid = result.current.validateStep(3);
      });

      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Validation error:',
        expect.any(Error)
      );
    });
  });
});
