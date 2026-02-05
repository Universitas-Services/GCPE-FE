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
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 w-full max-w-5xl mx-auto py-8 px-4">
        <ComplianceHeader />

        {/* Main Content Area */}
        <div className="mb-8">{renderStep(currentPage)}</div>

        <CompliancePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="flex justify-center pb-8"
        />
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
