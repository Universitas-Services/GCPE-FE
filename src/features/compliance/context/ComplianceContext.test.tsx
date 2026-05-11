import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ComplianceProvider, useCompliance } from './ComplianceContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ComplianceProvider>{children}</ComplianceProvider>
);

describe('ComplianceContext', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should throw error when useCompliance is used outside of ComplianceProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

    expect(() => {
      renderHook(() => useCompliance());
    }).toThrow('useCompliance must be used within a ComplianceProvider');

    spy.mockRestore();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCompliance(), { wrapper });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(7);
    expect(result.current.complianceId).toBeNull();
    expect(result.current.complianceAnswers).toEqual({});
    expect(result.current.generalData).toEqual({
      email: '',
      entityName: '',
      unitName: '',
      reviewerName: '',
      documentCode: '',
    });
  });

  it('should navigate to next page with goToNextPage', () => {
    const { result } = renderHook(() => useCompliance(), { wrapper });

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPage).toBe(2);
  });

  it('should not go past totalPages with goToNextPage', () => {
    const { result } = renderHook(() => useCompliance(), { wrapper });

    // Navigate to page 7 (totalPages)
    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.goToNextPage();
      });
    }

    expect(result.current.currentPage).toBe(7);
  });

  it('should navigate to previous page with goToPreviousPage', () => {
    const { result } = renderHook(() => useCompliance(), { wrapper });

    act(() => {
      result.current.goToNextPage(); // 1 -> 2
      result.current.goToNextPage(); // 2 -> 3
    });

    act(() => {
      result.current.goToPreviousPage(); // 3 -> 2
    });

    expect(result.current.currentPage).toBe(2);
  });

  it('should not go below page 1 with goToPreviousPage', () => {
    const { result } = renderHook(() => useCompliance(), { wrapper });

    act(() => {
      result.current.goToPreviousPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('should set the current page directly via setCurrentPage', () => {
    const { result } = renderHook(() => useCompliance(), { wrapper });

    act(() => {
      result.current.setCurrentPage(5);
    });

    expect(result.current.currentPage).toBe(5);
  });

  it('should update generalData via setGeneralData', () => {
    const { result } = renderHook(() => useCompliance(), { wrapper });

    const newData = {
      email: 'test@example.com',
      entityName: 'Entidad Test',
      unitName: 'Unidad Test',
      reviewerName: 'Revisor Test',
      documentCode: 'DOC-001',
    };

    act(() => {
      result.current.setGeneralData(newData);
    });

    expect(result.current.generalData).toEqual(newData);
  });

  it('should set a compliance answer via setAnswer', () => {
    const { result } = renderHook(() => useCompliance(), { wrapper });

    act(() => {
      result.current.setAnswer(1, 'SI');
    });

    expect(result.current.complianceAnswers[1]).toBe('SI');
  });

  it('should update existing answers without losing other answers', () => {
    const { result } = renderHook(() => useCompliance(), { wrapper });

    act(() => {
      result.current.setAnswer(1, 'SI');
      result.current.setAnswer(2, 'NO');
    });

    act(() => {
      result.current.setAnswer(1, 'NO_APLICA');
    });

    expect(result.current.complianceAnswers[1]).toBe('NO_APLICA');
    expect(result.current.complianceAnswers[2]).toBe('NO');
  });

  it('should update complianceId via setComplianceId', () => {
    const { result } = renderHook(() => useCompliance(), { wrapper });

    act(() => {
      result.current.setComplianceId(42);
    });

    expect(result.current.complianceId).toBe(42);
  });
});
