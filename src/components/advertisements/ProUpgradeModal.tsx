'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { X, CheckCircle2 } from 'lucide-react';
import { IoMdTrophy } from 'react-icons/io';
import { Button } from '@/components/ui/button';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const features = [
  {
    title: 'Gestión documental',
    description: 'Generación de documentos automáticos',
  },
  {
    title: 'Gestión y control de datos',
    description: 'Respaldo de datos y control de usuarios',
  },
  {
    title: 'Automatización de expedientes',
    description: 'Generación automática de expedientes de contrataciones',
  },
  {
    title: 'Reportes de cumplimientos',
    description:
      'Análisis de revisión de cumplimientos en los expediente de contrataciones',
  },
  {
    title: 'Registro y control de proveedores',
    description:
      'Métricas precisas de los proveedores registrados y control de su status',
  },
];

export function ProUpgradeModal({ isOpen, onClose }: ProUpgradeModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleOverlayClick}
    >
      <div
        className="relative w-full max-w-[520px] rounded-2xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-50"
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="px-8 pt-10 pb-8 flex flex-col items-center text-center">
          {/* Trophy Icon */}
          <div className="w-16 h-16 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6">
            <IoMdTrophy className="w-8 h-8 text-amber-500" />
          </div>

          {/* Title */}
          <h2
            className="text-xl font-semibold text-[#005282] leading-tight mb-3"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Potencia tu gestión con la versión PRO
          </h2>

          {/* Subtitle */}
          <p
            className="text-sm font-medium leading-relaxed mb-8 max-w-[380px]"
            style={{ fontFamily: 'Inter, sans-serif', color: '#787878' }}
          >
            Desbloquea herramientas avanzadas de cumplimiento legal y
            automatización de contrataciones públicas para optimizar cada
            proceso.
          </p>

          {/* Features Grid */}
          <div className="w-full grid grid-cols-2 gap-x-6 gap-y-5 mb-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`flex items-start gap-3 text-left ${
                  index === features.length - 1 && features.length % 2 !== 0
                    ? 'col-span-2 max-w-[250px] mx-auto'
                    : ''
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-[#0097b2] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-gray-800 leading-tight">
                    {feature.title}
                  </p>
                  <p className="text-xs text-gray-500 leading-snug mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between w-full pt-2">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              Tal vez más tarde
            </button>
            <Button
              onClick={handleUpgrade}
              className="bg-[#0097b2] hover:bg-[#008299] text-white font-semibold px-6 py-2.5 rounded-xl text-sm"
            >
              Actualizar a Pro ahora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
