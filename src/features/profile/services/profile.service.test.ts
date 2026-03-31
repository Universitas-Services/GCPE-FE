import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { profileService, ProfileResponse } from './profile.service';
import { EditProfileFormValues } from '../schemas/edit-profile.schema';

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

      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockProfile,
      } as unknown as Response);

      const result = await profileService.getProfile();

      expect(fetchSpy).toHaveBeenCalledWith('/api/profile', {
        method: 'GET',
        cache: 'no-store',
      });
      expect(result).toEqual(mockProfile);
    });

    it('should throw an error on failed getProfile fetch', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Unauthorized access' }),
      } as unknown as Response);

      await expect(profileService.getProfile()).rejects.toThrow('Unauthorized access');
      expect(fetchSpy).toHaveBeenCalled();
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
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ ...mockData, email: 'keep@example.com' }), // Simulate a response
      } as unknown as Response);

      await profileService.updateProfile(mockData);

      expect(fetchSpy).toHaveBeenCalledWith('/api/profile', {
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
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        json: async () => { throw new Error('Unparseable json'); },
      } as unknown as Response);

      await expect(profileService.updateProfile(mockData)).rejects.toThrow('No se pudo actualizar el perfil');
    });
  });

  describe('updateProfilePartial', () => {
    const mockPartialData = {
      nombre_institucion_ente: 'Inst',
      cargo: 'Admin',
    };

    it('should call partial update endpoint with correct body', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as unknown as Response);

      await profileService.updateProfilePartial(mockPartialData);

      expect(fetchSpy).toHaveBeenCalledWith('/api/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockPartialData),
      });
    });

    it('should properly capture known error messages from partial profile update', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Institution not found' }),
      } as unknown as Response);

      await expect(profileService.updateProfilePartial(mockPartialData)).rejects.toThrow('Institution not found');
    });
  });

  describe('deleteAccount', () => {
    it('should delete account successfully without throwing', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
      } as unknown as Response);

      await profileService.deleteAccount();

      expect(fetchSpy).toHaveBeenCalledWith('/api/auth/delete-account', {
        method: 'DELETE',
      });
    });

    it('should specifically catch and throw exact string PROTECT if server indicates PROTECT code', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        json: async () => ({ code: 'PROTECT' }),
      } as unknown as Response);

      await expect(profileService.deleteAccount()).rejects.toThrow('PROTECT');
    });

    it('should fall back to general error if payload fails without PROTECT keyword', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'General DB error' }),
      } as unknown as Response);

      await expect(profileService.deleteAccount()).rejects.toThrow('General DB error');
    });
  });
});
