import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService, LoginCredentials } from './auth.service';

describe('Auth Service', () => {
  const mockApiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  beforeEach(() => {
    // Restaurar los mocks antes de cada test
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // Limpiar mocks después de cada test
    vi.clearAllMocks();
  });

  describe('login', () => {
    const mockCredentials: LoginCredentials = {
      username: 'testuser',
      password: 'password123',
    };

    it('should login successfully and return AuthResponse', async () => {
      const mockResponse = {
        access: 'access-token',
        refresh: 'refresh-token',
        user: { id: 1, email: 'test@example.com' },
      };

      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as unknown as Response);

      const result = await authService.login(mockCredentials);

      expect(fetchSpy).toHaveBeenCalledWith(`${mockApiUrl}/api/token/pair`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockCredentials),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error with detail message on failure', async () => {
      const errorData = { detail: 'Credenciales inválidas' };

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        json: async () => errorData,
      } as unknown as Response);

      await expect(authService.login(mockCredentials)).rejects.toThrow('Credenciales inválidas');
    });

    it('should throw concatenated field errors if no detail is present', async () => {
      const errorData = { username: ['El usuario no existe'], password: 'Muy corta' };

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        json: async () => errorData,
      } as unknown as Response);

      await expect(authService.login(mockCredentials)).rejects.toThrow('username: El usuario no existe, password: Muy corta');
    });

    it('should throw a fallback error on unpredictable failure (e.g. 500 without JSON)', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => { throw new Error('Not JSON'); },
      } as unknown as Response);

      await expect(authService.login(mockCredentials)).rejects.toThrow('Error 500: No se pudo iniciar sesión');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token and return RefreshResponse', async () => {
      const mockResponse = { access: 'new-access-token' };

      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as unknown as Response);

      const result = await authService.refreshToken('old-refresh-token');

      expect(fetchSpy).toHaveBeenCalledWith(`${mockApiUrl}/api/token/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: 'old-refresh-token' }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when refresh token fails', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        status: 401,
      } as unknown as Response);

      await expect(authService.refreshToken('bad-token')).rejects.toThrow('Error 401: No se pudo renovar el token');
    });
  });

  describe('logout', () => {
    it('should call logout endpoint successfully without throwing', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
      } as unknown as Response);

      await authService.logout('current-refresh-token');

      expect(fetchSpy).toHaveBeenCalledWith(`${mockApiUrl}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: 'current-refresh-token' }),
      });
    });

    it('should catch and print console error seamlessly on fetch throw', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
      vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

      // Logout catches internal errors, so this shouldn't throw an unhandled promise
      await authService.logout('some-token');

      expect(consoleSpy).toHaveBeenCalledWith('Error de red al intentar cerrar sesión:', expect.any(Error));
    });

    it('should console warn if response is not ok', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        status: 400,
      } as unknown as Response);

      await authService.logout('some-token');

      expect(consoleSpy).toHaveBeenCalledWith('Error 400: No se pudo invalidar la sesión en el servidor principal.');
    });
  });
});
