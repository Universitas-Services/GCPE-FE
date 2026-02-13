'use client';

import { useRegister } from '@/features/auth/context/RegisterContext';
import { cn } from '@/lib/utils'; // Assuming cn utility exists, usually standardized in shadcn projects

export function RegisterStepper() {
  const { currentStep } = useRegister();

  return (
    <div className="flex items-center justify-center space-x-12 mb-8">
      {/* Step 1 */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold transition-colors',
            currentStep >= 1
              ? 'bg-[#008CBA] text-white'
              : 'bg-gray-200 text-gray-500'
          )}
        >
          1
        </div>
        <span className="mt-2 text-xs font-medium text-gray-600">
          Credenciales
        </span>
      </div>

      {/* Connector Line */}
      {/* <div className={cn("h-[2px] w-16", currentStep >= 2 ? "bg-[#008CBA]" : "bg-gray-200")} /> */}
      {/* Design shows simple spacing, no visible line connecting them in standard way, 
          but usually steppers have lines. The reference image shows just two distinct circles.
          I will keep it simple as per the reference image which seems to be just two circles with labels.
      */}

      {/* Step 2 */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold transition-colors',
            currentStep >= 2
              ? 'bg-[#008CBA] text-white'
              : 'bg-gray-200 text-gray-500'
          )}
        >
          2
        </div>
        <span className="mt-2 text-xs font-medium text-gray-600">
          Datos personales
        </span>
      </div>
    </div>
  );
}
