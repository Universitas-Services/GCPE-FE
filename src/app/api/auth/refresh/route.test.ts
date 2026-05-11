/* eslint-disable @typescript-eslint/no-explicit-any, no-empty-function */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

vi.mock('next/server', () => {
  return {
    NextResponse: {
      redirect: vi.fn((url) => {
        return {
          url,
          cookies: {
            set: vi.fn(),
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

describe('Refresh Route Handler', () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  let mockGet: ReturnType<typeof vi.fn>;
  let mockCookiesStore: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    mockGet = vi.fn();
    mockCookiesStore = { get: mockGet };
    vi.mocked(cookies).mockResolvedValue(mockCookiesStore as never);
  });

  function createMockRequest(urlStr: string) {
    return {
      url: urlStr,
    } as unknown as Request;
  }

  it('should redirect back to login if no refresh token is provided', async () => {
    mockGet.mockReturnValue(undefined);

    const req = createMockRequest(
      'http://localhost/api/auth/refresh?callbackUrl=/test'
    );

    // El redirect devuelve URL object internamente en el component, en vitest interceptamos eso a traves de Mock NextResponse.
    const res = (await GET(req)) as any;

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL('/login', 'http://localhost/api/auth/refresh?callbackUrl=/test')
    );
    expect(res.url.pathname).toBe('/login');
  });

  it('should successfully refresh token, set new cookies, and redirect to callbackUrl', async () => {
    mockGet.mockReturnValue({ value: 'old_refresh_token' });

    const mockData = {
      access: 'new_access_token',
      refresh: 'new_refresh_token',
    };

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    const req = createMockRequest(
      'http://localhost/api/auth/refresh?callbackUrl=/dashboard'
    );
    const res = (await GET(req)) as any;

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/api/token/refresh`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ refresh: 'old_refresh_token' }),
      })
    );

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL(
        '/dashboard',
        'http://localhost/api/auth/refresh?callbackUrl=/dashboard'
      )
    );

    expect(res.cookies.set).toHaveBeenCalledTimes(2);
    expect(res.cookies.set).toHaveBeenCalledWith(
      'accessToken',
      'new_access_token',
      expect.any(Object)
    );
    expect(res.cookies.set).toHaveBeenCalledWith(
      'refreshToken',
      'new_refresh_token',
      expect.any(Object)
    );
  });

  it('should omit setting refresh cookie if backend only returns access token', async () => {
    mockGet.mockReturnValue({ value: 'old_refresh_token' });

    // Solo access token devuelto
    const mockData = {
      access: 'new_access_token',
    };

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    const req = createMockRequest(
      'http://localhost/api/auth/refresh?callbackUrl=/profile'
    );
    const res = (await GET(req)) as any;

    expect(res.cookies.set).toHaveBeenCalledTimes(1);
    expect(res.cookies.set).toHaveBeenCalledWith(
      'accessToken',
      'new_access_token',
      expect.any(Object)
    );
  });

  it('should redirect back to login and clean up cookies if refresh flow fails at the backend', async () => {
    mockGet.mockReturnValue({ value: 'invalid_refresh_token' });

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    const req = createMockRequest(
      'http://localhost/api/auth/refresh?callbackUrl=/dashboard'
    );
    const res = (await GET(req)) as any;

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL(
        '/login',
        'http://localhost/api/auth/refresh?callbackUrl=/dashboard'
      )
    );
    expect(res.cookies.delete).toHaveBeenCalledTimes(2);
    expect(res.cookies.delete).toHaveBeenCalledWith('accessToken');
    expect(res.cookies.delete).toHaveBeenCalledWith('refreshToken');
  });

  it('should redirect back to login and clean up cookies if fetch throws', async () => {
    mockGet.mockReturnValue({ value: 'some_refresh_token' });

    vi.spyOn(global, 'fetch').mockRejectedValue(
      new Error('Network disconnected')
    );

    const req = createMockRequest(
      'http://localhost/api/auth/refresh?callbackUrl=/dashboard'
    );
    const res = (await GET(req)) as any;

    expect(console.error).toHaveBeenCalledWith(
      '[Refresh Route] Error:',
      expect.any(Error)
    );

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL(
        '/login',
        'http://localhost/api/auth/refresh?callbackUrl=/dashboard'
      )
    );
    expect(res.cookies.delete).toHaveBeenCalledTimes(2);
  });
});
