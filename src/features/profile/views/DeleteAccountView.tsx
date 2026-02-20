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

export const DeleteAccountView = () => {
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
    }).then((result) => {
      if (result.isConfirmed) {
        // En el futuro, aquí se llamará al endpoint del backend
        Swal.fire(
          'Simulación',
          'La cuenta sería eliminada en este punto.',
          'info'
        );
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
