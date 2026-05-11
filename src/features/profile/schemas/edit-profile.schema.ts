import { z } from 'zod';

export const editProfileSchema = z.object({
  firstName: z.string().min(1, { message: 'El nombre es requerido' }),
  lastName: z.string().min(1, { message: 'El apellido es requerido' }),
  phone: z.string().min(1, { message: 'El teléfono es requerido' }),
  institution: z.string().min(1, { message: 'La institución es requerida' }),
  role: z.string().min(1, { message: 'El cargo es requerido' }),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
