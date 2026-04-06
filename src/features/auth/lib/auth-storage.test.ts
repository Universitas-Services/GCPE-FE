import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authStorage } from './auth-storage';

describe('authStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getUser', () => {
    it('should return null when no user is stored', () => {
      expect(authStorage.getUser()).toBeNull();
    });

    it('should return parsed user object when valid JSON is stored', () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
      };
      localStorage.setItem('user', JSON.stringify(mockUser));

      const result = authStorage.getUser();
      expect(result).toEqual(mockUser);
    });

    it('should return null and clean up storage when stored data is invalid JSON', () => {
      localStorage.setItem('user', 'not-valid-json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

      const result = authStorage.getUser();

      expect(result).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error al leer datos del usuario del almacenamiento local:',
        expect.any(SyntaxError)
      );
    });
  });

  describe('setUser', () => {
    it('should store the user as JSON in localStorage', () => {
      const mockUser = {
        id: 2,
        email: 'admin@example.com',
        first_name: 'Admin',
        last_name: 'User',
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authStorage.setUser(mockUser as unknown as any);

      const stored = JSON.parse(localStorage.getItem('user')!);
      expect(stored).toEqual(mockUser);
    });
  });

  describe('clearSession', () => {
    it('should remove the user key from localStorage', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1 }));
      expect(localStorage.getItem('user')).not.toBeNull();

      authStorage.clearSession();

      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should not throw if user key does not exist', () => {
      expect(() => authStorage.clearSession()).not.toThrow();
    });
  });

  describe('SSR Environment (isBrowser = false)', () => {
    it('should safely do nothing when window is undefined', async () => {
      const originalWindow = global.window;
      // @ts-expect-error - Simulating missing window
      delete global.window;

      vi.resetModules();
      const { authStorage: ssrAuthStorage } = await import('./auth-storage');

      expect(ssrAuthStorage.getUser()).toBeNull();
      expect(() =>
        ssrAuthStorage.setUser({ id: 1, email: 'z@z.com' })
      ).not.toThrow();
      expect(() => ssrAuthStorage.clearSession()).not.toThrow();

      global.window = originalWindow;
    });
  });
});
