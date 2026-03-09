'use client';

import React from 'react';

import { useCompliance } from '../context/ComplianceContext';
import { ComplianceQuestionItem } from './ComplianceQuestionItem';

const AWARD_CONTRACT_QUESTIONS = [
  {
    id: 16,
    question:
      '¿El expediente de contrataciones incluyó la adjudicación o su equivalente?',
    citation:
      'Artículos 19, 20 LCP; 32.10 RLCP; 31, 32 LOPA; 1,6 LCC; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 17,
    question:
      '¿El expediente de contrataciones incluyó la notificación de interesados?',
    citation:
      'Artículos 19, 20 LCP; 32.11, 126 RLCP; 31, 32 LOPA; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 18,
    question:
      '¿El expediente de contrataciones agregó las garantías de la contratación?',
    citation:
      'Artículos 19, 20 LCP; 32.13, 127 RLCP; 31, 32 LOPA; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 19,
    question:
      '¿El expediente de contrataciones incluyó el Contrato, orden de compra u orden de servicio?',
    citation:
      'Artículos 6.32, 19, 20 LCP; 32.12, 132 RLCP; 31, 32 LOPA; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 20,
    question:
      '¿El expediente de contrataciones incluyó el cumplimiento del compromiso de responsabilidad social?',
    citation:
      'Artículos 6.24, 19, 20 LCP; 32.13 RLCP; 31, 32 LOPA; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
];

export function AwardContractForm() {
  const { complianceAnswers, setAnswer } = useCompliance();

  return (
    <div className="w-full space-y-4">
      {AWARD_CONTRACT_QUESTIONS.map((item) => (
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
