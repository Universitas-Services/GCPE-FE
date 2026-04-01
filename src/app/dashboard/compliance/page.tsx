'use client';

import {
  ComplianceHeader,
  GeneralDataForm,
  CompliancePagination,
  PreparatoryActsForm,
  PresentationOpeningActsForm,
  EvaluationQualificationForm,
  AwardContractForm,
  FormalitiesAndArchiveForm,
  AdvancedReportForm,
  ComplianceProvider,
  useCompliance,
  ComplianceSuccessModal,
  ComplianceDownloadSuccessModal,
  ComplianceErrorModal,
} from '@/features/compliance';
import { complianceService } from '@/features/compliance/services/compliance.service';
import { Button } from '@/components/ui/button';
import { FormHeader } from '@/components/shared/FormHeader';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function ComplianceContent() {
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    generalData,
    complianceAnswers,
    goToNextPage,
    goToPreviousPage,
  } = useCompliance();

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasShownModalForQ25, setHasShownModalForQ25] = useState(false);
  const [showDownloadSuccessModal, setShowDownloadSuccessModal] =
    useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const answer25 = complianceAnswers[25];
  const prevAnswer25Ref = useRef(answer25);

  useEffect(() => {
    if (
      currentPage === 7 &&
      prevAnswer25Ref.current === undefined &&
      answer25 !== undefined &&
      !hasShownModalForQ25
    ) {
      setShowSuccessModal(true);
      setHasShownModalForQ25(true);
    }
    prevAnswer25Ref.current = answer25;
  }, [currentPage, answer25, hasShownModalForQ25]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  const handleError = (error: unknown) => {
    let title = 'Error al generar compliance';
    let message = 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';

    if (error instanceof Error) {
      const errorMsg = error.message;

      if (errorMsg.includes('PDF')) {
        title = 'Error al descargar el PDF';
        message = 'No se pudo descargar el PDF. Por favor, intenta nuevamente.';
      } else if (
        errorMsg.includes('401') ||
        errorMsg.includes('Unauthorized')
      ) {
        title = 'Sesión expirada';
        message = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      } else if (errorMsg.includes('403') || errorMsg.includes('Forbidden')) {
        title = 'Acceso denegado';
        message = 'No tienes permisos para realizar esta acción.';
      } else if (errorMsg.includes('404') || errorMsg.includes('Not Found')) {
        title = 'Recurso no encontrado';
        message =
          'El recurso solicitado no fue encontrado. Intenta nuevamente.';
      } else if (
        errorMsg.includes('500') ||
        errorMsg.includes('Internal Server Error')
      ) {
        title = 'Error del servidor';
        message =
          'Hubo un problema en el servidor. Por favor, intenta más tarde.';
      } else if (errorMsg.includes('400') || errorMsg.includes('Bad Request')) {
        title = 'Datos inválidos';
        message =
          errorMsg ||
          'Los datos proporcionados son inválidos. Verifica la información.';
      } else if (errorMsg.includes('Network') || errorMsg.includes('network')) {
        title = 'Error de conexión';
        message =
          'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      } else {
        message = errorMsg || message;
      }
    }

    setErrorTitle(title);
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const handleGenerateCompliance = async () => {
    try {
      setIsSubmitting(true);

      // 1. Submit form (POST /api/compliance)
      const response = await complianceService.submitComplianceForm(
        generalData,
        complianceAnswers
      );
      console.log('Respuesta del servidor al crear documento:', response);

      const newId = response?.id || response?.pk;

      if (!newId) {
        console.warn('No se encontró un ID válido en la respuesta:', response);
        handleError(
          new Error('No se recibió un ID válido para generar el PDF.')
        );
        return;
      }

      // 2. Automatically trigger PDF Download (GET /api/compliance/{id}/pdf)
      setIsDownloading(true);
      await complianceService.downloadPdf(newId);

      // Show success modal and redirect to dashboard
      setShowDownloadSuccessModal(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 4000);
    } catch (error) {
      console.error('Error al generar compliance:', error);
      handleError(error);
    } finally {
      setIsSubmitting(false);
      setIsDownloading(false);
    }
  };

  const stepInfo: Record<number, { title: string; description: string }> = {
    1: {
      title: 'Datos generales',
      description: 'Ingresa tus datos para continuar',
    },
    2: {
      title: 'Actos preparatorios y publicación',
      description:
        'Objetivo: Verificar que el proceso inició correctamente y fue publicado según la ley.',
    },
    3: {
      title: 'Actos de presentación y apertura',
      description:
        'Objetivo: Validar la recepción formal de documentos y el acto público de apertura.',
    },
    4: {
      title: 'Evaluación y calificación de oferentes',
      description:
        'Objetivo: Revisar que las ofertas y las empresas participantes cumplan con los requisitos legales y técnicos.',
    },
    5: {
      title: 'Adjudicación y formalización del contrato',
      description:
        'Objetivo: Verificar la selección del ganador y la firma del contrato.',
    },
    6: {
      title: 'Formalidades y archivo del expediente',
      description:
        'Objetivo: Asegurar que el expediente físico cumple con las normas de control interno (SUNAI) y archivo.',
    },
    7: {
      title: 'Avanzadas y reporte final',
      description:
        'Objetivo: Ofrecer un análisis profundo (PRO) y finalizar el flujo de trabajo.',
    },
  };

  const currentStepInfo = stepInfo[currentPage];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] p-2 md:p-4">
      {/* Outer Header (fuera de la card) */}
      <ComplianceHeader />

      <ComplianceSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onGenerate={() => {
          setShowSuccessModal(false);
          handleGenerateCompliance();
        }}
        isGenerating={isSubmitting || isDownloading}
      />

      <ComplianceDownloadSuccessModal
        isOpen={showDownloadSuccessModal}
        onClose={() => {
          setShowDownloadSuccessModal(false);
          router.push('/dashboard');
        }}
      />

      <ComplianceErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorTitle={errorTitle}
        errorMessage={errorMessage}
      />

      <div className="w-full max-w-[1600px] mx-auto flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden flex-1 border border-gray-200">
        {/* Header fijo interno */}
        {currentStepInfo && (
          <div className="shrink-0 p-2 md:p-4 pb-1 md:pb-2 border-b border-gray-100 bg-white z-10">
            <FormHeader
              title={currentStepInfo.title}
              description={currentStepInfo.description}
              className="mb-0"
            />
          </div>
        )}

        {/* Contenedor con scroll interno para la Card / Formulario */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto bg-gray-50/30 p-2 md:p-4 w-full relative"
        >
          {renderStep(currentPage)}
        </div>

        {/* Paginación fija en la parte inferior */}
        <div className="shrink-0 bg-white border-t border-gray-200 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 flex justify-between items-center px-8 relative">
          <Button
            type="button"
            variant="outline"
            className={`border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 text-base rounded-xl transition-opacity ${
              currentPage === 1
                ? 'opacity-0 pointer-events-none'
                : 'opacity-100'
            }`}
            onClick={goToPreviousPage}
            disabled={isSubmitting || isDownloading}
          >
            Anterior
          </Button>

          <div className="absolute left-1/2 md:left-1/2 transform -translate-x-1/2 hidden md:block w-auto">
            <CompliancePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-0"
            />
          </div>

          <div className="md:hidden block">
            <CompliancePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-0"
            />
          </div>

          {currentPage === 1 ? (
            <Button
              type="submit"
              form="compliance-general-data"
              className="btn-primary px-6 py-2 text-base rounded-xl"
            >
              Siguiente
            </Button>
          ) : currentPage < 7 ? (
            <Button
              type="button"
              className="btn-primary px-6 py-2 text-base rounded-xl"
              onClick={goToNextPage}
            >
              Siguiente
            </Button>
          ) : null}

          {currentPage === 7 && (
            <Button
              type="button"
              className="btn-primary px-6 py-2 text-base rounded-xl"
              onClick={handleGenerateCompliance}
              disabled={
                isSubmitting ||
                isDownloading ||
                complianceAnswers[25] === undefined
              }
            >
              {isSubmitting || isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando y descargando...
                </>
              ) : (
                'Generar compliance'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function renderStep(page: number) {
  switch (page) {
    case 1:
      return <GeneralDataForm />;
    case 2:
      return <PreparatoryActsForm />;
    case 3:
      return <PresentationOpeningActsForm />;
    case 4:
      return <EvaluationQualificationForm />;
    case 5:
      return <AwardContractForm />;
    case 6:
      return <FormalitiesAndArchiveForm />;
    case 7:
      return <AdvancedReportForm />;
    default:
      return (
        <div className="text-center py-20 text-gray-500">
          Página en construcción
        </div>
      );
  }
}

export default function CompliancePage() {
  return (
    <ComplianceProvider>
      <ComplianceContent />
    </ComplianceProvider>
  );
}
