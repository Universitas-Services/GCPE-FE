'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { cn } from '@/lib/utils';
import { useCompliance } from '../context/ComplianceContext';
import { SharedDatePicker } from '@/components/shared/SharedDatePicker';

// 1. Definición del Schema de Validación con Zod
const formSchema = z.object({
  email: z.string().email({ message: 'Ingrese un correo electrónico válido.' }),
  entityName: z
    .string()
    .min(1, { message: 'El nombre de la entidad es requerido.' }),
  unitName: z.string().min(1, { message: 'La unidad u oficina es requerida.' }),
  reviewDate: z.date({
    message: 'La fecha de revisión es obligatoria.',
  }),
  reviewerName: z
    .string()
    .min(1, { message: 'El nombre del evaluador es requerido.' }),
  documentCode: z
    .string()
    .min(1, { message: 'El código del documento es requerido.' }),
  // Campos opcionales para evitar errores de tipo si el contexto tiene más datos
});

type FormValues = z.infer<typeof formSchema>;

export function GeneralDataForm() {
  const { generalData, setGeneralData, goToNextPage } = useCompliance();

  // 2. Inicialización del formulario
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      entityName: '',
      unitName: '',
      reviewerName: '',
      documentCode: '',
    },
  });

  // Cargar datos del contexto si existen
  useEffect(() => {
    if (generalData.email) {
      reset({
        email: generalData.email,
        entityName: generalData.entityName,
        unitName: generalData.unitName,
        reviewDate: generalData.reviewDate
          ? new Date(generalData.reviewDate)
          : undefined,
        reviewerName: generalData.reviewerName,
        documentCode: generalData.documentCode,
      });
    }
  }, [generalData, reset]);

  // Observamos el valor de la fecha para actualizar la UI del botón
  const reviewDate = watch('reviewDate');

  // 3. Handler de envío
  const onSubmit = (data: FormValues) => {
    setGeneralData(data);
    goToNextPage();
  };

  return (
    <div className="w-full">
      <form
        id="compliance-general-data"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="form-label-titulos">
            Dirección de correo electrónico
          </Label>
          <p className="form-label-ejemplo mt-1">
            Correo electronico donde se enviara el documento Compliance. ||
            Ejemplo: prueba@gmail.com{' '}
          </p>
          <Input
            id="email"
            className={cn(
              'border-gray-200 bg-white h-10',
              errors.email && 'border-red-500'
            )}
            {...register('email')}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}
        </div>

        {/* Nombre Entidad */}
        <div className="space-y-2">
          <Label htmlFor="entityName" className="form-label-titulos">
            Nombre del órgano, entidad, oficina o dependencia de la
            Administración Pública
          </Label>
          <p className="form-label-ejemplo mt-1">
            Ejemplo: Instituto Nacional de Tránsito Terrestre (INTT)
          </p>
          <Input
            id="entityName"
            className="border-gray-200 bg-white h-10"
            {...register('entityName')}
          />
          {errors.entityName && (
            <span className="text-sm text-red-500">
              {errors.entityName.message}
            </span>
          )}
        </div>

        {/* Nombre Unidad */}
        <div className="space-y-2">
          <Label htmlFor="unitName" className="form-label-titulos">
            Nombre de la unidad u oficina que revisa
          </Label>
          <p className="form-label-ejemplo mt-1">
            Ejemplo: Unidad Administradora
          </p>
          <Input
            id="unitName"
            className="border-gray-200 bg-white h-10"
            {...register('unitName')}
          />
          {errors.unitName && (
            <span className="text-sm text-red-500">
              {errors.unitName.message}
            </span>
          )}
        </div>

        {/* --- NUEVO CAMPO: FECHA DE REVISIÓN --- */}
        <div className="space-y-2 flex flex-col">
          <Label className="form-label-titulos">Fecha de revisión</Label>
          <SharedDatePicker
            max={new Date().toISOString().split('T')[0]} // Bloquea fechas futuras
            error={Boolean(errors.reviewDate)}
            value={reviewDate ? format(reviewDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => {
              if (e.target.value) {
                // Ajustamos la fecha para guardarla como Date que Zod espera
                const [year, month, day] = e.target.value
                  .split('-')
                  .map(Number);
                setValue('reviewDate', new Date(year, month - 1, day), {
                  shouldValidate: true,
                });
              } else {
                setValue('reviewDate', undefined as unknown as Date, {
                  shouldValidate: true,
                });
              }
            }}
          />
          {errors.reviewDate && (
            <span className="text-sm text-red-500">
              {errors.reviewDate.message}
            </span>
          )}
        </div>
        {/* -------------------------------------- */}

        {/* Nombre Revisor */}
        <div className="space-y-2">
          <Label htmlFor="reviewerName" className="form-label-titulos">
            Nombre completo de la persona que revisa y/o evalúa.
          </Label>
          <p className="form-label-ejemplo mt-1">
            Ejemplo: Pedro José Hernández Pérez
          </p>
          <Input
            id="reviewerName"
            className="border-gray-200 bg-white h-10"
            {...register('reviewerName')}
          />
          {errors.reviewerName && (
            <span className="text-sm text-red-500">
              {errors.reviewerName.message}
            </span>
          )}
        </div>

        {/* Código */}
        <div className="space-y-2">
          <Label htmlFor="documentCode" className="form-label-titulos">
            Indique la nomenclatura o código asignado al documento revisado
          </Label>
          <p className="form-label-ejemplo mt-1">Ejemplo: U.L-001</p>
          <Input
            id="documentCode"
            className="border-gray-200 bg-white h-10"
            {...register('documentCode')}
          />
          {errors.documentCode && (
            <span className="text-sm text-red-500">
              {errors.documentCode.message}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
