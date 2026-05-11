/* eslint-disable @typescript-eslint/no-explicit-any, no-empty-function */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { verifyServerSession } from './session-check';
import { cookies } from 'next/headers';

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('verifyServerSession', () => {
  let mockGet: ReturnType<typeof vi.fn>;
  let mockCookiesStore: any;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.restoreAllMocks();

    // Mocks for console methods to keep tests clean
    vi.spyOn(console, 'warn').mockImplementation(vi.fn());
    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    mockGet = vi.fn();
    mockCookiesStore = { get: mockGet };
    vi.mocked(cookies).mockResolvedValue(mockCookiesStore as never);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return valid: false, needsRefresh: false if no token and no refresh token exists', async () => {
    mockGet.mockReturnValue(undefined);

    const result = await verifyServerSession();

    expect(result).toEqual({ valid: false, needsRefresh: false });
  });

  it('should return valid: false, needsRefresh: true if no token but refresh token exists', async () => {
    mockGet.mockImplementation((name: string) => {
      if (name === 'refreshToken') return { value: 'refresh123' };
      return undefined;
    });

    const result = await verifyServerSession();

    expect(result).toEqual({ valid: false, needsRefresh: true });
  });

  it('should return valid: true if token exists and API returns ok', async () => {
    mockGet.mockImplementation((name: string) => {
      if (name === 'accessToken') return { value: 'access123' };
      return undefined;
    });

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
    } as Response);

    const result = await verifyServerSession();

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/token/verify'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ token: 'access123' }),
      })
    );
    expect(result).toEqual({ valid: true });
  });

  it('should return valid: false and needsRefresh based on refresh token if API returns not ok', async () => {
    mockGet.mockImplementation((name: string) => {
      if (name === 'accessToken') return { value: 'access123' };
      if (name === 'refreshToken') return { value: 'refresh123' };
      return undefined;
    });

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    const result = await verifyServerSession();

    expect(result).toEqual({ valid: false, needsRefresh: true });
    expect(console.warn).toHaveBeenCalledWith(
      '[ServerAuth] Token inválido (status %d) — solicitando refresh...',
      401
    );
  });

  it('should return valid: false and needsRefresh: false if API returns not ok and no refresh token exists', async () => {
    mockGet.mockImplementation((name: string) => {
      if (name === 'accessToken') return { value: 'access123' };
      return undefined; // no refresh token
    });

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 403,
    } as Response);

    const result = await verifyServerSession();

    expect(result).toEqual({ valid: false, needsRefresh: false });
    expect(console.warn).toHaveBeenCalledWith(
      '[ServerAuth] Token inválido (status %d) — solicitando refresh...',
      403
    );
  });

  it('should actually fire the timeout abort controller, covering the setTimout callback inline function', async () => {
    mockGet.mockImplementation((name: string) => {
      if (name === 'accessToken') return { value: 'access123' };
      return undefined;
    });

    vi.spyOn(global, 'fetch').mockImplementation(() => {
      return new Promise((_, reject) => {
        // Avance de reloj para detonar el callback setTimeout en el código fuente:
        vi.advanceTimersByTime(10000);
        // El código detona controller.abort(), causando un AbortError
        const DOMExceptionConstructor =
          global.DOMException ||
          class DOMException extends Error {
            name = 'AbortError';
          };
        reject(new DOMExceptionConstructor('Aborted', 'AbortError'));
      });
    });

    const result = await verifyServerSession();

    expect(result).toEqual({ valid: true });
    expect(console.warn).toHaveBeenCalledWith(
      '[ServerAuth] Timeout al verificar sesión — asumiendo válida'
    );
  });

  it('should fallback to valid: true optimistically if fetch throws a general error', async () => {
    mockGet.mockImplementation((name: string) => {
      if (name === 'accessToken') return { value: 'access123' };
      return undefined;
    });

    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

    const result = await verifyServerSession();

    expect(result).toEqual({ valid: true });
    expect(console.error).toHaveBeenCalledWith(
      '[ServerAuth] Error al verificar sesión:',
      expect.any(Error)
    );
  });
});
