/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { complianceService } from './compliance.service';
import type {
  GeneralData,
  ComplianceAnswers,
} from '../context/ComplianceContext';

vi.mock('@/lib/api-client', () => ({
  fetchApi: vi.fn(),
}));

import { fetchApi } from '@/lib/api-client';

const mockFetchApi = vi.mocked(fetchApi);

describe('complianceService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockFetchApi.mockClear();
    vi.spyOn(console, 'error').mockImplementation(vi.fn());
  });

  // Use local-time Date constructor to avoid UTC midnight timezone shift
  const mockGeneralData: GeneralData = {
    email: 'test@example.com',
    entityName: 'Entidad Test',
    unitName: 'Unidad Test',
    reviewDate: new Date(2025, 5, 15), // June 15, 2025 in local time
    reviewerName: 'Revisor Test',
    documentCode: 'DOC-001',
  };

  // Build a full set of answers for questions 1-24
  function buildAllAnswers(
    overrides?: Partial<ComplianceAnswers>
  ): ComplianceAnswers {
    const answers: ComplianceAnswers = {};
    for (let i = 1; i <= 24; i++) {
      answers[i] = 'SI';
    }
    return { ...answers, ...(overrides as ComplianceAnswers) };
  }

  describe('submitComplianceForm', () => {
    it('should call fetchApi with correct payload and return data on success', async () => {
      const responseData = { id: 1, status: 'ok' };
      mockFetchApi.mockResolvedValue({
        ok: true,
        json: async () => responseData,
      } as unknown as Response);

      const answers = buildAllAnswers();
      const result = await complianceService.submitComplianceForm(
        mockGeneralData,
        answers
      );

      expect(mockFetchApi).toHaveBeenCalledWith(
        '/api/compliance/enviar-email',
        {
          method: 'POST',
          body: expect.any(String),
        }
      );

      const calledBody = JSON.parse(
        (mockFetchApi.mock.calls[0][1] as any).body
      );
      expect(calledBody.persona_contacto).toBe('test@example.com');
      expect(calledBody.nombre_organo_entidad).toBe('Entidad Test');
      expect(calledBody.nombre_unidad_revisora).toBe('Unidad Test');
      expect(calledBody.nomenclatura).toBe('DOC-001');
      expect(calledBody.nombre_completo_revisor).toBe('Revisor Test');
      expect(calledBody.fecha_revision).toBe('2025-06-15');

      // Verify answers are mapped
      expect(calledBody.caaue1_incluye_actividades_previas).toBe('SI');
      expect(calledBody.caaue24_archivo_custodia).toBe('SI');

      expect(result).toEqual(responseData);
    });

    it('should map NO_APLICA answers to NA', async () => {
      mockFetchApi.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 1 }),
      } as unknown as Response);

      const answers = buildAllAnswers({ 5: 'NO_APLICA' });

      await complianceService.submitComplianceForm(mockGeneralData, answers);

      const calledBody = JSON.parse(
        (mockFetchApi.mock.calls[0][1] as any).body
      );
      expect(calledBody.caaue5_publicacion_llamado_ente).toBe('NA');
      // Other answers should remain 'SI'
      expect(calledBody.caaue1_incluye_actividades_previas).toBe('SI');
    });

    it('should throw error with status and detail when API fails', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ detail: 'Datos inválidos' }),
      } as unknown as Response);

      const answers = buildAllAnswers();
      await expect(
        complianceService.submitComplianceForm(mockGeneralData, answers)
      ).rejects.toThrow('[400] Datos inválidos');
    });

    it('should throw error with fallback message when API fails without detail', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      } as unknown as Response);

      const answers = buildAllAnswers();
      await expect(
        complianceService.submitComplianceForm(mockGeneralData, answers)
      ).rejects.toThrow('[500] Error al enviar el formulario');
    });

    it('should use default date when reviewDate is not provided', async () => {
      mockFetchApi.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 1 }),
      } as unknown as Response);

      const dataNoDate = { ...mockGeneralData, reviewDate: undefined };
      const answers = buildAllAnswers();
      await complianceService.submitComplianceForm(dataNoDate, answers);

      const calledBody = JSON.parse(
        (mockFetchApi.mock.calls[0][1] as any).body
      );
      // Should use today's date in YYYY-MM-DD format
      expect(calledBody.fecha_revision).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should use NA for empty generalData fields and fail schema validation', async () => {
      const emptyData: GeneralData = {
        email: '',
        entityName: '',
        unitName: '',
        reviewerName: '',
        documentCode: '',
      };

      const answers = buildAllAnswers();
      // Schema validates email, so 'NA' will fail z.string().email()
      await expect(
        complianceService.submitComplianceForm(emptyData, answers)
      ).rejects.toThrow();
    });
  });

  describe('downloadPdf', () => {
    it('should create download link and trigger click on success', async () => {
      const mockBlob = new Blob(['pdf-content'], {
        type: 'application/pdf',
      });
      mockFetchApi.mockResolvedValue({
        ok: true,
        blob: async () => mockBlob,
      } as unknown as Response);

      const mockUrl = 'blob:http://localhost/fake-url';
      const createObjectURLSpy = vi
        .spyOn(window.URL, 'createObjectURL')
        .mockReturnValue(mockUrl);
      const revokeObjectURLSpy = vi
        .spyOn(window.URL, 'revokeObjectURL')
        .mockImplementation(vi.fn());

      const mockAnchor = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      vi.spyOn(document, 'createElement').mockReturnValue(
        mockAnchor as unknown as HTMLAnchorElement
      );
      vi.spyOn(document.body, 'appendChild').mockImplementation(vi.fn() as any);
      vi.spyOn(document.body, 'removeChild').mockImplementation(vi.fn() as any);

      await complianceService.downloadPdf(42);

      expect(mockFetchApi).toHaveBeenCalledWith('/api/compliance/42/pdf');
      expect(createObjectURLSpy).toHaveBeenCalledWith(mockBlob);
      expect(mockAnchor.href).toBe(mockUrl);
      expect(mockAnchor.download).toBe('compliance_report_42.pdf');
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith(mockUrl);
    });

    it('should throw error with status when API fails', async () => {
      mockFetchApi.mockResolvedValue({
        ok: false,
        status: 404,
      } as unknown as Response);

      await expect(complianceService.downloadPdf(99)).rejects.toThrow(
        '[404] PDF: Error al descargar el PDF'
      );
    });
  });
});
