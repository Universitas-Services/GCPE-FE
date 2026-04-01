import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createProvider, getProviders } from './providers.service';
import { ProviderFormData } from '../types/provider.types';
import { fetchApi } from '@/lib/api-client';

vi.mock('@/lib/api-client', () => ({
  fetchApi: vi.fn(),
}));

describe('Providers Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createProvider', () => {
    const mockData: ProviderFormData = {
      tipo_persona: 'Natural',
      anos_experiencia: '5' as unknown,
      correo_proveedor: 'test@provider.com',
    } as unknown as ProviderFormData;

    it('should map natural person properly and convert anos_experiencia to number, returning JSON', async () => {
      const mockResponse = { id: 10, target_status: 'created' };

      (fetchApi as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await createProvider(mockData);

      expect(fetchApi).toHaveBeenCalledWith('/api/proveedores', {
        method: 'POST',
        body: JSON.stringify({
          ...mockData,
          tipo_persona: 'N', // Translated 'Natural' -> 'N'
          anos_experiencia: 5, // Casted '5' -> 5
        }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should translate Juridica to J', async () => {
      const mockDataJuridica: ProviderFormData = {
        ...mockData,
        tipo_persona: 'Juridica',
      } as unknown as ProviderFormData;

      (fetchApi as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await createProvider(mockDataJuridica);

      expect(fetchApi).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          body: expect.stringContaining('"tipo_persona":"J"'),
        })
      );
    });

    it('should throw error from response json if response is not ok', async () => {
      const errorData = { detail: 'Validación fallida' };
      (fetchApi as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        json: async () => errorData,
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

      await expect(createProvider(mockData)).rejects.toEqual(errorData);
      expect(consoleSpy).toHaveBeenCalledWith('API Error:', errorData);
    });

    it('should throw an empty error object if json parsing fails', async () => {
      (fetchApi as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        json: async () => {
          throw new Error('Unparseable data');
        },
      });

      vi.spyOn(console, 'error').mockImplementation(vi.fn());

      await expect(createProvider(mockData)).rejects.toEqual({});
    });
  });

  describe('getProviders', () => {
    it('should call fetchApi without params if none provided', async () => {
      (fetchApi as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ results: [] }),
      });

      await getProviders();

      expect(fetchApi).toHaveBeenCalledWith('/api/proveedores');
    });

    it('should append params properly to query string', async () => {
      (fetchApi as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ results: [] }),
      });

      await getProviders({ q: 'Search Term', page: 2, page_size: 15 });

      expect(fetchApi).toHaveBeenCalledWith(
        expect.stringMatching(
          /\/api\/proveedores\?q=Search\+Term&page=2&page_size=15$/
        )
      );
    });

    it('should throw explicit error detailing the issue when api fails', async () => {
      const errorData = { detail: 'No tienes pemisos' };
      (fetchApi as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        json: async () => errorData,
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

      await expect(getProviders()).rejects.toThrow('No tienes pemisos');
      expect(consoleSpy).toHaveBeenCalledWith('API Error:', errorData);
    });

    it('should throw generic fallback error if api fails without returning json', async () => {
      (fetchApi as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        json: async () => {
          throw new Error('Bad HTML body');
        },
      });

      vi.spyOn(console, 'error').mockImplementation(vi.fn());

      await expect(getProviders()).rejects.toThrow('Error desconocido');
    });
  });
});
