'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRecovery } from '@/features/auth/context/RecoveryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const emailSchema = z.object({
  email: z.string().email({ message: 'El correo electrónico no es válido' }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export function EmailStep() {
  const { formData, updateFormData, nextStep } = useRecovery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: formData.email || '',
    },
  });

  const onSubmit = (data: EmailFormValues) => {
    updateFormData(data);
    // Here we would trigger the API to send the email
    console.log('Sending recovery code to:', data.email);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">
          Correo electrónico
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Ingresa tu correo"
          className={`bg-gray-50 border-gray-200 ${errors.email ? 'border-red-500' : ''}`}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#008CBA] hover:bg-[#007da6] text-white py-6 text-lg shadow-sm"
      >
        Enviar
      </Button>
    </form>
  );
}
