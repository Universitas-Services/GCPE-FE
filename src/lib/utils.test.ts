import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('Utils: cn', () => {
  it('should merge tailwind classes correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const isError = false;
    const result = cn(
      'base-class',
      isActive && 'active-class',
      isError && 'error-class'
    );
    expect(result).toBe('base-class active-class');
  });

  it('should resolve tailwind class conflicts using tailwind-merge (overriding)', () => {
    // twMerge is expected to override earlier classes with later ones if they conflict
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('should handle undefined or null values gracefully', () => {
    const result = cn('flex', undefined, null, '', 'items-center');
    expect(result).toBe('flex items-center');
  });
});
