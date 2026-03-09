'use client';

import React from 'react';

import { useCompliance } from '../context/ComplianceContext';
import { ComplianceQuestionItem } from './ComplianceQuestionItem';

const PREPARATORY_ACTS_QUESTIONS = [
  {
    id: 1,
    question:
      '¿El expediente de contrataciones incluyó las actividades previas?',
    citation:
      'Artículos 6.2, 19, 20, 166.1 LCP; 2.3, 7, 32.1, 33, 111 RLCP; 31, 32 LOPA; unidad del expediente Sentencia SPA-TSJ 22-01-2002 (caso RAMÓN A. GUILLÉN); 22 LCC; 38.5.91.1.9 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 2,
    question: '¿El expediente de contrataciones incluyó el acta de inicio?',
    citation:
      'Artículos 19, 20, 166.3 LCP; 32.2, 107 RLCP; 31, 32 LOPA; 6 LCC; 38.5, 91.1.9 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 3,
    question:
      '¿El expediente de contrataciones incluyó el pliego de condiciones?',
    citation:
      'Artículos 19, 20, 66 LCP; 32.3 RLCP; 31, 32 LOPA; 6 LCC; 35, 38 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 4,
    question:
      '¿El expediente de contrataciones incluyó la publicación del llamado en el portal web SNC?',
    citation:
      'Artículos 19, 20, 53.4, 79, 80 LCP; 32.5, 103 RLCP; 31, 32 LOPA; 1, 6, 9 LCC; 38.5, 91.1.9 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 5,
    question:
      '¿El expediente de contrataciones incluyó la publicación del llamado en el portal web del órgano u ente?',
    citation:
      'Artículos 19, 20, 79, 80 LCP; 32.5, 103, RLCP; 31, 32 LOPA; 6 LCC; 38.5, 91.1.9 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 6,
    question:
      '¿El expediente de contrataciones incorporó el registro de adquirientes?',
    citation:
      'Artículos 19, 20, 65 LCP; 32.13 RLCP; 31, 32 LOPA; 6 LCC; 38.5, 91.1.9 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 7,
    question:
      '¿El expediente de contrataciones incluyó solicitudes de modificaciones y aclaratorias?',
    citation:
      'Artículos 19, 20, 68, 69 LCP; 32.6 RLCP; 31, 32 LOPA; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
];

export function PreparatoryActsForm() {
  const { complianceAnswers, setAnswer } = useCompliance();

  return (
    <div className="w-full space-y-6">
      {PREPARATORY_ACTS_QUESTIONS.map((item) => (
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
