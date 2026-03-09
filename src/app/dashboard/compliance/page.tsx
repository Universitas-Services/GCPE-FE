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
} from '@/features/compliance';
import { complianceService } from '@/features/compliance/services/compliance.service';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function ComplianceContent() {
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    generalData,
    complianceAnswers,
    setComplianceId,
    complianceId,
    goToNextPage,
    goToPreviousPage,
  } = useCompliance();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCreateDocument = async () => {
    try {
      setIsSubmitting(true);
      const response = await complianceService.submitComplianceForm(
        generalData,
        complianceAnswers
      );
      console.log('Respuesta del servidor al crear documento:', response);
      const newId = response?.id || response?.pk;
      if (newId) {
        setComplianceId(newId);
      } else {
        console.warn('No se encontró un ID válido en la respuesta:', response);
      }
      goToNextPage();
    } catch (error) {
      console.error('Error al crear documento:', error);
      alert(
        'Error al crear el documento. Por favor verifique los datos e intente nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!complianceId) {
      alert(
        'No se ha encontrado el ID del documento. Por favor regrese y cree el documento nuevamente.'
      );
      return;
    }
    try {
      setIsDownloading(true);
      await complianceService.downloadPdf(complianceId);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error al descargar el PDF.');
    } finally {
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

      <div className="w-full max-w-[1600px] mx-auto flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden flex-1 border border-gray-200">
        {/* Header fijo interno */}
        {currentStepInfo && (
          <div className="shrink-0 p-2 md:p-4 pb-1 md:pb-2 border-b border-gray-100 bg-white z-10">
            <h2 className="text-xl md:text-2xl font-bold text-[#0b1e4c] mb-1">
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
              className="bg-[#0097b2] hover:bg-[#008299] text-white px-6 py-2 text-base rounded-xl"
            >
              Siguiente
            </Button>
          ) : currentPage < 6 ? (
            <Button
              type="button"
              className="bg-[#0097b2] hover:bg-[#008299] text-white px-6 py-2 text-base rounded-xl"
              onClick={goToNextPage}
            >
              Siguiente
            </Button>
          ) : null}

          {currentPage === 6 && (
            <Button
              type="button"
              className="bg-[#0097b2] hover:bg-[#008299] text-white px-6 py-2 text-base rounded-xl"
              onClick={handleCreateDocument}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Crear documento'}
            </Button>
          )}

          {currentPage === 7 && (
            <Button
              type="button"
              className="bg-[#0097b2] hover:bg-[#008299] text-white px-6 py-2 text-base rounded-xl"
              onClick={handleDownloadPdf}
              disabled={!complianceId || isDownloading}
            >
              {isDownloading ? 'Descargando...' : 'Descargar documento PDF'}
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
