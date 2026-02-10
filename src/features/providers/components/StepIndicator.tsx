import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="flex justify-center items-center space-x-4 mt-8 pb-4">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <React.Fragment key={step}>
          <div
            className={`
              w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium transition-colors
              ${
                step === currentStep
                  ? 'bg-blue-600 text-white shadow-md' // Active
                  : step < currentStep
                    ? 'bg-blue-100 text-blue-600' // Completed (optional style, using same as inactive for now based on image?)
                    : 'bg-gray-100 text-gray-400' // Inactive
              }
              ${step === currentStep ? 'ring-2 ring-blue-600 ring-offset-2' : ''}
            `}
          >
            {step}
          </div>
          {/* Connector line (optional, not strictly in description but common in wizards) */}
          {/* {step < totalSteps && (
            <div className={`w-4 h-0.5 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
          )} */}
        </React.Fragment>
      ))}
    </div>
  );
};
