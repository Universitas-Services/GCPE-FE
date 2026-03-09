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

function ComplianceContent() {
  const { currentPage, totalPages, setCurrentPage } = useCompliance();

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] p-4 md:p-6">
      <div className="w-full max-w-5xl mx-auto flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden flex-1 border border-gray-200">
        {/* Header fijo */}
        <div className="shrink-0 p-4 md:p-6 md:pb-2 border-b border-gray-100 bg-white z-10">
          <ComplianceHeader />
        </div>

        {/* Contenedor con scroll interno para la Card / Formulario */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30 p-4 md:p-6 w-full relative">
          <div className="max-w-4xl mx-auto pb-8">
            {renderStep(currentPage)}
          </div>
        </div>

        {/* Paginación fija en la parte inferior */}
        <div className="shrink-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 flex justify-center items-center">
          <CompliancePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-0"
          />
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
