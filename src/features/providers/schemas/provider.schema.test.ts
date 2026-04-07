/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { providerSchema } from './provider.schema';

describe('providerSchema', () => {
  const validData = {
    correo_proveedor: 'proveedor@example.com',
    nombre_proveedor: 'Empresa Test C.A.',
    rif_proveedor: 'J-12345678-9',
    tipo_persona: 'Juridica' as const,
    tipo_entidad_juridica: 'C.A.',
    estado: 'Distrito Capital',
    municipio: 'Libertador',
    parroquia: 'Catedral',
    direccion_fiscal: 'Av. Principal, Edificio Test',
    telefono_proveedor: '04121234567',
    nombre_rep_legal: 'Juan Pérez',
    cedula_rep_legal: 'V-12345678',
    tiene_rnc: true,
    tiene_solvencia_laboral: true,
    tiene_licencia_municipal: false,
    actividad_comercial_principal: 'Construcción',
    area_especialidad: 'Obras civiles',
    anos_experiencia: 5,
    fecha_estado_financiero: '2025-12-31',
    patrimonio_reportado: '1000000.50',
    nivel_contratacion: 'Nivel 1',
    desea_version_pro_proveedores: false,
  };

  it('should validate correct data successfully', () => {
    const result = providerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when correo_proveedor is invalid email', () => {
    const result = providerSchema.safeParse({
      ...validData,
      correo_proveedor: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when rif_proveedor has invalid format', () => {
    const result = providerSchema.safeParse({
      ...validData,
      rif_proveedor: '12345',
    });
    expect(result.success).toBe(false);
  });

  it('should accept valid RIF formats', () => {
    const validRifs = [
      'J-12345678-9',
      'V-00000001-0',
      'G-99999999-9',
      'E-12345678-0',
      'K-12345678-1',
    ];
    for (const rif of validRifs) {
      const result = providerSchema.safeParse({
        ...validData,
        rif_proveedor: rif,
      });
      expect(result.success).toBe(true);
    }
  });

  it('should fail when tipo_persona is not Natural or Juridica', () => {
    const result = providerSchema.safeParse({
      ...validData,
      tipo_persona: 'Otro',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when estado is empty', () => {
    const result = providerSchema.safeParse({
      ...validData,
      estado: '',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when telefono_proveedor is too short', () => {
    const result = providerSchema.safeParse({
      ...validData,
      telefono_proveedor: '0412',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when telefono_proveedor is too long', () => {
    const result = providerSchema.safeParse({
      ...validData,
      telefono_proveedor: '041212345678',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when cedula_rep_legal has invalid format', () => {
    const result = providerSchema.safeParse({
      ...validData,
      cedula_rep_legal: '12345678',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when anos_experiencia is negative', () => {
    const result = providerSchema.safeParse({
      ...validData,
      anos_experiencia: -1,
    });
    expect(result.success).toBe(false);
  });

  it('should fail when fecha_estado_financiero is an invalid date', () => {
    const result = providerSchema.safeParse({
      ...validData,
      fecha_estado_financiero: 'fecha-invalida',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when patrimonio_reportado has invalid format', () => {
    const result = providerSchema.safeParse({
      ...validData,
      patrimonio_reportado: 'abc',
    });
    expect(result.success).toBe(false);
  });

  it('should accept valid patrimonio_reportado formats', () => {
    const validValues = ['1000', '1000.50', '0', '1000000'];
    for (const val of validValues) {
      const result = providerSchema.safeParse({
        ...validData,
        patrimonio_reportado: val,
      });
      expect(result.success).toBe(true);
    }
  });

  it('should allow desea_version_pro_proveedores to be optional', () => {
    const dataWithout = { ...validData };
    delete (dataWithout as any).desea_version_pro_proveedores;
    const result = providerSchema.safeParse(dataWithout);
    expect(result.success).toBe(true);
  });

  it('should allow tipo_entidad_juridica to be optional', () => {
    const dataWithout = { ...validData };
    delete (dataWithout as any).tipo_entidad_juridica;
    const result = providerSchema.safeParse(dataWithout);
    expect(result.success).toBe(true);
  });
});
