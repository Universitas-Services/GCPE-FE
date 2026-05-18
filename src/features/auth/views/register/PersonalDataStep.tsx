'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/features/auth/context/RegisterContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { registerService } from '@/features/auth/services/register.service';
import Swal from 'sweetalert2';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

const personalDataSchema = z.object({
  firstName: z.string().min(2, { message: 'El nombre es requerido' }),
  lastName: z.string().min(2, { message: 'El apellido es requerido' }),
  phone: z
    .string()
    .min(11, {
      message: 'Debes seleccionar la operadora e ingresar los 7 dígitos',
    })
    .max(11, { message: 'El teléfono debe tener 7 dígitos' })
    .refine(
      (val) =>
        ['0412', '0422', '0414', '0424', '0416', '0426'].includes(
          val.substring(0, 4)
        ),
      { message: 'Selecciona una operadora válida' }
    ),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
});

type PersonalDataFormValues = z.infer<typeof personalDataSchema>;

export function PersonalDataStep() {
  const { formData, updateFormData } = useRegister();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const rawPhone = formData.phone || '';
  const currentOperator = rawPhone.substring(0, 4);
  const currentNumber = rawPhone.substring(4);

  const {
    register,
    handleSubmit,
    setValue,
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

  const handlePhoneOperatorChange = (value: string) => {
    const newPhone = value + currentNumber;
    updateFormData({ phone: newPhone });
    setValue('phone', newPhone, { shouldValidate: true });
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,7}$/.test(value)) {
      const newPhone = currentOperator + value;
      updateFormData({ phone: newPhone });
      setValue('phone', newPhone, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: PersonalDataFormValues) => {
    setIsSubmitting(true);
    updateFormData(data);

    try {
      const finalData = { ...formData, ...data };

      await registerService.register({
        email: finalData.email || '',
        password: finalData.password || '',
        confirm_password: finalData.confirmPassword || '',
        first_name: finalData.firstName,
        last_name: finalData.lastName,
        telefono: finalData.phone,
      });

      setShowSuccessModal(true);
    } catch (error: unknown) {
      console.error('Error al registrar usuario:', error);

      let errorMessage = 'Ocurrió un error inesperado al registrar el usuario.';

      if (error instanceof Error) {
        const msgLower = error.message.toLowerCase();
        if (msgLower.includes('email') || msgLower.includes('correo')) {
          errorMessage = 'El email ya está registrado.';
        } else {
          errorMessage = error.message;
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Error de registro',
        text: errorMessage,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#008CBA',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name */}
        <div className="space-y-1">
          <Label htmlFor="firstName" className="text-[12.96px] font-semibold">
            Nombre
          </Label>
          <Input
            id="firstName"
            placeholder="Ingresa tu nombre"
            className={`h-9 ${errors.firstName ? 'border-red-500' : ''}`}
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-1">
          <Label htmlFor="lastName" className="text-[12.96px] font-semibold">
            Apellido
          </Label>
          <Input
            id="lastName"
            placeholder="Ingresa tu apellido"
            className={`h-9 ${errors.lastName ? 'border-red-500' : ''}`}
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <Label htmlFor="phone" className="text-[12.96px] font-semibold">
            Teléfono
          </Label>
          <div className="flex gap-2">
            <Select
              value={
                ['0412', '0422', '0414', '0424', '0416', '0426'].includes(
                  currentOperator
                )
                  ? currentOperator
                  : undefined
              }
              onValueChange={handlePhoneOperatorChange}
            >
              <SelectTrigger
                className={`w-20 h-9 cursor-pointer ${errors.phone ? 'border-red-500' : ''}`}
              >
                <SelectValue placeholder="Cod" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="min-w-0 w-[var(--radix-select-trigger-width)]"
              >
                <SelectItem value="0412">0412</SelectItem>
                <SelectItem value="0422">0422</SelectItem>
                <SelectItem value="0414">0414</SelectItem>
                <SelectItem value="0424">0424</SelectItem>
                <SelectItem value="0416">0416</SelectItem>
                <SelectItem value="0426">0426</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="phone"
              type="text"
              value={currentNumber}
              onChange={handlePhoneNumberChange}
              maxLength={7}
              placeholder="1234567"
              className={`h-9 flex-1 ${errors.phone ? 'border-red-500' : ''}`}
            />
          </div>
          <input type="hidden" {...register('phone')} />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="p-4 bg-[#F1F3F5] rounded-xl border border-transparent">
          <div className="flex items-center gap-3">
            <input
              id="acceptedTerms"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-[#008CBA] focus:ring-[#008CBA] cursor-pointer shrink-0 mt-0.5 self-start"
              {...register('acceptedTerms', {
                setValueAs: (v) => v === 'on' || v === true,
              })}
            />
            <div className="text-[13px] font-normal text-gray-500 leading-snug">
              Al crear una cuenta, aceptas los{' '}
              <a
                href="#"
                className="font-medium text-[#008CBA] hover:underline"
              >
                Términos y condiciones{' '}
              </a>
              <a className="font-medium text-[gray]">y las{'  '}</a>
              <a
                href="#"
                className="font-medium text-[#008CBA] hover:underline"
              >
                Políticas de privacidad
              </a>
            </div>
          </div>
          {errors.acceptedTerms && (
            <p className="text-[11px] text-red-500 mt-1 ml-7">
              {errors.acceptedTerms.message}
            </p>
          )}
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center gap-3 py-1 opacity-70">
          <div className="h-[1px] flex-1 bg-gray-300"></div>
          <div className="h-2 w-2 rounded-full border border-gray-400 bg-transparent shrink-0"></div>
          <div className="h-[1px] flex-1 bg-gray-300"></div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#008CBA] hover:bg-[#007da6] text-white py-2 text-sm shadow-sm disabled:opacity-70"
        >
          {isSubmitting ? 'Registrando...' : 'Regístrate'}
        </Button>
      </form>

      {/* Success Modal */}
      <Dialog open={showSuccessModal}>
        <DialogContent
          className="sm:max-w-[500px] bg-[#E8EDF2] border-0 p-6 [&>button]:hidden rounded-xl"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader className="space-y-2">
            <DialogTitle className="app-title">Registro exitoso</DialogTitle>
            <DialogDescription className="text-xs text-[#66686A] leading-relaxed text-left">
              Hemos enviado un correo para que confirmes y actives tu cuenta. Si
              no lo ubicas en la bandeja de entrada, revisa en SPAM.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 flex justify-center w-full">
            <Button
              className="w-full bg-[#0091BE] hover:bg-[#007da6] text-white py-3 text-sm font-semibold transition-colors"
              onClick={() => router.push('/login')}
            >
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
