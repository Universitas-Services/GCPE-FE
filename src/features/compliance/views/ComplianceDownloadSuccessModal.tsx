import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ComplianceDownloadSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComplianceDownloadSuccessModal({
  isOpen,
  onClose,
}: ComplianceDownloadSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-8 bg-[#E8EDF2] border-none rounded-2xl shadow-xl">
        <DialogHeader className="mb-4 text-center">
          <DialogTitle className="app-title mb-3">
            ¡Descarga completada!
          </DialogTitle>
          <p className="text-[#64748B] text-base px-2">
            Tu reporte de compliance ha sido generado y descargado exitosamente,
            redirigiendo al inicio en unos segundos...
          </p>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
