'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

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
});

type FormValues = z.infer<typeof formSchema>;

export function GeneralDataForm() {
  // 2. Inicialización del formulario
  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  // Observamos el valor de la fecha para actualizar la UI del botón
  const reviewDate = watch('reviewDate');

  // 3. Handler de envío
  const onSubmit = (data: FormValues) => {
    console.log('Datos del formulario enviados:', data);
    // Aquí iría la lógica para avanzar al siguiente paso o guardar en BD
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-sm border-gray-100">
      <CardHeader className="pb-8">
        <CardTitle className="text-2xl font-bold text-[#0b1e4c]">
          Datos generales
        </CardTitle>
        <CardDescription className="text-gray-400 text-base italic">
          Ingresa tus datos para continuar
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-[#0b1e4c] font-medium text-base"
            >
              Dirección de correo electrónico
            </Label>
            <Input
              id="email"
              placeholder="Ejemplo: prueba@gmail.com"
              className={cn(
                'border-gray-200 bg-white h-12',
                errors.email && 'border-red-500'
              )}
              {...register('email')}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Nombre Entidad */}
          <div className="space-y-2">
            <Label
              htmlFor="entityName"
              className="text-[#0b1e4c] font-medium text-base"
            >
              Nombre del órgano, entidad, oficina o dependencia de la
              Administración Pública
            </Label>
            <Input
              id="entityName"
              placeholder="Ejemplo: Instituto Nacional de Tránsito Terrestre (INTT)"
              className="border-gray-200 bg-white h-12"
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
            <Label
              htmlFor="unitName"
              className="text-[#0b1e4c] font-medium text-base"
            >
              Nombre de la unidad u oficina que revisa
            </Label>
            <Input
              id="unitName"
              placeholder="Ejemplo: Unidad Administradora"
              className="border-gray-200 bg-white h-12"
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
            <Label className="text-[#0b1e4c] font-medium text-base">
              Fecha de revisión
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'h-12 w-full justify-start text-left font-normal border-gray-200 bg-white',
                    !reviewDate && 'text-muted-foreground',
                    errors.reviewDate && 'border-red-500'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {reviewDate ? (
                    format(reviewDate, 'PPP', { locale: es }) // Formato localizado
                  ) : (
                    <span>Seleccione una fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={reviewDate}
                  onSelect={(date) =>
                    setValue('reviewDate', date as Date, {
                      shouldValidate: true,
                    })
                  }
                  initialFocus
                  locale={es} // Localización en Español
                />
              </PopoverContent>
            </Popover>
            {errors.reviewDate && (
              <span className="text-sm text-red-500">
                {errors.reviewDate.message}
              </span>
            )}
          </div>
          {/* -------------------------------------- */}

          {/* Nombre Revisor */}
          <div className="space-y-2">
            <Label
              htmlFor="reviewerName"
              className="text-[#0b1e4c] font-medium text-base"
            >
              Nombre completo de la persona que revisa y/o evalúa.
            </Label>
            <Input
              id="reviewerName"
              placeholder="Ejemplo: Pedro José Hernández Pérez"
              className="border-gray-200 bg-white h-12"
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
            <Label
              htmlFor="documentCode"
              className="text-[#0b1e4c] font-medium text-base"
            >
              Indique la nomenclatura o código asignado al documento revisado
            </Label>
            <Input
              id="documentCode"
              placeholder="Ejemplo: U.L-001"
              className="border-gray-200 bg-white h-12"
              {...register('documentCode')}
            />
            {errors.documentCode && (
              <span className="text-sm text-red-500">
                {errors.documentCode.message}
              </span>
            )}
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-8">
            <Button
              type="submit"
              className="bg-[#0097b2] hover:bg-[#008299] text-white px-8 py-6 text-lg rounded-xl"
            >
              Siguiente
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
