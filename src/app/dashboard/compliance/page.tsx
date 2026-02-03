'use client';

import {
  ComplianceHeader,
  GeneralDataForm,
  CompliancePagination,
} from '@/features/compliance';
import { useState } from 'react';

export default function CompliancePage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 w-full max-w-5xl mx-auto py-8 px-4">
        <ComplianceHeader />

        {/* Main Content Area */}
        <div className="mb-8">
          <GeneralDataForm />
        </div>

        <CompliancePagination
          currentPage={currentPage}
          totalPages={7}
          onPageChange={setCurrentPage}
          className="flex justify-center pb-8"
        />
      </div>
    </div>
  );
}
