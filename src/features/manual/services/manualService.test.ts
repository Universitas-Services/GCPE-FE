/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createManual } from './manualService';

vi.mock('@/lib/api-client', () => ({
  fetchApi: vi.fn(),
}));

import { fetchApi } from '@/lib/api-client';

const mockFetchApi = vi.mocked(fetchApi);

describe('manualService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('createManual', () => {
    const mockData = {
      organo: 'Organo Test',
      modalidad: 'Contratación Directa',
      email: 'test@example.com',
    };

    it('should call fetchApi with correct endpoint and body on success', async () => {
      mockFetchApi.mockResolvedValue({ ok: true } as Response);

      await createManual(mockData as any);

      expect(mockFetchApi).toHaveBeenCalledWith('/api/manual/enviar-email', {
        method: 'POST',
        body: JSON.stringify(mockData),
      });
    });

    it('should not throw when response is ok', async () => {
      mockFetchApi.mockResolvedValue({ ok: true } as Response);

      await expect(createManual(mockData as any)).resolves.toBeUndefined();
    });

    it('should throw error when response is not ok', async () => {
      mockFetchApi.mockResolvedValue({ ok: false, status: 500 } as Response);

      await expect(createManual(mockData as any)).rejects.toThrow(
        'Error al enviar el manual por correo electrónico'
      );
    });
  });
});
