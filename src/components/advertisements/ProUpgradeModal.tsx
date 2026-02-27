'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Crown, X, CheckCircle2 } from 'lucide-react';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProUpgradeModal({ isOpen, onClose }: ProUpgradeModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Mount logic for SSR compatibility
  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll lock logic
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleUpgrade = () => {
    onClose();
    router.push('/dashboard/upgrade');
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleOverlayClick}
    >
      <div
        className="relative w-full max-w-[480px] rounded-2xl bg-[#09151e] border border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card
      >
        {/* Glow Effects */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#0097b2] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-2"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-8 pt-10 pb-8 flex flex-col items-center text-center relative z-10">
          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(251,191,36,0.5)]">
            <Crown className="w-8 h-8 text-white relative z-10" />
          </div>

          {/* Texts */}
          <span className="text-[10px] font-bold tracking-widest text-[#00c6d9] mb-3 uppercase">
            Premium Access
          </span>
          <h2 className="text-3xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            Solo disponible en versión
            <br />
            Pro
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-[320px]">
            <strong className="text-gray-200">
              Desbloquea funciones avanzadas
            </strong>{' '}
            y reportes detallados para optimizar tu gestión de cumplimiento
            empresarial.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-10">
            <button
              onClick={handleUpgrade}
              className="bg-[#008ba6] hover:bg-[#00748b] text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-[0_4px_24px_rgba(0,151,178,0.4)] flex items-center justify-center gap-2 group w-full sm:w-auto"
            >
              Actualizar ahora
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 font-medium py-3 px-4 text-sm transition-colors w-full sm:w-auto"
            >
              Tal vez más tarde
            </button>
          </div>

          {/* Separator line */}
          <div className="w-full h-px bg-gray-800/60 mb-6"></div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full text-left">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00c6d9]" />
              <span className="text-xs text-gray-300 font-medium tracking-wide">
                Analytics Predictivo
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00c6d9]" />
              <span className="text-xs text-gray-300 font-medium tracking-wide">
                Exportación Masiva
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00c6d9]" />
              <span className="text-xs text-gray-300 font-medium tracking-wide">
                Soporte 24/7 Prioritario
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00c6d9]" />
              <span className="text-xs text-gray-300 font-medium tracking-wide">
                API de Cumplimiento
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
