import { describe, it, expect } from 'vitest';
import { manualSchema } from './manualSchema';

describe('Manual Feature: manualSchema', () => {
  it('should validate a correct manual form object', () => {
    const validData = {
      correo_electronico_manual: 'test@example.com',
      nombre_institucion_ente: 'Ministerio de Prueba',
      siglas_institucion_ente: 'MPR',
      nombre_unidad_admin_financiera: 'Finanzas',
      nombre_unidad_sistemas_tecnologia: 'Sistemas',
    };

    const result = manualSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  describe('Field: correo_electronico_manual', () => {
    it('should fail if empty or missing', () => {
      const data = {
        correo_electronico_manual: '',
        nombre_institucion_ente: 'Institucion',
        siglas_institucion_ente: 'INST',
        nombre_unidad_admin_financiera: 'Admin',
        nombre_unidad_sistemas_tecnologia: 'Tech',
      };
      const result = manualSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El correo electrónico es requerido');
      }
    });

    it('should fail if it is an invalid email format', () => {
      const data = {
        correo_electronico_manual: 'not-an-email',
        nombre_institucion_ente: 'Institucion',
        siglas_institucion_ente: 'INST',
        nombre_unidad_admin_financiera: 'Admin',
        nombre_unidad_sistemas_tecnologia: 'Tech',
      };
      const result = manualSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Debe ser un correo electrónico válido');
      }
    });
  });

  describe('Other Required Fields', () => {
    // A custom setup to verify empty fields block validation
    it('should fail if nombre_institucion_ente is empty', () => {
      const data = {
        correo_electronico_manual: 'test@example.com',
        nombre_institucion_ente: '',
        siglas_institucion_ente: 'INST',
        nombre_unidad_admin_financiera: 'Admin',
        nombre_unidad_sistemas_tecnologia: 'Tech',
      };
      const result = manualSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El nombre de la Institución/Ente/Órgano es requerido');
      }
    });

    it('should fail if siglas_institucion_ente is empty', () => {
      const data = {
        correo_electronico_manual: 'test@example.com',
        nombre_institucion_ente: 'Institucion',
        siglas_institucion_ente: '',
        nombre_unidad_admin_financiera: 'Admin',
        nombre_unidad_sistemas_tecnologia: 'Tech',
      };
      const result = manualSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El acrónimo o siglas son requeridos');
      }
    });

    it('should fail if nombre_unidad_admin_financiera is empty', () => {
      const data = {
        correo_electronico_manual: 'test@example.com',
        nombre_institucion_ente: 'Institucion',
        siglas_institucion_ente: 'INST',
        nombre_unidad_admin_financiera: '',
        nombre_unidad_sistemas_tecnologia: 'Tech',
      };
      const result = manualSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El nombre de la unidad administrativa/financiera es requerido');
      }
    });

    it('should fail if nombre_unidad_sistemas_tecnologia is empty', () => {
      const data = {
        correo_electronico_manual: 'test@example.com',
        nombre_institucion_ente: 'Institucion',
        siglas_institucion_ente: 'INST',
        nombre_unidad_admin_financiera: 'Admin',
        nombre_unidad_sistemas_tecnologia: '',
      };
      const result = manualSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El nombre de la unidad de sistemas/tecnología es requerido');
      }
    });
  });
});
