import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'La contraseña anterior es requerida' }),
    newPassword: z
      .string()
      .min(6, {
        message: 'La nueva contraseña debe tener al menos 6 caracteres',
      }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Confirma tu nueva contraseña' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'], // El error se asocia al campo confirmPassword
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
