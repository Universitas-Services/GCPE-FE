import { describe, it, expect, vi, beforeEach } from 'vitest';
import { changePasswordService } from './change-password.service';
import { fetchApi } from '@/lib/api-client';

vi.mock('@/lib/api-client', () => ({
  fetchApi: vi.fn(),
}));

const mockFetchApi = vi.mocked(fetchApi);

describe('changePasswordService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const validData = {
    currentPassword: 'OldPass123!',
    newPassword: 'NewPass456!',
    confirmPassword: 'NewPass456!',
  };

  describe('changePassword', () => {
    it('should call fetchApi with correct payload on success', async () => {
      mockFetchApi.mockResolvedValue({
        ok: true,
      } as Response);

      await changePasswordService.changePassword(validData);

      expect(mockFetchApi).toHaveBeenCalledWith('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: 'OldPass123!',
          new_password: 'NewPass456!',
          confirm_password: 'NewPass456!',
        }),
      });
    });

    it('should not throw when response is ok', async () => {
      mockFetchApi.mockResolvedValue({ ok: true } as Response);

      await expect(
        changePasswordService.changePassword(validData)
      ).resolves.toBeUndefined();
    });

    it('should throw error with detail message when API returns detail', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => ({ detail: 'La contraseña actual es incorrecta' }),
      } as unknown as Response);

      await expect(
        changePasswordService.changePassword(validData)
      ).rejects.toThrow('La contraseña actual es incorrecta');
    });

    it('should throw concatenated field errors when API returns field validations', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => ({
          new_password: ['Muy corta'],
          confirm_password: 'No coinciden',
        }),
      } as unknown as Response);

      await expect(
        changePasswordService.changePassword(validData)
      ).rejects.toThrow('Muy corta, No coinciden');
    });

    it('should throw fallback error when API returns empty error object', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => ({}),
      } as unknown as Response);

      await expect(
        changePasswordService.changePassword(validData)
      ).rejects.toThrow('No se pudo cambiar la contraseña');
    });

    it('should throw fallback error when API returns non-JSON', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => {
          throw new Error('Not JSON');
        },
      } as unknown as Response);

      await expect(
        changePasswordService.changePassword(validData)
      ).rejects.toThrow('No se pudo cambiar la contraseña');
    });
  });
});
