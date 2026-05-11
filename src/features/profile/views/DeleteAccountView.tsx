'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';
import { useAuth } from '@/features/auth/context/AuthContext';
import { profileService } from '../services/profile.service';

export const DeleteAccountView = () => {
  const { logout } = useAuth();

  const handleDeleteClick = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez eliminada, no podrás recuperar tu cuenta ni tus datos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar cuenta',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await profileService.deleteAccount();
          return true;
        } catch (error: unknown) {
          if (error instanceof Error) {
            if (error.message === 'PROTECT') {
              Swal.showValidationMessage(
                'No se puede eliminar la cuenta porque tiene proveedores o reportes asociados.'
              );
            } else {
              Swal.showValidationMessage(
                error.message || 'Hubo un error al intentar eliminar la cuenta.'
              );
            }
          } else {
            Swal.showValidationMessage('Hubo un error desconocido.');
          }
          return false;
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          title: 'Cuenta eliminada',
          text: 'Tu cuenta ha sido eliminada exitosamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          logout();
        });
      }
    });
  };

  return (
    <Card className="border-red-500 shadow-sm border mt-4 mx-4 mb-4">
      <CardHeader>
        <CardTitle className="text-xl text-red-600">Eliminar cuenta</CardTitle>
        <CardDescription>
          Tu cuenta será eliminada permanentemente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end pt-20 border-t border-red-200 mt-8">
          <Button
            onClick={handleDeleteClick}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Eliminar cuenta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
