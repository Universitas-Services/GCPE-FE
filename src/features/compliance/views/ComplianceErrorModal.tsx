import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

interface ComplianceErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorTitle?: string;
  errorMessage?: string;
}

export function ComplianceErrorModal({
  isOpen,
  onClose,
  errorTitle = 'Error',
  errorMessage = 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
}: ComplianceErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-8 bg-[#E8EDF2] border-none rounded-2xl shadow-xl">
        <DialogHeader className="mb-4 text-center">
          <div className="flex justify-center mb-3">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <DialogTitle className="text-2xl font-inter font-bold text-[#005282] text-center mb-3">
            {errorTitle}
          </DialogTitle>
          <p className="faq-question-text text-center">{errorMessage}</p>
        </DialogHeader>

        <div className="flex justify-center pt-2">
          <Button
            type="button"
            className="w-full max-w-[300px] bg-red-600 hover:bg-red-700 text-white py-3 h-auto text-base rounded-xl"
            onClick={onClose}
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
