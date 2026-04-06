import { describe, it, expect, vi, beforeEach } from 'vitest';
import { recoveryService } from './recovery.service';

// Mock fetchApi from api-client
vi.mock('@/lib/api-client', () => ({
  fetchApi: vi.fn(),
}));

import { fetchApi } from '@/lib/api-client';

const mockFetchApi = vi.mocked(fetchApi);

describe('Recovery Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(console, 'error').mockImplementation(vi.fn());
  });

  describe('sendPasswordResetEmail', () => {
    it('should call fetchApi with correct endpoint and body', async () => {
      mockFetchApi.mockResolvedValue({ ok: true } as Response);

      await recoveryService.sendPasswordResetEmail('test@example.com');

      expect(mockFetchApi).toHaveBeenCalledWith('/api/auth/password-reset', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      });
    });

    it('should throw error with detail message from API on failure', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => ({ detail: 'Correo no encontrado' }),
      } as unknown as Response);

      await expect(
        recoveryService.sendPasswordResetEmail('bad@example.com')
      ).rejects.toThrow('Correo no encontrado');
    });

    it('should throw fallback error when API response has no detail', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => ({}),
      } as unknown as Response);

      await expect(
        recoveryService.sendPasswordResetEmail('bad@example.com')
      ).rejects.toThrow('El correo no existe en la base de datos');
    });

    it('should throw fallback error when API response is not JSON', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => {
          throw new Error('Not JSON');
        },
      } as unknown as Response);

      await expect(
        recoveryService.sendPasswordResetEmail('bad@example.com')
      ).rejects.toThrow('El correo no existe en la base de datos');
    });
  });

  describe('verifyResetCode', () => {
    it('should call fetchApi with correct endpoint and return reset_token', async () => {
      mockFetchApi.mockResolvedValue({
        ok: true,
        json: async () => ({ reset_token: 'abc123token' }),
      } as unknown as Response);

      const token = await recoveryService.verifyResetCode(
        'test@example.com',
        '123456'
      );

      expect(mockFetchApi).toHaveBeenCalledWith('/api/auth/verify-reset-code', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', codigo: '123456' }),
      });
      expect(token).toBe('abc123token');
    });

    it('should throw error with detail message on failure', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => ({ detail: 'Código expirado' }),
      } as unknown as Response);

      await expect(
        recoveryService.verifyResetCode('test@example.com', 'wrong')
      ).rejects.toThrow('Código expirado');
    });

    it('should throw fallback error when API has no detail', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => ({}),
      } as unknown as Response);

      await expect(
        recoveryService.verifyResetCode('test@example.com', 'wrong')
      ).rejects.toThrow('El código ingresado no es válido');
    });
    it('should throw fallback error when API response is not JSON', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => {
          throw new Error('Not JSON');
        },
      } as unknown as Response);

      await expect(
        recoveryService.verifyResetCode('test@example.com', 'wrong')
      ).rejects.toThrow('El código ingresado no es válido');
    });
  });

  describe('resetPassword', () => {
    it('should call fetchApi with correct endpoint and body on success', async () => {
      mockFetchApi.mockResolvedValue({ ok: true } as Response);

      await recoveryService.resetPassword('token123', 'newPass1!', 'newPass1!');

      expect(mockFetchApi).toHaveBeenCalledWith('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          reset_token: 'token123',
          new_password: 'newPass1!',
          confirm_password: 'newPass1!',
        }),
      });
    });

    it('should throw error with detail message on failure', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => ({ detail: 'Token inválido' }),
      } as unknown as Response);

      await expect(
        recoveryService.resetPassword('bad-token', 'pass', 'pass')
      ).rejects.toThrow('Token inválido');
    });

    it('should throw fallback error when API has no detail', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => ({}),
      } as unknown as Response);

      await expect(
        recoveryService.resetPassword('bad-token', 'pass', 'pass')
      ).rejects.toThrow('Ocurrió un error al intentar cambiar la contraseña');
    });

    it('should throw fallback error when API response is not JSON', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => {
          throw new Error('Not JSON');
        },
      } as unknown as Response);

      await expect(
        recoveryService.resetPassword('bad-token', 'pass', 'pass')
      ).rejects.toThrow('Ocurrió un error al intentar cambiar la contraseña');
    });
  });
});
