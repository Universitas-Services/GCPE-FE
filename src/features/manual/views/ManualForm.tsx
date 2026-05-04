'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { manualSchema, ManualFormSchema } from '../schemas/manualSchema';
import { createManual } from '../services/manualService';
import { Button } from '@/components/ui/button';
import { FormHeader } from '@/components/shared/FormHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ManualForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ManualFormSchema>({
    resolver: zodResolver(manualSchema),
  });

  const onSubmit = (data: ManualFormSchema) => {
    setIsSubmitting(true);
    toast.info(
      <span className="text-slate-800 font-medium">
        Estamos elaborando su manual, en breves minutos estará disponible en su
        correo electrónico, redireccionando al dashboard en 4 segundos...
      </span>,
      { position: 'top-center', duration: 4000 }
    );

    // Fire-and-forget: lanzar la petición sin bloquear la redirección ni el proxy
    createManual(data)
      .then(() => {
        toast.success(
          <span className="text-slate-800 font-medium">
            Su manual se ha elaborado y enviado correctamente a su correo
            electrónico
          </span>,
          { position: 'top-center', duration: 6000 }
        );
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          <span className="text-slate-800 font-medium">
            Fallo en el envío del correo electrónico, por favor intente
            nuevamente o contacte a soporte
          </span>,
          { position: 'top-center', duration: 6000 }
        );
      });

    // Redirigir al dashboard independientemente del estado del envío
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 4000);
  };
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="shrink-0 p-2 md:p-4 pb-1 md:pb-2 border-b border-gray-100 bg-white z-10">
        <FormHeader
          title="Elabora tu manual express"
          description="Ingresa los datos básicos para generar una demostración del manual de contrataciones públicas en la modalidad de concurso abierto. Lo recibirás en tu correo en pocos minutos."
          className="mb-0"
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-1 overflow-hidden bg-white"
      >
        <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4 pt-4">
          <div className="space-y-2">
            <Label
              htmlFor="correo_electronico_manual"
              className="text-base font-medium"
            >
              1. Indique correo electrónico donde enviar su manual
            </Label>
            <p className="text-[13px] text-slate-500 italic font-medium mt-1"></p>
            <Input
              id="correo_electronico_manual"
              type="email"
              {...register('correo_electronico_manual')}
              className={`h-10 ${errors.correo_electronico_manual ? 'border-red-500' : ''}`}
            />
            {errors.correo_electronico_manual && (
              <p className="text-sm text-red-500">
                {errors.correo_electronico_manual.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="nombre_institucion_ente"
              className="text-base font-medium"
            >
              2. Indique el Nombre de la Institución / Ente / Órgano.
            </Label>
            <p className="text-[13px] text-slate-500 italic font-medium mt-1"></p>
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
              className="text-base font-medium"
            >
              3. Indique el Acrónimo y/o siglas de la Institución / Ente /
              Órgano.
            </Label>
            <p className="text-[13px] text-slate-500 italic font-medium mt-1"></p>
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
              className="text-base font-medium"
            >
              4. Indique el Nombre de la unidad / Gerencia y/u Oficina
              responsable de la gestión Administrativa y Financiera de la
              Institución / Ente / Órgano.
            </Label>
            <p className="text-[13px] text-slate-500 italic font-medium mt-1"></p>
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
              className="text-base font-medium"
            >
              5. Indique el Nombre de la Unidad / Gerencia y/u Oficina
              responsable del Área de Sistema y Tecnología de la Institución /
              Ente / Órgano.
            </Label>
            <p className="text-[13px] text-slate-500 italic font-medium mt-1"></p>
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
        </div>

        <div className="shrink-0 py-2 px-8 border-t border-gray-200 bg-white flex justify-end shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 items-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary px-6 py-2 text-base rounded-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Elaborar manual'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
