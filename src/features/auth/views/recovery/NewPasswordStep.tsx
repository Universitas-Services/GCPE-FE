'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRecovery } from '@/features/auth/context/RecoveryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'La confirmación de contraseña es requerida' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function NewPasswordStep() {
  const { formData, updateFormData } = useRecovery();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: formData.password || '',
      confirmPassword: formData.confirmPassword || '',
    },
  });

  const onSubmit = (data: PasswordFormValues) => {
    updateFormData(data);
    // Here we would call API to reset password
    console.log('Resetting password for:', formData.email);
    console.log('New password:', data.password);

    // Redirect to login or show success message
    // For now redirecting to login
    router.push('/login');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700">
          Nueva contraseña
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Mínimo de caracteres"
          className={`bg-gray-50 border-gray-200 ${errors.password ? 'border-red-500' : ''}`}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-700">
          Confirmar nueva contraseña
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirma tu nueva contraseña"
          className={`bg-gray-50 border-gray-200 ${errors.confirmPassword ? 'border-red-500' : ''}`}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#008CBA] hover:bg-[#007da6] text-white py-6 text-lg shadow-sm"
      >
        Actualizar
      </Button>
    </form>
  );
}
