'use client';

import { useCompliance } from '../context/ComplianceContext';
import { ComplianceQuestionItem } from './ComplianceQuestionItem';

const ADVANCED_REPORT_QUESTION = {
  id: 25,
  question:
    '¿Desea realizar una revisión detallada de fondo a cada acto administrativo contenido en el expediente para detectar desviaciones legales específicas?',
};

export function AdvancedReportForm() {
  const { complianceAnswers, setAnswer } = useCompliance();

  return (
    <div className="w-full space-y-4">
      <ComplianceQuestionItem
        key={ADVANCED_REPORT_QUESTION.id}
        id={ADVANCED_REPORT_QUESTION.id} // Ensure ID is passed if needed by component logic, but hideNoAplica handles the buttons
        question={ADVANCED_REPORT_QUESTION.question}
        value={complianceAnswers[ADVANCED_REPORT_QUESTION.id]}
        onChange={(val) => setAnswer(ADVANCED_REPORT_QUESTION.id, val)}
        hideNoAplica={true} // Shows only Yes/No buttons
      />
    </div>
  );
}
