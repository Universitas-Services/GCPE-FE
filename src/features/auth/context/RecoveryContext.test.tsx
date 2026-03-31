import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { RecoveryProvider, useRecovery } from './RecoveryContext';

describe('RecoveryContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RecoveryProvider>{children}</RecoveryProvider>
  );

  it('should initialize with step 1 and empty formData', () => {
    const { result } = renderHook(() => useRecovery(), { wrapper });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.formData).toEqual({});
  });

  it('should advance to next step correctly', () => {
    const { result } = renderHook(() => useRecovery(), { wrapper });

    act(() => {
      result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(2);
  });

  it('should go back to prev step but never below 1', () => {
    const { result } = renderHook(() => useRecovery(), { wrapper });

    // Intentar bajar de 1
    act(() => {
      result.current.prevStep();
    });
    expect(result.current.currentStep).toBe(1);

    // Subir y luego bajar
    act(() => {
      result.current.nextStep(); // 2
      result.current.nextStep(); // 3
      result.current.prevStep(); // 2
    });
    expect(result.current.currentStep).toBe(2);
  });

  it('should cumulatively update form data', () => {
    const { result } = renderHook(() => useRecovery(), { wrapper });

    act(() => {
      result.current.updateFormData({ email: 'test@recovery.com' });
    });

    expect(result.current.formData).toEqual({ email: 'test@recovery.com' });

    act(() => {
      result.current.updateFormData({ code: '123456' });
    });

    expect(result.current.formData).toEqual({
      email: 'test@recovery.com',
      code: '123456',
    });
  });

  it('should throw an error if used outside of RecoveryProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

    expect(() => {
      renderHook(() => useRecovery());
    }).toThrow('useRecovery must be used within a RecoveryProvider');

    consoleSpy.mockRestore();
  });
});
