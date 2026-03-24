import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormHeader } from '@/components/shared/FormHeader';
import { useProviderForm } from '../context/ProviderFormContext';
import { Step1Identification } from './Step1Identification';
import { Step2Requirements } from './Step2Requirements';
import { Step3Capacity } from './Step3Capacity';
import { Step4Completion } from './Step4Completion';
import { StepIndicator } from '../components/StepIndicator';
import { createProvider } from '../services/providers.service';
import { ProviderFormData } from '../types/provider.types';
import { useRouter } from 'next/navigation';
import { ProviderSuccessModal } from './ProviderSuccessModal';
import { ProviderErrorModal } from './ProviderErrorModal';

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
      setShowSuccessModal(true);
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
        setErrorTitle('Error de validación');
        setErrorMessage('La fecha del estado financiero no puede ser futura.');
        setShowErrorModal(true);
        return;
      }

      const errorMsg =
        error?.message ||
        error?.detail ||
        'Error al registrar el proveedor. Por favor intente nuevamente.';
      setErrorTitle('Error');
      setErrorMessage(
        typeof errorMsg === 'string'
          ? errorMsg
          : 'Error al registrar el proveedor. Por favor intente nuevamente.'
      );
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewProviders = () => {
    setShowSuccessModal(false);
    router.push('/dashboard/proveedores/lista');
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

  const stepInfo = {
    1: {
      title: 'Datos de identificación del proveedor',
      description:
        'Ingresa los datos básicos para generar una demostración del manual de concurso abierto. Lo recibirás en tu correo en pocos minutos.',
    },
    2: {
      title: 'Requisitos Legales',
      description: 'Documentación obligatoria para el registro en el sistema.',
    },
    3: {
      title: 'Capacidad técnica y financiera',
      description:
        'Información sobre la experiencia y solidez financiera de la empresa.',
    },
    4: {
      title: 'Finalizar Registro',
      description: 'Revisa y confirma la información antes de guardar.',
    },
  };

  const currentStepInfo = stepInfo[currentStep as keyof typeof stepInfo];

  return (
    <div className="w-full max-w-full mx-auto px-4 pb-4 flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)]">
      <FormHeader
        title="Registro de proveedores"
        className="text-center mb-10 mt-2 shrink-0"
      />

      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col flex-1">
        {/* Header estático dentro de la Card */}
        {currentStepInfo && (
          <div className="shrink-0 p-2 md:p-4 pb-1 md:pb-2 border-b border-gray-100 bg-white z-10">
            <FormHeader
              title={currentStepInfo.title}
              description={currentStepInfo.description}
              className="mb-0"
            />
          </div>
        )}

        {/* Content Area con Scroll Interno */}
        <div className="flex-1 overflow-y-auto p-2 md:p-4 bg-white relative">
          <div className="max-w-full mx-auto h-full">{renderStep()}</div>
        </div>

        {/* Footer / Navigation - Estático inferior */}
        <div className="shrink-0 bg-white border-t border-gray-200 py-2 px-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 flex justify-between items-center relative">
          <Button
            type="button"
            variant="outline"
            className={`border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 text-base rounded-xl transition-opacity ${
              currentStep === 1
                ? 'opacity-0 pointer-events-none'
                : 'opacity-100'
            }`}
            onClick={prevStep}
            disabled={isSubmitting}
          >
            Anterior
          </Button>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <StepIndicator currentStep={currentStep} totalSteps={4} />
          </div>

          <Button
            type="button"
            className="btn-primary px-6 py-2 text-base rounded-xl"
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Guardando...'
              : currentStep === 4
                ? 'Finalizar'
                : 'Siguiente'}
          </Button>
        </div>
      </div>

      <ProviderSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onViewProviders={handleViewProviders}
      />

      <ProviderErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorTitle={errorTitle}
        errorMessage={errorMessage}
      />
    </div>
  );
};
