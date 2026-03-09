import { z } from 'zod';

export const providerSchema = z.object({
  correo_proveedor: z
    .string({ message: 'El correo electrónico es requerido' })
    .email('Correo electrónico inválido'),
  nombre_proveedor: z
    .string({ message: 'El nombre o razón social es requerido' })
    .min(1, 'El nombre o razón social es requerido'),
  rif_proveedor: z
    .string({ message: 'El RIF es requerido' })
    .regex(/^[KVJEG]-\d{8}-\d$/, 'Formato de RIF inválido (Ej: J-12345678-9)'),
  tipo_persona: z.enum(['Natural', 'Juridica'], {
    message: 'El tipo de persona es requerido',
  }),
  tipo_entidad_juridica: z.string().optional(),
  estado: z
    .string({ message: 'El estado es requerido' })
    .min(1, 'El estado es requerido'),
  municipio: z
    .string({ message: 'El municipio es requerido' })
    .min(1, 'El municipio es requerido'),
  parroquia: z
    .string({ message: 'La parroquia es requerida' })
    .min(1, 'La parroquia es requerida'),
  direccion_fiscal: z
    .string({ message: 'La dirección fiscal es requerida' })
    .min(1, 'La dirección fiscal es requerida'),
  telefono_proveedor: z
    .string({ message: 'El teléfono es requerido' })
    .min(1, 'El teléfono es requerido'),
  nombre_rep_legal: z
    .string({ message: 'El nombre del representante legal es requerido' })
    .min(1, 'El nombre del representante legal es requerido'),
  cedula_rep_legal: z
    .string({ message: 'La cédula es requerida' })
    .regex(/^[VE]-\d{1,8}(\.\d{3})?(\.\d{3})?$/, 'Formato de cédula inválido'),

  // Step 2
  tiene_rnc: z.boolean({ message: 'Este campo es requerido' }),
  tiene_solvencia_laboral: z.boolean({ message: 'Este campo es requerido' }),
  tiene_licencia_municipal: z.boolean({ message: 'Este campo es requerido' }),

  // Step 3
  actividad_comercial_principal: z.boolean({
    message: 'Este campo es requerido',
  }),
  area_especialidad: z
    .string({ message: 'El área de especialidad es requerida' })
    .min(1, 'El área de especialidad es requerida'),
  anos_experiencia: z
    .number({
      message: 'Los años de experiencia son requeridos',
    })
    .min(0, 'Los años de experiencia deben ser 0 o más'),
  fecha_estado_financiero: z
    .string({ message: 'La fecha del estado financiero es requerida' })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Fecha inválida',
    }),
  patrimonio_reportado: z
    .string({ message: 'El patrimonio reportado es requerido' })
    .min(1, 'El patrimonio es requerido'),
  nivel_contratacion: z
    .string({ message: 'El nivel de contratación es requerido' })
    .min(1, 'El nivel de contratación es requerido'),

  // Step 4
  desea_version_pro_proveedores: z.boolean().optional(),
});

export type ProviderSchema = z.infer<typeof providerSchema>;

// Partial schemas for step validation could be derived if needed,
// or verified by checking specific fields in the context.
