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
  editProfileSchema,
  EditProfileFormValues,
} from '../schemas/edit-profile.schema';

export const EditProfileForm = () => {
  const [globalError, setGlobalError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: 'Juan',
      lastName: 'Lopez',
      phone: '0123456789',
      institution: 'Instituto de la intuición',
      role: 'Jefe',
    },
  });

  const onSubmit = async () => {
    setGlobalError('');
    try {
      // Simulación de llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Swal.fire({
        title: '¡Éxito!',
        text: 'Los datos del perfil se han actualizado correctamente.',
        icon: 'success',
        confirmButtonColor: '#0080B0',
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setGlobalError(err.message);
      } else {
        setGlobalError('Ocurrió un error al actualizar los datos.');
      }
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl text-[#003366]">
          Información del perfil
        </CardTitle>
        <CardDescription>
          Actualiza los datos de tu cuenta. El correo no puede ser modificado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              defaultValue="juan.l@email.com"
              disabled
              className="bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              className={errors.firstName ? 'border-red-500' : ''}
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              className={errors.lastName ? 'border-red-500' : ''}
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              className={errors.phone ? 'border-red-500' : ''}
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution">Institución</Label>
            <Input
              id="institution"
              className={errors.institution ? 'border-red-500' : ''}
              {...register('institution')}
            />
            {errors.institution && (
              <p className="text-sm text-red-500">
                {errors.institution.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Cargo</Label>
            <Input
              id="role"
              className={errors.role ? 'border-red-500' : ''}
              {...register('role')}
            />
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
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
              {isSubmitting ? 'Actualizando...' : 'Actualizar datos de perfil'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
