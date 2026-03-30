import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ManualAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'success' | 'error';
  message: string;
}

export function ManualAlertDialog({
  open,
  onOpenChange,
  type,
  message,
}: ManualAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[90%] max-w-md rounded-2xl bg-[#E8EDF2] border-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-inter font-bold text-[#005282] text-center mb-3">
            {type === 'success' ? '¡Envío Exitoso!' : 'Error de Envío'}
          </AlertDialogTitle>
          <AlertDialogDescription className="faq-question-text text-center">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className="btn-primary px-6 py-2 text-base rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Aceptar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
