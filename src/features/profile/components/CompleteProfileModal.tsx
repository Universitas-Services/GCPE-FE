import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { profileService } from '@/features/profile/services/profile.service';
import Swal from 'sweetalert2';

const completeProfileSchema = z.object({
  institucion: z.string().min(1, 'La institución es requerida'),
  cargo: z.string().min(1, 'El cargo es requerido'),
});

type CompleteProfileValues = z.infer<typeof completeProfileSchema>;

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  uid: string | number; // Identificador del usuario, para el localStorage
  onSuccess?: () => void;
}

export function CompleteProfileModal({
  isOpen,
  onClose,
  uid,
  onSuccess,
}: CompleteProfileModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      institucion: '',
      cargo: '',
    },
  });

  const onSubmit = async (data: CompleteProfileValues) => {
    setIsSubmitting(true);
    try {
      await profileService.updateProfilePartial({
        nombre_institucion_ente: data.institucion,
        cargo: data.cargo,
      });

      // Show success
      Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
        text: '¡Gracias por completar tu perfil!',
        confirmButtonColor: '#008CBA',
        timer: 2000,
        showConfirmButton: false,
      });

      // Avoid showing it again
      if (uid) {
        localStorage.setItem(`profile_modal_shown_${uid}`, 'true');
      }

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el perfil';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#008CBA',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Si cierran forzosamente, marcamos que se mostró en este login
    if (uid) {
      localStorage.setItem(`profile_modal_shown_${uid}`, 'true');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="mb-4 text-left">
          <DialogTitle className="text-2xl font-bold text-[#0f4d7b] mb-1">
            ¡Bienvenido! Completa tu perfil
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Necesitamos la siguiente información para continuar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="institucion" className="text-[#0f4d7b] font-medium">
              Institución
            </Label>
            <Input
              id="institucion"
              placeholder="Escribe tu institución"
              className={`bg-white border-gray-200 focus-visible:ring-[#008CBA] h-10 ${
                errors.institucion ? 'border-red-500' : ''
              }`}
              {...register('institucion')}
            />
            {errors.institucion && (
              <p className="text-xs text-red-500">
                {errors.institucion.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo" className="text-[#0f4d7b] font-medium">
              Cargo
            </Label>
            <Input
              id="cargo"
              placeholder="Escribe tu cargo"
              className={`bg-white border-gray-200 focus-visible:ring-[#008CBA] h-10 ${
                errors.cargo ? 'border-red-500' : ''
              }`}
              {...register('cargo')}
            />
            {errors.cargo && (
              <p className="text-xs text-red-500">{errors.cargo.message}</p>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#008CBA] hover:bg-[#007da6] text-white py-2 h-10 font-medium"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar y continuar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
