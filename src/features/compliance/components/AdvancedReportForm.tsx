'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCompliance } from '../context/ComplianceContext';
import { ComplianceQuestionItem } from './ComplianceQuestionItem';

// As requested, ID 25 is used internally but not shown.
const ADVANCED_REPORT_QUESTION = {
  id: 25,
  question:
    '¿Desea realizar una revisión detallada de fondo a cada acto administrativo contenido en el expediente para detectar desviaciones legales específicas?',
  // No citation as requested
};

export function AdvancedReportForm() {
  const { complianceAnswers, setAnswer, goToPreviousPage } = useCompliance();

  const handlePrintReport = () => {
    // TODO: Connect to endpoint for submission
    console.log('Printing report/Submitting form', complianceAnswers);
    alert('Funcionalidad de impresión/envío pendiente de implementación');
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-sm border-gray-100">
      <CardHeader className="pb-8">
        <CardTitle className="text-2xl font-bold text-[#0b1e4c]">
          Avanzadas y reporte final
        </CardTitle>
        <CardDescription className="text-gray-400 text-base italic">
          Objetivo: Ofrecer un análisis profundo (PRO) y finalizar el flujo de
          trabajo.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <ComplianceQuestionItem
          key={ADVANCED_REPORT_QUESTION.id}
          // ID is not passed so it won't be displayed
          question={ADVANCED_REPORT_QUESTION.question}
          value={complianceAnswers[ADVANCED_REPORT_QUESTION.id]}
          onChange={(val) => setAnswer(ADVANCED_REPORT_QUESTION.id, val)}
          hideNoAplica={true}
        />

        <div className="flex justify-between pt-8">
          <Button
            type="button"
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg rounded-xl"
            onClick={goToPreviousPage}
          >
            Anterior
          </Button>
          <Button
            type="button"
            className="bg-[#0097b2] hover:bg-[#008299] text-white px-8 py-6 text-lg rounded-xl"
            onClick={handlePrintReport}
          >
            Imprimir reporte
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
