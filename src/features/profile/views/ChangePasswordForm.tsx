'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';
import {
  changePasswordSchema,
  ChangePasswordFormValues,
} from '../schemas/change-password.schema';

export const ChangePasswordForm = () => {
  const [globalError, setGlobalError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async () => {
    setGlobalError('');
    try {
      // Simulación de llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Swal.fire({
        title: '¡Éxito!',
        text: 'Tu contraseña ha sido actualizada correctamente.',
        icon: 'success',
        confirmButtonColor: '#0080B0',
      });
      reset(); // Limpia los campos
    } catch (err: unknown) {
      if (err instanceof Error) {
        setGlobalError(err.message);
      } else {
        setGlobalError('Ocurrió un error al cambiar la contraseña.');
      }
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl text-[#003366]">
          Cambiar contraseña
        </CardTitle>
        <CardDescription>
          Para mayor seguridad, te recomendamos usar una contraseña única que no
          utilices en otros sitios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña anterior</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="***********"
              className={errors.currentPassword ? 'border-red-500' : ''}
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <p className="text-sm text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="***********"
              className={errors.newPassword ? 'border-red-500' : ''}
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="***********"
              className={errors.confirmPassword ? 'border-red-500' : ''}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {globalError && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {globalError}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0080B0] hover:bg-[#00668C] text-white disabled:opacity-50"
            >
              {isSubmitting ? 'Cambiando...' : 'Cambiar contraseña'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
