'use client';

import React from 'react';

import { useCompliance } from '../context/ComplianceContext';
import { ComplianceQuestionItem } from './ComplianceQuestionItem';

const FORMALITIES_ARCHIVE_QUESTIONS = [
  {
    id: 21,
    question:
      '¿El expediente fue debidamente identificado con la nomenclatura del proceso, nombre del contratante y contratista, y objeto, conforme a lo establecido en el Art. 34, numeral 1 de las Normas SUNAI?',
    citation:
      'Artículos 32 RLCP; 31, 32 LOPA; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (1) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 22,
    question:
      '¿Se verificó que todos los documentos del expediente se encontraban debidamente foliados en estricto orden cronológico, conforme a su fecha de incorporación, cumpliendo con lo establecido en el Art. 34, numeral 4 de las Normas SUNAI?',
    citation:
      'Artículos 32 RLCP; 31, 32 LOPA; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (4) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 23,
    question:
      '¿Se constató que el expediente, en caso de estar conformado por múltiples piezas o tomos, cada unidad documental se encontraba debidamente identificada y vinculada al proceso principal, conforme al Art. 34, numeral 4 de las Normas SUNAI?',
    citation:
      'Artículos 32 RLCP; 31, 32 LOPA; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (4) NORMAS DE CONTROL INTERNO SUNAI.',
  },
  {
    id: 24,
    question:
      '¿El expediente de contrataciones incluyó el cumplimiento del compromiso de responsabilidad social?',
    citation:
      'Artículos 6.24, 19, 20 LCP; 32.13 RLCP; 31, 32 LOPA; 6 LCC; 38.5.91.1.9.29 LOCGR; 34 (2) NORMAS DE CONTROL INTERNO SUNAI.',
  },
];

export function FormalitiesAndArchiveForm() {
  const { complianceAnswers, setAnswer } = useCompliance();

  return (
    <div className="w-full space-y-6">
      {FORMALITIES_ARCHIVE_QUESTIONS.map((item) => (
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
