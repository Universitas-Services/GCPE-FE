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

const PRESENTATION_OPENING_ACTS_QUESTIONS = [
  {
    id: 8,
    question:
      '¿El expediente de contrataciones contempló el acta de recepción de sobres contentivo de la manifestación de voluntad de participar, documentos de calificación y ofertas?',
    citation:
      'Artículos 19, 20, 78.1, 91, 92 LCP; 32.7, 96 RLCP; 31, 32 LOPA; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 9,
    question:
      '¿El expediente de contrataciones incluyó el acta de apertura de sobres contentivo de la manifestación de voluntad de participar, recaudos legales-financieros y ofertas?',
    citation:
      'Artículos 19, 20, 78.1, 93 LCP; 32.13 RLCP; 31, 32 LOPA; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
];

export function PresentationOpeningActsForm() {
  const { complianceAnswers, setAnswer, goToNextPage, goToPreviousPage } =
    useCompliance();

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-sm border-gray-100">
      <CardHeader className="pb-8">
        <CardTitle className="text-2xl font-bold text-[#0b1e4c]">
          Actos de presentación y apertura
        </CardTitle>
        <CardDescription className="text-gray-400 text-base italic">
          Objetivo: Validar la recepción formal de documentos y el acto público
          de apertura.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {PRESENTATION_OPENING_ACTS_QUESTIONS.map((item) => (
          <ComplianceQuestionItem
            key={item.id}
            id={item.id}
            question={item.question}
            citation={item.citation}
            value={complianceAnswers[item.id]}
            onChange={(val) => setAnswer(item.id, val)}
          />
        ))}

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
            onClick={goToNextPage}
          >
            Siguiente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
