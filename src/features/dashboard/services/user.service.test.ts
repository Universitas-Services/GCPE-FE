import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userService } from './user.service';

vi.mock('@/lib/api-client', () => ({
  fetchApi: vi.fn(),
}));

import { fetchApi } from '@/lib/api-client';

const mockFetchApi = vi.mocked(fetchApi);

describe('userService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(console, 'error').mockImplementation(vi.fn());
  });

  describe('getProfile', () => {
    it('should call fetchApi with /api/me and return user profile data', async () => {
      const mockProfile = {
        username: 'john',
        email: 'john@example.com',
        first_name: 'John',
        last_name: 'Doe',
      };

      mockFetchApi.mockResolvedValue({
        ok: true,
        json: async () => mockProfile,
      } as unknown as Response);

      const result = await userService.getProfile();

      expect(mockFetchApi).toHaveBeenCalledWith('/api/me');
      expect(result).toEqual(mockProfile);
    });

    it('should throw error with detail message when API fails', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => ({ detail: 'No autorizado' }),
      } as unknown as Response);

      await expect(userService.getProfile()).rejects.toThrow('No autorizado');
    });

    it('should throw fallback error when API fails without detail', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => ({}),
      } as unknown as Response);

      await expect(userService.getProfile()).rejects.toThrow(
        'No se pudo obtener la información del usuario'
      );
    });

    it('should throw fallback error when API returns non-JSON error', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => {
          throw new Error('Not JSON');
        },
      } as unknown as Response);

      await expect(userService.getProfile()).rejects.toThrow(
        'No se pudo obtener la información del usuario'
      );
    });
  });
});
