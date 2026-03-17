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
  const { formData, updateFormData, prevStep } = useRegister();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  // Separar operadora y número del teléfono almacenado
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
    // Solo dígitos, máximo 7 caracteres
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
      // Utilizamos los datos combinados del paso 1 y paso 2
      const finalData = { ...formData, ...data };

      await registerService.register({
        email: finalData.email || '',
        password: finalData.password || '',
        confirm_password: finalData.confirmPassword || '',
        first_name: finalData.firstName,
        last_name: finalData.lastName,
        telefono: finalData.phone,
      });

      // Si todo sale bien, mostramos el modal de éxito
      setShowSuccessModal(true);
    } catch (error: unknown) {
      console.error('Error al registrar usuario:', error);

      let errorMessage = 'Ocurrió un error inesperado al registrar el usuario.';

      // Control de error específico de email repetido
      // asumiendo que el backend envía los mensajes estructurados
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
          <p className="text-xs text-gray-500 italic">Ejemplo: 1234567</p>
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
                className={`w-24 h-10 ${errors.phone ? 'border-red-500' : ''}`}
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
              className={`h-10 ${errors.phone ? 'border-red-500' : ''}`}
            />
          </div>
          {/* Campo oculto para react-hook-form */}
          <input type="hidden" {...register('phone')} />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
          <div className="flex items-center space-x-3">
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
            <Label
              htmlFor="acceptedTerms"
              className="text-sm font-normal text-gray-600 cursor-pointer block leading-normal"
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
          </div>
          {errors.acceptedTerms && (
            <p className="text-xs text-red-500 mt-2 ml-7">
              {errors.acceptedTerms.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#008CBA] hover:bg-[#007da6] text-white py-6 text-lg shadow-sm disabled:opacity-70 mt-4"
        >
          {isSubmitting ? 'Registrando...' : 'Registrarte'}
        </Button>
      </form>

      {/* Success Modal */}
      <Dialog
        open={showSuccessModal}
        onOpenChange={(open) => {
          if (!open) {
            /* close not allowed outside */
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] bg-[#E8EDF2] border-0 p-6 [&>button]:hidden">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold text-[#005282]">
              Registro exitoso
            </DialogTitle>
            <DialogDescription className="text-sm text-[#66686A] mt-2 leading-relaxed text-left">
              Hemos enviado un correo para que confirmes y actives tu cuenta. Si
              no lo ubicas en la bandeja de entrada, revisa en SPAM,
              notificaciones o promociones.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-center w-full">
            <Button
              className="w-full bg-[#0091BE] hover:bg-[#007da6] text-white py-5 text-base font-semibold transition-colors"
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
