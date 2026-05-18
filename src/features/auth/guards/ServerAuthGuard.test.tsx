/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServerAuthGuard } from './ServerAuthGuard';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { verifyServerSession } from '../services/session-check';

vi.mock('next/navigation', () => ({
  redirect: vi.fn().mockImplementation(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

vi.mock('../services/session-check', () => ({
  verifyServerSession: vi.fn(),
}));

describe('ServerAuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children if session is valid', async () => {
    vi.mocked(verifyServerSession).mockResolvedValue({
      valid: true,
      needsRefresh: false,
    });

    const mockChild = <div data-testid="child">Test Child</div>;
    const result = await ServerAuthGuard({ children: mockChild });

    expect(redirect).not.toHaveBeenCalled();
    expect(result.props.children).toEqual(mockChild);
  });

  it('should redirect to login if session is invalid and does not need refresh', async () => {
    vi.mocked(verifyServerSession).mockResolvedValue({
      valid: false,
      needsRefresh: false,
    });

    try {
      await ServerAuthGuard({ children: <div>Test</div> });
    } catch (e: any) {
      if (e.message !== 'NEXT_REDIRECT') throw e;
    }

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('should redirect to refresh endpoint if session needs refresh (with callbackUrl)', async () => {
    vi.mocked(verifyServerSession).mockResolvedValue({
      valid: false,
      needsRefresh: true,
    });

    const mockHeaders = new Map([['x-invoke-path', '/ruta/protegida']]);
    vi.mocked(headers).mockResolvedValue({
      get: (key: string) => mockHeaders.get(key) || null,
    } as any);

    try {
      await ServerAuthGuard({ children: <div>Test</div> });
    } catch (e: any) {
      if (e.message !== 'NEXT_REDIRECT') throw e;
    }

    expect(headers).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(
      `/api/auth/refresh?callbackUrl=${encodeURIComponent('/ruta/protegida')}`
    );
  });

  it('should fallback to /inicio callbackUrl if x-invoke-path header is missing', async () => {
    vi.mocked(verifyServerSession).mockResolvedValue({
      valid: false,
      needsRefresh: true,
    });

    vi.mocked(headers).mockResolvedValue({
      get: () => null,
    } as any);

    try {
      await ServerAuthGuard({ children: <div>Test</div> });
    } catch (e: any) {
      if (e.message !== 'NEXT_REDIRECT') throw e;
    }

    expect(redirect).toHaveBeenCalledWith(
      `/api/auth/refresh?callbackUrl=${encodeURIComponent('/inicio')}`
    );
  });
});
