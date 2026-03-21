import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ProviderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProviders: () => void;
}

export function ProviderSuccessModal({
  isOpen,
  onClose,
  onViewProviders,
}: ProviderSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-8 bg-[#E8EDF2] border-none rounded-2xl shadow-xl">
        <DialogHeader className="mb-4 text-center">
          <div className="flex justify-center mb-3">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <DialogTitle className="text-2xl font-bold text-[#005282] mb-3">
            ¡Has completado el registro con éxito!
          </DialogTitle>
          <p className="text-[#64748B] text-base px-2">
            Para ver el listado completo de tus proveedores registrados, puedes
            hacer clic en ver proveedores.
          </p>
        </DialogHeader>

        <div className="flex justify-center pt-2">
          <Button
            type="button"
            className="w-full max-w-[300px] btn-primary py-3 h-auto text-base rounded-xl"
            onClick={onViewProviders}
          >
            Ver proveedores
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
