'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { manualSchema, ManualFormSchema } from '../schemas/manualSchema';
import { createManual } from '../services/manualService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function ManualForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ManualFormSchema>({
    resolver: zodResolver(manualSchema),
  });

  const onSubmit = async (data: ManualFormSchema) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await createManual(data);
      alert('Manual generado exitosamente');
    } catch (error) {
      console.error(error);
      setSubmitError(
        'Hubo un error al generar el manual. Por favor intente nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-900">
          Elabora tu manual express
        </CardTitle>
        <CardDescription className="text-gray-500">
          Ingresa los datos básicos para generar una demostración del manual de
          concurso abierto. Lo recibirás en tu correo en pocos minutos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="nombre_institucion_ente"
              className="text-base font-semibold"
            >
              1. Indique el Nombre de la Institución / Ente / Órgano.
            </Label>
            <p className="text-sm text-gray-500">
              Ejemplo: Ingresa el nombre de la Institución/Ente/Órgano
            </p>
            <Input
              id="nombre_institucion_ente"
              {...register('nombre_institucion_ente')}
              className={errors.nombre_institucion_ente ? 'border-red-500' : ''}
            />
            {errors.nombre_institucion_ente && (
              <p className="text-sm text-red-500">
                {errors.nombre_institucion_ente.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="siglas_institucion_ente"
              className="text-base font-semibold"
            >
              2. Indique el Acrónimo y/o siglas de la Institución / Ente /
              Órgano.
            </Label>
            <p className="text-sm text-gray-500">
              Ejemplo: Ingresa el nombre de la Institución/Ente/Órgano
            </p>
            <Input
              id="siglas_institucion_ente"
              {...register('siglas_institucion_ente')}
              className={errors.siglas_institucion_ente ? 'border-red-500' : ''}
            />
            {errors.siglas_institucion_ente && (
              <p className="text-sm text-red-500">
                {errors.siglas_institucion_ente.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="nombre_unidad_admin_financiera"
              className="text-base font-semibold"
            >
              3. Indique el Nombre de la unidad / Gerencia y/u Oficina
              responsable de la gestión Administrativa y Financiera de la
              Institución / Ente / Órgano.
            </Label>
            <p className="text-sm text-gray-500">
              Ejemplo: Ingresa el nombre de la Unidad/Gerencia y/u Oficina
              responsable de la gestión Administrativa y Financiera.
            </p>
            <Input
              id="nombre_unidad_admin_financiera"
              {...register('nombre_unidad_admin_financiera')}
              className={
                errors.nombre_unidad_admin_financiera ? 'border-red-500' : ''
              }
            />
            {errors.nombre_unidad_admin_financiera && (
              <p className="text-sm text-red-500">
                {errors.nombre_unidad_admin_financiera.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="nombre_unidad_sistemas_tecnologia"
              className="text-base font-semibold"
            >
              4. Indique el Nombre de la Unidad / Gerencia y/u Oficina
              responsable del Área de Sistema y Tecnología de la Institución /
              Ente / Órgano.
            </Label>
            <p className="text-sm text-gray-500">
              Ejemplo: Ingresa el nombre de la Unidad/Gerencia y/u Oficina
              responsable del Área de Sistema y Tecnología.
            </p>
            <Input
              id="nombre_unidad_sistemas_tecnologia"
              {...register('nombre_unidad_sistemas_tecnologia')}
              className={
                errors.nombre_unidad_sistemas_tecnologia ? 'border-red-500' : ''
              }
            />
            {errors.nombre_unidad_sistemas_tecnologia && (
              <p className="text-sm text-red-500">
                {errors.nombre_unidad_sistemas_tecnologia.message}
              </p>
            )}
          </div>

          {submitError && (
            <p className="text-sm text-red-500 font-bold">{submitError}</p>
          )}

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]"
            >
              {isSubmitting ? 'Generando...' : 'Elaborar manual'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
