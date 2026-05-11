import { z } from 'zod';

export const manualSchema = z.object({
  correo_electronico_manual: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Debe ser un correo electrónico válido'),
  nombre_institucion_ente: z
    .string()
    .min(1, 'El nombre de la Institución/Ente/Órgano es requerido'),
  siglas_institucion_ente: z
    .string()
    .min(1, 'El acrónimo o siglas son requeridos'),
  nombre_unidad_admin_financiera: z
    .string()
    .min(1, 'El nombre de la unidad administrativa/financiera es requerido'),
  nombre_unidad_sistemas_tecnologia: z
    .string()
    .min(1, 'El nombre de la unidad de sistemas/tecnología es requerido'),
});

export type ManualFormSchema = z.infer<typeof manualSchema>;
