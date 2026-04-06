import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMounted } from './use-mounted';

describe('useMounted', () => {
  it('should return true after component mounts', () => {
    const { result } = renderHook(() => useMounted());
    // After render + useEffect, mounted should be true
    expect(result.current).toBe(true);
  });

  it('should return a boolean value', () => {
    const { result } = renderHook(() => useMounted());
    expect(typeof result.current).toBe('boolean');
  });
});
