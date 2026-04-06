import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { RegisterProvider, useRegister } from './RegisterContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RegisterProvider>{children}</RegisterProvider>
);

describe('RegisterContext', () => {
  it('should throw error when useRegister is used outside of RegisterProvider', () => {
    // Suppress console.error for expected error
    const spy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

    expect(() => {
      renderHook(() => useRegister());
    }).toThrow('useRegister must be used within a RegisterProvider');

    spy.mockRestore();
  });

  it('should initialize with step 1 and empty formData', () => {
    const { result } = renderHook(() => useRegister(), { wrapper });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.formData).toEqual({});
  });

  it('should advance to next step when nextStep is called', () => {
    const { result } = renderHook(() => useRegister(), { wrapper });

    act(() => {
      result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(2);
  });

  it('should go back to previous step when prevStep is called', () => {
    const { result } = renderHook(() => useRegister(), { wrapper });

    act(() => {
      result.current.nextStep(); // 1 -> 2
      result.current.nextStep(); // 2 -> 3
    });

    act(() => {
      result.current.prevStep(); // 3 -> 2
    });

    expect(result.current.currentStep).toBe(2);
  });

  it('should not go below step 1 when prevStep is called at step 1', () => {
    const { result } = renderHook(() => useRegister(), { wrapper });

    act(() => {
      result.current.prevStep();
    });

    expect(result.current.currentStep).toBe(1);
  });

  it('should update formData with partial data via updateFormData', () => {
    const { result } = renderHook(() => useRegister(), { wrapper });

    act(() => {
      result.current.updateFormData({ email: 'test@example.com' });
    });

    expect(result.current.formData.email).toBe('test@example.com');
  });

  it('should merge formData on subsequent updateFormData calls', () => {
    const { result } = renderHook(() => useRegister(), { wrapper });

    act(() => {
      result.current.updateFormData({ email: 'test@example.com' });
    });

    act(() => {
      result.current.updateFormData({
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    expect(result.current.formData).toEqual({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    });
  });

  it('should override existing formData fields when updated', () => {
    const { result } = renderHook(() => useRegister(), { wrapper });

    act(() => {
      result.current.updateFormData({ email: 'first@example.com' });
    });

    act(() => {
      result.current.updateFormData({ email: 'updated@example.com' });
    });

    expect(result.current.formData.email).toBe('updated@example.com');
  });
});
