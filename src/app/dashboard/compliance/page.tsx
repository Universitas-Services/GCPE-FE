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
import { FormHeader } from '@/components/shared/FormHeader';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasShownModalForQ25, setHasShownModalForQ25] = useState(false);
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

  const handleGenerateCompliance = () => {
    setIsSubmitting(true);

    // 1. Mostrar toast inicial de procesamiento y navegación al inicio
    toast.success('¡Solicitud de envío exitoso!', {
      description: (
        <span className="text-slate-800 font-medium">
          Tu reporte de compliance se esta generando y enviando al correo
          electrónico establecido exitosamente, redireccionando al inicio.
        </span>
      ),
      position: 'top-center',
      duration: 4000,
    });

    // 2. Redireccionar al inicio tras 4 segundos
    setTimeout(() => {
      router.push('/dashboard');
    }, 4000);

    // 3. Ejecutar envío de formulario en background
    complianceService
      .submitComplianceForm(generalData, complianceAnswers)
      .then((response) => {
        console.log('Respuesta del servidor al crear documento:', response);
        toast.success('¡Reporte compliance enviado exitosamente!', {
          description: (
            <span className="text-slate-800 font-medium">
              La generacion de su reporte ha culminado exitosamente por favor
              revise el correo electrónico.
            </span>
          ),
          position: 'top-center',
          duration: 6000,
        });
      })
      .catch((error) => {
        console.error('Error al generar compliance:', error);
        toast.error('Ocurrió un error', {
          description: (
            <span className="text-slate-800 font-medium">
              {error instanceof Error
                ? error.message
                : 'No se pudo generar el reporte. Inténtelo más tarde.'}
            </span>
          ),
          position: 'top-center',
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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
        isGenerating={isSubmitting}
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
            disabled={isSubmitting}
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
              disabled={isSubmitting || complianceAnswers[25] === undefined}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando y enviando...
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
