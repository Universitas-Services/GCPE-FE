import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ComplianceSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function ComplianceSuccessModal({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
}: ComplianceSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-8 bg-[#E8EDF2] border-none rounded-2xl shadow-xl">
        <DialogHeader className="mb-4 text-center">
          <DialogTitle className="app-title mb-3">
            ¡Has completado tu revisión con éxito!
          </DialogTitle>
          <p className="text-[#64748B] text-base px-2">
            Por favor, haz clic en el botón Generar compliance para procesar los
            datos y recibir tu reporte de auditoría completo.
          </p>
        </DialogHeader>

        <div className="flex justify-center pt-2">
          <Button
            type="button"
            className="w-full max-w-[300px] btn-primary py-3 h-auto text-base rounded-xl"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generando...' : 'Generar compliance'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
