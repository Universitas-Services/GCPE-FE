/* eslint-disable @typescript-eslint/no-explicit-any, no-empty-function */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { cookies } from 'next/headers';
import { authService } from '@/features/auth/services/auth.service';

vi.mock('next/server', () => {
  return {
    NextResponse: {
      // eslint-disable-next-line @typescript-eslint/require-await
      json: vi.fn((body, init) => {
        return {
          json: async () => body,
          status: init?.status ?? 200,
          cookies: {
            delete: vi.fn(),
          },
        };
      }),
    },
  };
});

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('@/features/auth/services/auth.service', () => ({
  authService: {
    logout: vi.fn(),
  },
}));

describe('Logout Route Handler', () => {
  let mockGet: ReturnType<typeof vi.fn>;
  let mockCookiesStore: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    mockGet = vi.fn();
    mockCookiesStore = { get: mockGet };
    vi.mocked(cookies).mockResolvedValue(mockCookiesStore as never);
  });

  it('should call authService.logout and delete cookies when refresh token exists', async () => {
    mockGet.mockReturnValue({ value: 'refresh_token_123' });
    vi.mocked(authService.logout).mockResolvedValue(undefined);

    const res = (await POST()) as any;

    expect(authService.logout).toHaveBeenCalledWith('refresh_token_123');

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ message: 'Logout exitoso' });

    expect(res.cookies.delete).toHaveBeenCalledTimes(2);
    expect(res.cookies.delete).toHaveBeenCalledWith('accessToken');
    expect(res.cookies.delete).toHaveBeenCalledWith('refreshToken');
  });

  it('should not call authService.logout but still delete cookies when no refresh token exists', async () => {
    mockGet.mockReturnValue(undefined);

    const res = (await POST()) as any;

    expect(authService.logout).not.toHaveBeenCalled();

    expect(res.status).toBe(200);
    expect(res.cookies.delete).toHaveBeenCalledTimes(2);
    expect(res.cookies.delete).toHaveBeenCalledWith('accessToken');
    expect(res.cookies.delete).toHaveBeenCalledWith('refreshToken');
  });

  it('should gracefully handle authService.logout failure and still delete cookies', async () => {
    mockGet.mockReturnValue({ value: 'refresh_token_123' });
    vi.mocked(authService.logout).mockRejectedValue(new Error('Backend error'));

    const res = (await POST()) as any;

    expect(authService.logout).toHaveBeenCalledWith('refresh_token_123');
    expect(console.error).toHaveBeenCalledWith(
      '[Logout Route] Error al procesar logout en el backend:',
      expect.any(Error)
    );

    expect(res.status).toBe(200);
    expect(res.cookies.delete).toHaveBeenCalledTimes(2);
    expect(res.cookies.delete).toHaveBeenCalledWith('accessToken');
  });
});
