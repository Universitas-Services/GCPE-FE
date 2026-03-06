import React from 'react';
import Swal from 'sweetalert2';
import { useProviderForm } from '../context/ProviderFormContext';
import { Step1Identification } from './Step1Identification';
import { Step2Requirements } from './Step2Requirements';
import { Step3Capacity } from './Step3Capacity';
import { Step4Completion } from './Step4Completion';
import { StepIndicator } from '../components/StepIndicator';
import { createProvider } from '../services/providers.service';
import { ProviderFormData } from '../types/provider.types';
import { useRouter } from 'next/navigation';

export const ProviderRegistrationWizard: React.FC = () => {
  const {
    currentStep,
    nextStep,
    prevStep,
    validateStep,
    formData,
    isSubmitting,
    setIsSubmitting,
  } = useProviderForm();
  const router = useRouter();

  const handleNext = () => {
    const isValid = validateStep(currentStep);
    if (isValid) {
      if (currentStep === 4) {
        handleSubmit();
      } else {
        nextStep();
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createProvider(formData as ProviderFormData);
      // Redirect or show success
      // TODO: Redirect to /dashboard/proveedores when list view is implemented
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error submitting form:', error);

      if (
        error &&
        Array.isArray(error.detail) &&
        error.detail.some(
          (err: any) =>
            err.loc?.includes('fecha_estado_financiero') &&
            err.msg?.includes('La fecha no puede ser futura')
        )
      ) {
        Swal.fire({
          icon: 'error',
          title: 'Error de validación',
          text: 'La fecha del estado financiero no puede ser futura.',
          confirmButtonColor: '#0097b2',
        });
        return;
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al registrar el proveedor. Por favor intente nuevamente.',
        confirmButtonColor: '#0097b2',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Identification />;
      case 2:
        return <Step2Requirements />;
      case 3:
        return <Step3Capacity />;
      case 4:
        return <Step4Completion />;
      default:
        return <Step1Identification />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-12">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-8 mt-8">
        Registro de proveedores
      </h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden min-h-[750px] flex flex-col">
        {/* Content Area */}
        <div className="flex-grow flex flex-col p-4 md:p-8 bg-gray-50">
          {renderStep()}
        </div>

        {/* Footer / Navigation */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          {/* Step Indicator (Centered/Leftish) */}
          <div className="flex-1">
            <StepIndicator currentStep={currentStep} totalSteps={4} />
          </div>

          {/* Buttons (Right aligned) */}
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                Atrás
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm disabled:opacity-50 flex items-center"
            >
              {isSubmitting
                ? 'Guardando...'
                : currentStep === 4
                  ? 'Finalizar'
                  : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
