'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { manualSchema, ManualFormSchema } from '../schemas/manualSchema';
import { createManual } from '../services/manualService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="shrink-0 p-2 md:p-4 pb-1 md:pb-2 border-b border-gray-100 bg-white z-10">
        <h2 className="text-xl md:text-2xl font-bold text-[#001f5c] mb-1">
          Elabora tu manual express
        </h2>
        <p className="text-sm text-gray-500">
          Ingresa los datos básicos para generar una demostración del manual de
          concurso abierto. Lo recibirás en tu correo en pocos minutos.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-1 overflow-hidden bg-white"
      >
        <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4 pt-4">
          <div className="space-y-2">
            <Label
              htmlFor="nombre_institucion_ente"
              className="text-base font-semibold"
            >
              1. Indique el Nombre de la Institución / Ente / Órgano.
            </Label>
            <p className="text-sm text-gray-500 italic">
              Ejemplo: Ingresa el nombre de la Institución/Ente/Órgano
            </p>
            <Input
              id="nombre_institucion_ente"
              {...register('nombre_institucion_ente')}
              className={`h-10 ${errors.nombre_institucion_ente ? 'border-red-500' : ''}`}
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
            <p className="text-sm text-gray-500 italic">
              Ejemplo: Ingresa el nombre de la Institución/Ente/Órgano
            </p>
            <Input
              id="siglas_institucion_ente"
              {...register('siglas_institucion_ente')}
              className={`h-10 ${errors.siglas_institucion_ente ? 'border-red-500' : ''}`}
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
            <p className="text-sm text-gray-500 italic">
              Ejemplo: Ingresa el nombre de la Unidad/Gerencia y/u Oficina
              responsable de la gestión Administrativa y Financiera.
            </p>
            <Input
              id="nombre_unidad_admin_financiera"
              {...register('nombre_unidad_admin_financiera')}
              className={`h-10 ${
                errors.nombre_unidad_admin_financiera ? 'border-red-500' : ''
              }`}
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
            <p className="text-sm text-gray-500 italic">
              Ejemplo: Ingresa el nombre de la Unidad/Gerencia y/u Oficina
              responsable del Área de Sistema y Tecnología.
            </p>
            <Input
              id="nombre_unidad_sistemas_tecnologia"
              {...register('nombre_unidad_sistemas_tecnologia')}
              className={`h-10 ${
                errors.nombre_unidad_sistemas_tecnologia ? 'border-red-500' : ''
              }`}
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
        </div>

        <div className="shrink-0 py-2 px-8 border-t border-gray-200 bg-white flex justify-end shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 items-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#001f5c] hover:bg-[#001540] text-white px-6 py-2 text-base rounded-xl min-w-[150px] h-auto"
          >
            {isSubmitting ? 'Generando...' : 'Elaborar manual'}
          </Button>
        </div>
      </form>
    </div>
  );
}
