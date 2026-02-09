'use client';

import React, { useState } from 'react';
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

const ADVANCED_REPORT_QUESTION = {
  id: 25,
  question:
    '¿Desea realizar una revisión detallada de fondo a cada acto administrativo contenido en el expediente para detectar desviaciones legales específicas?',
};

import { complianceService } from '../services/compliance.service';

export function AdvancedReportForm() {
  const { complianceAnswers, setAnswer, goToPreviousPage, complianceId } =
    useCompliance();
  const [isDownloading, setIsDownloading] = useState(false);

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
          id={ADVANCED_REPORT_QUESTION.id} // Ensure ID is passed if needed by component logic, but hideNoAplica handles the buttons
          question={ADVANCED_REPORT_QUESTION.question}
          value={complianceAnswers[ADVANCED_REPORT_QUESTION.id]}
          onChange={(val) => setAnswer(ADVANCED_REPORT_QUESTION.id, val)}
          hideNoAplica={true} // Shows only Yes/No buttons
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
            onClick={handleDownloadPdf}
            disabled={!complianceId || isDownloading}
          >
            {isDownloading ? 'Descargando...' : 'Descargar documento PDF'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
