import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';

// Mock NextResponse
vi.mock('next/server', () => {
  return {
    NextResponse: {
      json: vi.fn((body, init) => {
        return {
          json: async () => body,
          status: init?.status ?? 200,
          cookies: {
            set: vi.fn(),
          },
        };
      }),
    },
  };
});

describe('Login Route Handler', () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(vi.fn());
  });

  function createMockRequest(body: unknown) {
    return {
      json: async () => body,
    } as unknown as Request;
  }

  it('should handle successful login and set cookies', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockData = {
      user: mockUser,
      access: 'access_token_123',
      refresh: 'refresh_token_456',
    };

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData,
      status: 200,
    } as Response);

    const req = createMockRequest({
      email: 'test@example.com',
      password: 'password123',
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = (await POST(req)) as any;

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/api/token/pair`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      })
    );

    const json = await res.json();
    expect(json).toEqual({ message: 'Login exitoso', user: mockUser });
    expect(res.status).toBe(200);

    expect(res.cookies.set).toHaveBeenCalledTimes(2);
    expect(res.cookies.set).toHaveBeenCalledWith(
      'accessToken',
      'access_token_123',
      expect.objectContaining({ httpOnly: true, path: '/' })
    );
    expect(res.cookies.set).toHaveBeenCalledWith(
      'refreshToken',
      'refresh_token_456',
      expect.objectContaining({ httpOnly: true, path: '/' })
    );
  });

  it('should omit setting refresh cookie if not returned by backend', async () => {
    const mockData = {
      user: { id: 1 },
      access: 'access_token_123',
    };

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData,
      status: 200,
    } as Response);

    const req = createMockRequest({
      email: 'test@example.com',
      password: 'password123',
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = (await POST(req)) as any;

    expect(res.cookies.set).toHaveBeenCalledTimes(1);
    expect(res.cookies.set).toHaveBeenCalledWith(
      'accessToken',
      'access_token_123',
      expect.any(Object)
    );
  });

  it('should return backend error if fetch response is not ok', async () => {
    const errorData = { detail: 'Credenciales inválidas' };
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => errorData,
      status: 401,
    } as Response);

    const req = createMockRequest({ email: 'test', password: 'wrong' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = (await POST(req)) as any;

    const json = await res.json();
    expect(json).toEqual(errorData);
    expect(res.status).toBe(401);
  });

  it('should return 500 equivalent if backend returns non-JSON html', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error('invalid json');
      },
      status: 502,
    } as unknown as Response);

    const req = createMockRequest({ email: 'test', password: 'wrong' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = (await POST(req)) as any;

    const json = await res.json();
    expect(json).toEqual({ error: 'Backend error' });
    expect(res.status).toBe(502);
    expect(console.error).toHaveBeenCalled();
  });

  it('should return 500 on unhandled exception', async () => {
    // E.g., request.json() throws
    const req = {
      json: () => {
        throw new Error('Bad request syntax');
      },
    } as unknown as Request;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = (await POST(req)) as any;

    const json = await res.json();
    expect(json).toEqual({ error: 'Internal Server Error' });
    expect(res.status).toBe(500);
    expect(console.error).toHaveBeenCalled();
  });
});
