'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export const SessionExpiredModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsOpen(true);
    };

    window.addEventListener('session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, []);

  const handleAccept = () => {
    setIsOpen(false);
    logout();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
        <div className="flex justify-center mb-4">
          <XCircle className="w-16 h-16 text-red-500 bg-red-50 rounded-full p-3" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Error</h3>
        <p className="text-slate-600 mb-6">
          Su sesión ha expirado, por favor inicie sesión nuevamente.
        </p>
        <Button
          onClick={handleAccept}
          className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2"
        >
          Aceptar
        </Button>
      </div>
    </div>
  );
};
