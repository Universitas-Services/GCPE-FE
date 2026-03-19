'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/features/auth/context/RegisterContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const credentialsSchema = z
  .object({
    email: z.string().email({ message: 'El correo electrónico no es válido' }),
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

type CredentialsFormValues = z.infer<typeof credentialsSchema>;

export function CredentialsStep() {
  const { formData, updateFormData, nextStep } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      email: formData.email || '',
      password: formData.password || '',
      confirmPassword: formData.confirmPassword || '',
    },
  });

  const onSubmit = (data: CredentialsFormValues) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <div className="w-full max-w-md space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1">
          <Label htmlFor="email" className="text-[12.96px] font-semibold">
            Correo electrónico
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Ingresa tu correo"
            className={`h-9 ${errors.email ? 'border-red-500' : ''}`}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <Label htmlFor="password" className="text-[12.96px] font-semibold">
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            className={`h-9 ${errors.password ? 'border-red-500' : ''}`}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <Label
            htmlFor="confirmPassword"
            className="text-[12.96px] font-semibold"
          >
            Repite la contraseña
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            className={`h-9 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full btn-primary py-2 text-sm shadow-sm"
        >
          Siguiente
        </Button>

        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full bg-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-400">o</span>
          </div>
        </div>

        <div className="text-center text-[12.96px] font-medium text-gray-500">
          ¿Tienes una cuenta?{' '}
          <Link
            href="/login"
            className="font-semibold text-[#008CBA] hover:underline"
          >
            Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
