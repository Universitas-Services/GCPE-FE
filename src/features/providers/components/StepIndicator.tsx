import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="flex justify-center items-center mt-2">
      <Pagination>
        <PaginationContent>
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <PaginationItem key={step}>
              <div
                className={cn(
                  'h-8 w-8 text-xs bg-gray-100/50 text-gray-400 flex items-center justify-center rounded-md transition-colors',
                  step === currentStep
                    ? 'bg-gray-200 text-gray-600 font-bold border-none shadow-none'
                    : ''
                )}
              >
                {step}
              </div>
            </PaginationItem>
          ))}
        </PaginationContent>
      </Pagination>
    </div>
  );
};
