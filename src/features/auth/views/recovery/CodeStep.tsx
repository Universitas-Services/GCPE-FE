'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRecovery } from '@/features/auth/context/RecoveryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const codeSchema = z.object({
  code: z.string().min(1, { message: 'El código es requerido' }),
});

type CodeFormValues = z.infer<typeof codeSchema>;

export function CodeStep() {
  const { formData, updateFormData, nextStep } = useRecovery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: formData.code || '',
    },
  });

  const onSubmit = (data: CodeFormValues) => {
    updateFormData(data);
    // Here we would verify the code via API
    console.log('Verifying code:', data.code);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="code" className="text-gray-700">
          Codigo de verificación
        </Label>
        <Input
          id="code"
          type="text"
          placeholder="Ejem:123456"
          className={`bg-gray-50 border-gray-200 ${errors.code ? 'border-red-500' : ''}`}
          {...register('code')}
        />
        {errors.code && (
          <p className="text-sm text-red-500">{errors.code.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#008CBA] hover:bg-[#007da6] text-white py-6 text-lg shadow-sm"
      >
        Verificar
      </Button>
    </form>
  );
}
