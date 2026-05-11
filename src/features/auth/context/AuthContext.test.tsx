import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { authStorage } from '../lib/auth-storage';
import { useRouter } from 'next/navigation';
import React from 'react';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock Auth Storage
vi.mock('../lib/auth-storage', () => ({
  authStorage: {
    getUser: vi.fn(),
    setUser: vi.fn(),
    clearSession: vi.fn(),
  },
}));

describe('AuthContext', () => {
  const mockReplace = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      replace: mockReplace,
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('should initialize with user if stored in cookie/localStorage', () => {
    const fakeUser = { id: 1, email: 'user@test.com', name: 'Test' };
    (
      authStorage.getUser as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(fakeUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(fakeUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should initialize empty if no user is found', () => {
    (
      authStorage.getUser as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle login successfully', async () => {
    (
      authStorage.getUser as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(null);
    const fakeLoginUser = { id: 2, email: 'nuevo@test.com', name: 'Nuevo' };
    const fakeMeResponse = {
      id: 2,
      email: 'nuevo@test.com',
      name: 'Nuevo',
      is_staff: false,
      is_superuser: false,
    };

    // Mock fetch: 1st call = login, 2nd call = /api/auth/me
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: fakeLoginUser }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => fakeMeResponse,
      } as unknown as Response);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        username: 'nuevo@test.com',
        password: 'password123',
      });
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({ method: 'POST' })
    );
    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/auth/me',
      expect.objectContaining({ method: 'GET' })
    );
    const expectedUser = {
      id: 2,
      email: 'nuevo@test.com',
      name: 'Nuevo',
      is_staff: false,
      is_superuser: false,
    };
    expect(authStorage.setUser).toHaveBeenCalledWith(expectedUser);
    expect(result.current.user).toEqual(expectedUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });

  it('should handle login successfully with no user object in login response', async () => {
    (
      authStorage.getUser as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(null);
    const fakeMeResponse = {
      id: 5,
      email: 'me@test.com',
      name: 'FromMe',
      is_staff: false,
      is_superuser: false,
    };

    // Mock fetch: 1st call = login (no user), 2nd call = /api/auth/me
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => fakeMeResponse,
      } as unknown as Response);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        username: 'nuevo@test.com',
        password: 'password123',
      });
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({ method: 'POST' })
    );
    const expectedUser = {
      id: 5,
      email: 'me@test.com',
      name: 'FromMe',
      is_staff: false,
      is_superuser: false,
    };
    expect(authStorage.setUser).toHaveBeenCalledWith(expectedUser);
    expect(result.current.user).toEqual(expectedUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });

  it('should throw error if login fetch fails', async () => {
    (
      authStorage.getUser as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(null);

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ detail: 'Clave errónea' }),
    } as unknown as Response);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(
      result.current.login({ username: 'user', password: 'bad' })
    ).rejects.toThrow('Clave errónea');
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should throw fallback error if login fetch fails without detail', async () => {
    (
      authStorage.getUser as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(null);

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({}), // No detail
    } as unknown as Response);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(
      result.current.login({ username: 'user', password: 'bad' })
    ).rejects.toThrow('Error al iniciar sesión');
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle logout successfully', async () => {
    const fakeUser = { id: 1, email: 'user@test.com' };
    (
      authStorage.getUser as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(fakeUser);

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
    } as unknown as Response);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/auth/logout',
      expect.objectContaining({ method: 'POST' })
    );
    expect(authStorage.clearSession).toHaveBeenCalled();
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });

  it('should handle logout gracefully if fetch fails', async () => {
    const fakeUser = { id: 1, email: 'user@test.com' };
    (
      authStorage.getUser as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(fakeUser);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/auth/logout',
      expect.objectContaining({ method: 'POST' })
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error durante el logout:',
      expect.any(Error)
    );
    expect(authStorage.clearSession).toHaveBeenCalled();
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockReplace).toHaveBeenCalledWith('/login');

    consoleSpy.mockRestore();
  });

  it('should throw error when useAuth is used outside provider', () => {
    // Al suprimir el console.error temporalmente pasamos la advertencia limpia de React
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});
