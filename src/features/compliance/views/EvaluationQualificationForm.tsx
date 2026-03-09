'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCompliance } from '../context/ComplianceContext';
import { ComplianceQuestionItem } from './ComplianceQuestionItem';

const EVALUATION_QUALIFICATION_QUESTIONS = [
  {
    id: 10,
    question: '¿El expediente de contrataciones incluyó las ofertas?',
    citation:
      'Artículos 19, 20 LCP; 32.8 RLCP; 31, 32 LOPA; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI..',
  },
  {
    id: 11,
    question:
      '¿El expediente de contrataciones agregó las Garantías de sostenimiento de la oferta de los oferentes?',
    citation:
      'Artículos 19, 20, 63, 64, LCP; 32.13 RLCP; 31, 32 LOPA; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 12,
    question:
      '¿El expediente de contrataciones incluyó el certificado de inscripción ante el Registro Nacional de Contratistas de los oferentes?',
    citation:
      'Artículos 19, 20,42.1, 47 LCP; 32.13, 85 RLCP; 31, 32 LOPA; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 13,
    question:
      '¿El expediente de contrataciones agregó certificado de la calificación de los oferentes del SNC?',
    citation:
      'Artículos 19, 20, 42.2 LCP; 32.13 RLCP; 31, 32 LOPA; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 14,
    question:
      '¿El expediente de contrataciones incorporó las Solvencias requeridas (banavih, laboral, ivss, inces)?',
    citation:
      'Artículos 19, 20 LCP; 32.13, 127 RLCP; 31, 32 LOPA; Resolución No. 8.100 del 29-11-2012 G.O. #40.064 del 04-12-2012, Ministerio del Poder Popular para el Trabajo y Seguridad Social; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 15,
    question:
      '¿El expediente de contrataciones incluyó el informe de recomendación?',
    citation:
      'Artículos 19, 20, 95 LCP; 22, 32.9 RLCP; 31, 32 LOPA; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
];

export function EvaluationQualificationForm() {
  const { complianceAnswers, setAnswer, goToNextPage, goToPreviousPage } =
    useCompliance();

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-sm border-gray-100">
      <CardContent className="space-y-6 pt-6">
        {EVALUATION_QUALIFICATION_QUESTIONS.map((item) => (
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
