'use client';

import React from 'react';

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
  const { complianceAnswers, setAnswer } = useCompliance();

  return (
    <div className="w-full space-y-6">
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
    </div>
  );
}
