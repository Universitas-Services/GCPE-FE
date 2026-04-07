import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { profileService, ProfileResponse } from './profile.service';
import { EditProfileFormValues } from '../schemas/edit-profile.schema';

vi.mock('@/lib/api-client', () => ({
  fetchApi: vi.fn(),
}));

import { fetchApi } from '@/lib/api-client';

const mockFetchApi = vi.mocked(fetchApi);

describe('Profile Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should fetch and return profile data successfully', async () => {
      const mockProfile: ProfileResponse = {
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        telefono: '1234567890',
        nombre_institucion_ente: 'Test Inst',
        cargo: 'Director',
      };

      mockFetchApi.mockResolvedValue({
        ok: true,
        json: async () => mockProfile,
      } as unknown as Response);

      const result = await profileService.getProfile();

      expect(mockFetchApi).toHaveBeenCalledWith('/api/perfil', {
        method: 'GET',
        cache: 'no-store',
      });
      expect(result).toEqual(mockProfile);
    });

    it('should throw an error on failed getProfile fetch', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Unauthorized access' }),
      } as unknown as Response);

      await expect(profileService.getProfile()).rejects.toThrow(
        'Unauthorized access'
      );
      expect(mockFetchApi).toHaveBeenCalled();
    });
  });

  describe('updateProfile', () => {
    const mockData: EditProfileFormValues = {
      firstName: 'NewName',
      lastName: 'NewLastName',
      phone: '0987654321',
      institution: 'New Inst',
      role: 'Manager',
    };

    it('should successfully update profile data', async () => {
      mockFetchApi.mockResolvedValue({
        ok: true,
        json: async () => ({ ...mockData, email: 'keep@example.com' }), // Simulate a response
      } as unknown as Response);

      await profileService.updateProfile(mockData);

      expect(mockFetchApi).toHaveBeenCalledWith('/api/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: mockData.firstName,
          last_name: mockData.lastName,
          telefono: mockData.phone,
          nombre_institucion_ente: mockData.institution,
          cargo: mockData.role,
        }),
      });
    });

    it('should throw profile update error if fetch fails', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => {
          throw new Error('Unparseable json');
        },
      } as unknown as Response);

      await expect(profileService.updateProfile(mockData)).rejects.toThrow(
        'No se pudo actualizar el perfil'
      );
    });
  });

  describe('updateProfilePartial', () => {
    const mockPartialData = {
      nombre_institucion_ente: 'Inst',
      cargo: 'Admin',
    };

    it('should call partial update endpoint with correct body', async () => {
      mockFetchApi.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as unknown as Response);

      await profileService.updateProfilePartial(mockPartialData);

      expect(mockFetchApi).toHaveBeenCalledWith('/api/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockPartialData),
      });
    });

    it('should properly capture known error messages from partial profile update', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Institution not found' }),
      } as unknown as Response);

      await expect(
        profileService.updateProfilePartial(mockPartialData)
      ).rejects.toThrow('Institution not found');
    });
  });

  describe('deleteAccount', () => {
    it('should delete account successfully without throwing', async () => {
      mockFetchApi.mockResolvedValue({
        ok: true,
      } as unknown as Response);

      await profileService.deleteAccount();

      expect(mockFetchApi).toHaveBeenCalledWith('/api/auth/delete-account', {
        method: 'DELETE',
      });
    });

    it('should specifically catch and throw exact string PROTECT if server indicates PROTECT code', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => ({ code: 'PROTECT' }),
      } as unknown as Response);

      await expect(profileService.deleteAccount()).rejects.toThrow('PROTECT');
    });

    it('should fall back to general error if payload fails without PROTECT keyword', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'General DB error' }),
      } as unknown as Response);

      await expect(profileService.deleteAccount()).rejects.toThrow(
        'General DB error'
      );
    });
  });
});
