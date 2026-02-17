'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/features/auth/context/RegisterContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const personalDataSchema = z.object({
  firstName: z.string().min(2, { message: 'El nombre es requerido' }),
  lastName: z.string().min(2, { message: 'El apellido es requerido' }),
  phone: z.string().min(6, { message: 'El teléfono es requerido' }),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
});

type PersonalDataFormValues = z.infer<typeof personalDataSchema>;

export function PersonalDataStep() {
  const { formData, updateFormData, prevStep } = useRegister();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalDataFormValues>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      phone: formData.phone || '',
      acceptedTerms: formData.acceptedTerms || false,
    },
  });

  const onSubmit = async (data: PersonalDataFormValues) => {
    setIsSubmitting(true);
    updateFormData(data);

    // Simulating API call
    console.log('Final Registration Data:', { ...formData, ...data });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert('¡Registro completado exitosamente! (Simulación)');
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          onClick={prevStep}
          className="p-0 hover:bg-transparent -ml-2 text-gray-600"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            id="firstName"
            placeholder="Ingresa tu nombre"
            className={errors.firstName ? 'border-red-500' : ''}
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            placeholder="Ingresa tu apellido"
            className={errors.lastName ? 'border-red-500' : ''}
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Ingresa tu número"
            className={errors.phone ? 'border-red-500' : ''}
            {...register('phone')}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-md border border-gray-100">
          <div className="flex items-center h-5">
            <input
              id="acceptedTerms"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-[#008CBA] focus:ring-[#008CBA] cursor-pointer"
              {...register('acceptedTerms', {
                setValueAs: (v) => v === 'on' || v === true,
              })}
            />
          </div>
          <div className="flex flex-col">
            <Label
              htmlFor="acceptedTerms"
              className="text-sm font-normal text-gray-600 cursor-pointer"
            >
              Al crear una cuenta, aceptas los{' '}
              <a
                href="#"
                className="font-semibold text-[#008CBA] hover:underline"
              >
                Términos y condiciones
              </a>{' '}
              y las{' '}
              <a
                href="#"
                className="font-semibold text-[#008CBA] hover:underline"
              >
                Políticas de privacidad
              </a>
            </Label>
            {errors.acceptedTerms && (
              <p className="text-xs text-red-500 mt-1">
                {errors.acceptedTerms.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#008CBA] hover:bg-[#007da6] text-white py-6 text-lg shadow-sm disabled:opacity-70 mt-4"
        >
          {isSubmitting ? 'Registrando...' : 'Registrarte'}
        </Button>
      </form>
    </div>
  );
}
