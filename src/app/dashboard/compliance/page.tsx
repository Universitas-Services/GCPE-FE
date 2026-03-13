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
} from '@/features/compliance';
import { complianceService } from '@/features/compliance/services/compliance.service';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasShownModalForQ25, setHasShownModalForQ25] = useState(false);

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
        alert('Error: No se recibió un ID válido para generar el PDF.');
        return;
      }

      // 2. Automatically trigger PDF Download (GET /api/compliance/{id}/pdf)
      setIsDownloading(true);
      await complianceService.downloadPdf(newId);
    } catch (error) {
      console.error('Error al generar compliance:', error);
      alert(
        'Error al generar compliance. Por favor verifique los datos e intente nuevamente.'
      );
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
      title: 'Actos Preparatorios y Publicación',
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

      <div className="w-full max-w-[1600px] mx-auto flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden flex-1 border border-gray-200">
        {/* Header fijo interno */}
        {currentStepInfo && (
          <div className="shrink-0 p-2 md:p-4 pb-1 md:pb-2 border-b border-gray-100 bg-white z-10">
            <h2 className="text-xl md:text-2xl font-bold text-[#005282] mb-1">
              {currentStepInfo.title}
            </h2>
            <p className="text-sm text-gray-500">
              {currentStepInfo.description}
            </p>
          </div>
        )}

        {/* Contenedor con scroll interno para la Card / Formulario */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30 p-2 md:p-4 w-full relative">
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
              {isSubmitting || isDownloading
                ? 'Generando y Descargando...'
                : 'Generar compliance'}
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
