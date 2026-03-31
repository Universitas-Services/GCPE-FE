import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { DashboardProvider, useDashboard } from './DashboardContext';

describe('DashboardContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DashboardProvider>{children}</DashboardProvider>
  );

  it('should initialize with sidebar collapsed (true)', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });

    expect(result.current.isSidebarCollapsed).toBe(true);
  });

  it('should toggle sidebar state back and forth', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.isSidebarCollapsed).toBe(false);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.isSidebarCollapsed).toBe(true);
  });

  it('should throw an error if used outside of DashboardProvider', () => {
    // Suppress React warning for throwing during render
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

    expect(() => {
      renderHook(() => useDashboard());
    }).toThrow('useDashboard must be used within a DashboardProvider');

    consoleSpy.mockRestore();
  });
});
