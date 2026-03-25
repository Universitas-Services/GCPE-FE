'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { manualSchema, ManualFormSchema } from '../schemas/manualSchema';
import { createManual } from '../services/manualService';
import { Button } from '@/components/ui/button';
import { FormHeader } from '@/components/shared/FormHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function ManualForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  const [dialogMessage, setDialogMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ManualFormSchema>({
    resolver: zodResolver(manualSchema),
  });

  useEffect(() => {
    if (isSubmitting) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isSubmitting]);

  const onSubmit = async (data: ManualFormSchema) => {
    setIsSubmitting(true);
    setProgress(10);
    try {
      await createManual(data);
      setProgress(100);
      setDialogType('success');
      setDialogMessage('Correo enviado exitosamente');
      setDialogOpen(true);
    } catch (error) {
      console.error(error);
      setDialogType('error');
      setDialogMessage(
        'Fallo en el envío del correo electrónico, por favor intente nuevamente o contacte a soporte'
      );
      setDialogOpen(true);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="shrink-0 p-2 md:p-4 pb-1 md:pb-2 border-b border-gray-100 bg-white z-10">
        <FormHeader
          title="Elabora tu manual express"
          description="Ingresa los datos básicos para generar una demostración del manual de concurso abierto. Lo recibirás en tu correo en pocos minutos."
          className="mb-0"
          titleClassName="text-[26px] md:text-[26px] font-bold"
          descriptionClassName="leading-[22.5px]"
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
            className="btn-primary px-2 py-1 text-base rounded-xl min-w-[150px] h-auto"
          >
            {isSubmitting ? 'Enviando...' : 'Elaborar manual'}
          </Button>
        </div>
      </form>

      {/* Full Screen Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md flex flex-col items-center space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-[#005282]">
                Enviando a su correo electrónico
              </h3>
              <p className="text-sm text-gray-500">
                Por favor, espere un momento mientras generamos y enviamos su
                manual express.
              </p>
            </div>
            <Progress value={progress} className="w-full h-2" />
            <p className="text-xs font-medium text-gray-400">
              {progress}% completado
            </p>
          </div>
        </div>
      )}

      {/* Alert Dialog Modal */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="w-[90%] max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle
              className={
                dialogType === 'success' ? 'text-green-600' : 'text-red-500'
              }
            >
              {dialogType === 'success' ? '¡Envío Exitoso!' : 'Error de Envío'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-700">
              {dialogMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="px-6 py-2 rounded-xl text-base"
              onClick={() => setDialogOpen(false)}
            >
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
