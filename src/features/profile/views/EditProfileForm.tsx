'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FormHeader } from '@/components/shared/FormHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';
import {
  editProfileSchema,
  EditProfileFormValues,
} from '../schemas/edit-profile.schema';
import { profileService, ProfileResponse } from '../services/profile.service';

export const EditProfileForm = () => {
  const [globalError, setGlobalError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState<ProfileResponse | null>(
    null
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      institution: '',
      role: '',
    },
  });

  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setOriginalData(data);
        setUserEmail(data.email);
        setValue('firstName', data.first_name);
        setValue('lastName', data.last_name);
        setValue('phone', data.telefono);
        setValue('institution', data.nombre_institucion_ente);
        setValue('role', data.cargo);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setGlobalError('No se pudieron cargar los datos del perfil.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [setValue]);

  const handleCancel = () => {
    if (originalData) {
      reset({
        firstName: originalData.first_name,
        lastName: originalData.last_name,
        phone: originalData.telefono,
        institution: originalData.nombre_institucion_ente,
        role: originalData.cargo,
      });
    }
    setIsEditing(false);
    setGlobalError('');
  };

  const onSubmit = async (data: EditProfileFormValues) => {
    setGlobalError('');
    try {
      const updatedData = await profileService.updateProfile(data);
      setOriginalData(updatedData); // Actualizar los datos originales con los nuevos
      setIsEditing(false); // Salir del modo edición al guardar con éxito

      Swal.fire({
        title: '¡Éxito!',
        text: 'Datos de perfil actualizados correctamente',
        icon: 'success',
        confirmButtonColor: '#0080B0',
      });
    } catch (err: unknown) {
      console.error(err);
      Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un error al actualizar datos de perfil.',
        icon: 'error',
        confirmButtonColor: '#0080B0',
      });
      if (err instanceof Error) {
        setGlobalError(err.message);
      } else {
        setGlobalError('Ocurrió un error al actualizar los datos.');
      }
    }
  };

  if (isLoading) {
    return (
      <Card className="border-none shadow-none flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#0080B0] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Cargando datos del perfil...</p>
        </div>
      </Card>
    );
  }

  // Clase CSS compartida para los inputs deshabilitados
  const disabledInputClass =
    'bg-gray-100 text-black-500 cursor-not-allowed border-gray-200 opacity-100';

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <FormHeader
          title="Información del perfil"
          description="Consulta y actualiza los datos de tu cuenta."
          className="mb-0"
        />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="email">Correo electrónico</Label>
              {isEditing && (
                <span className="text-xs text-orange-500 font-medium italic">
                  Campo no modificable
                </span>
              )}
            </div>
            <Input
              id="email"
              type="email"
              value={userEmail}
              disabled
              className={disabledInputClass}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              disabled={!isEditing}
              className={`${errors.firstName ? 'border-red-500' : ''} ${!isEditing ? disabledInputClass : ''}`}
              {...register('firstName')}
            />
            {errors.firstName && isEditing && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              disabled={!isEditing}
              className={`${errors.lastName ? 'border-red-500' : ''} ${!isEditing ? disabledInputClass : ''}`}
              {...register('lastName')}
            />
            {errors.lastName && isEditing && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              disabled={!isEditing}
              className={`${errors.phone ? 'border-red-500' : ''} ${!isEditing ? disabledInputClass : ''}`}
              {...register('phone')}
            />
            {errors.phone && isEditing && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution">Institución</Label>
            <Input
              id="institution"
              disabled={!isEditing}
              className={`${errors.institution ? 'border-red-500' : ''} ${!isEditing ? disabledInputClass : ''}`}
              {...register('institution')}
            />
            {errors.institution && isEditing && (
              <p className="text-sm text-red-500">
                {errors.institution.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Cargo</Label>
            <Input
              id="role"
              disabled={!isEditing}
              className={`${errors.role ? 'border-red-500' : ''} ${!isEditing ? disabledInputClass : ''}`}
              {...register('role')}
            />
            {errors.role && isEditing && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          {globalError && isEditing && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {globalError}
            </div>
          )}

          <div className="flex justify-end pt-4 gap-3">
            {!isEditing ? (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-[#0080B0] hover:bg-[#00668C] text-white"
              >
                Editar perfil
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0080B0] hover:bg-[#00668C] text-white disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
