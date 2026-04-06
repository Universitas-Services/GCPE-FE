import { describe, it, expect } from 'vitest';
import { complianceFormSchema } from './compliance.schema';

describe('complianceFormSchema', () => {
  const validPayload = {
    correo_electronico: 'test@example.com',
    nombre_organo_entidad: 'Entidad Test',
    nombre_unidad_revisora: 'Unidad Test',
    fecha_revision: '2025-12-31',
    nombre_completo_revisor: 'Revisor Test',
    nomenclatura: 'DOC-001',
    caaue1_incluye_actividades_previas: 'SI',
    caaue2_incluye_acta_inicio: 'NO',
    caaue3_incluye_pliego_condiciones: 'NA',
    caaue4_publicacion_llamado_snc: 'SI',
    caaue5_publicacion_llamado_ente: 'SI',
    caaue6_incluye_registro_adquirientes: 'NO',
    caaue7_incluye_modificaciones: 'NA',
    caaue8_incluye_acta_recepcion_sobres: 'SI',
    caaue9_incluye_acta_apertura_sobres: 'SI',
    caaue10_incluye_ofertas: 'SI',
    caaue11_incluye_garantias_sostenimiento: 'NO',
    caaue12_incluye_certificado_rnc: 'SI',
    caaue13_incluye_certificado_snc: 'SI',
    caaue14_incluye_solvencias: 'SI',
    caaue15_incluye_informe_recomendacion: 'NO',
    caaue16_incluye_adjudicacion: 'SI',
    caaue17_incluye_notificacion: 'SI',
    caaue18_incluye_garantias_contratacion: 'NA',
    caaue19_incluye_contrato_u_orden: 'SI',
    caaue20_incluye_resp_social: 'SI',
    caaue21_identificacion_nomenclatura: 'SI',
    caaue22_expediente_foliado: 'NO',
    caaue23_identificacion_tomos: 'SI',
    caaue24_archivo_custodia: 'SI',
  };

  it('should validate a correct compliance payload', () => {
    const result = complianceFormSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('should fail when correo_electronico is not a valid email', () => {
    const result = complianceFormSchema.safeParse({
      ...validPayload,
      correo_electronico: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when a required string field is missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { nombre_organo_entidad, ...incomplete } = validPayload;
    const result = complianceFormSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });

  it('should fail when a caaue field is missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { caaue1_incluye_actividades_previas, ...incomplete } = validPayload;
    const result = complianceFormSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });

  it('should accept all valid answer values (SI, NO, NA, NO_APLICA)', () => {
    // All string values are valid since schema uses z.string()
    const result = complianceFormSchema.safeParse({
      ...validPayload,
      caaue1_incluye_actividades_previas: 'NO_APLICA',
    });
    expect(result.success).toBe(true);
  });
});
