import { z } from 'zod';

export const providerSchema = z.object({
  correo_proveedor: z.string().email('Correo electrónico inválido'),
  nombre_proveedor: z.string().min(1, 'El nombre o razón social es requerido'),
  rif_proveedor: z
    .string()
    .regex(/^[KVJEG]-\d{8}-\d$/, 'Formato de RIF inválido (Ej: J-00000000-0)'),
  tipo_persona: z.enum(['Natural', 'Juridica']),
  tipo_entidad_juridica: z.string().optional(),
  estado: z.string().min(1, 'El estado es requerido'),
  municipio: z.string().min(1, 'El municipio es requerido'),
  parroquia: z.string().min(1, 'La parroquia es requerida'),
  direccion_fiscal: z.string().min(1, 'La dirección fiscal es requerida'),
  telefono_proveedor: z.string().min(1, 'El teléfono es requerido'),
  nombre_rep_legal: z
    .string()
    .min(1, 'El nombre del representante legal es requerido'),
  cedula_rep_legal: z
    .string()
    .regex(/^[VE]-\d{1,8}(\.\d{3})?(\.\d{3})?$/, 'Formato de cédula inválido'),

  // Step 2
  tiene_rnc: z.boolean(),
  tiene_solvencia_laboral: z.boolean(),
  tiene_licencia_municipal: z.boolean(),

  // Step 3
  actividad_comercial_principal: z.boolean(), // Based on JSON requirement being boolean/false default
  area_especialidad: z.string().min(1, 'El área de especialidad es requerida'),
  anos_experiencia: z
    .number()
    .min(0, 'Los años de experiencia deben ser 0 o más'),
  fecha_estado_financiero: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Fecha inválida',
    }),
  patrimonio_reportado: z.string().min(1, 'El patrimonio es requerido'),
  nivel_contratacion: z
    .string()
    .min(1, 'El nivel de contratación es requerido'),

  // Step 4
  desea_version_pro_proveedores: z.boolean().optional(),
});

export type ProviderSchema = z.infer<typeof providerSchema>;

// Partial schemas for step validation could be derived if needed,
// or verified by checking specific fields in the context.
