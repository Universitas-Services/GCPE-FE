'use client';

import { useRegister } from '@/features/auth/context/RegisterContext';
import { cn } from '@/lib/utils';

export function RegisterStepper() {
  const { currentStep } = useRegister();

  return (
    <div className="flex items-center justify-center space-x-10 mb-4">
      {/* Step 1 */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors',
            currentStep >= 1
              ? 'bg-[#008CBA] text-white'
              : 'bg-gray-200 text-gray-500'
          )}
        >
          1
        </div>
        <span className="mt-1 text-[11.11px] font-medium text-gray-600">
          Credenciales
        </span>
      </div>

      {/* Step 2 */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors',
            currentStep >= 2
              ? 'bg-[#008CBA] text-white'
              : 'bg-gray-200 text-gray-500'
          )}
        >
          2
        </div>
        <span className="mt-1 text-[11.11px] font-medium text-gray-600">
          Datos Personales
        </span>
      </div>
    </div>
  );
}
