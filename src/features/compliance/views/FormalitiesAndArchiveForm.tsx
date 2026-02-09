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

import { useState } from 'react';
import { complianceService } from '../services/compliance.service';
// Assuming useToast exists or we use alert for now if not found, but list_dir will confirm.
// I will use window.alert if toast is not obvious, or just console.error.
// Actually, I'll prefer a simple alert or just navigation on success.

export function FormalitiesAndArchiveForm() {
  const {
    complianceAnswers,
    setAnswer,
    goToNextPage,
    goToPreviousPage,
    generalData,
    setComplianceId,
  } = useCompliance();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateDocument = async () => {
    try {
      setIsSubmitting(true);
      // Validate that all questions 1-24 are answered?
      // User didn't strictly ask for validation blocking, but it's good practice.
      // For now, I'll proceed with submission. The service maps missing answers to "NA".

      const response = await complianceService.submitComplianceForm(
        generalData,
        complianceAnswers
      );

      console.log('Respuesta del servidor al crear documento:', response);

      // Save ID to context (support 'id' or 'pk')
      const newId = response?.id || response?.pk;
      if (newId) {
        setComplianceId(newId);
      } else {
        console.warn('No se encontró un ID válido en la respuesta:', response);
        // Optional warning to user
      }

      // On success
      goToNextPage();
    } catch (error) {
      console.error('Error al crear documento:', error);
      alert(
        'Error al crear el documento. Por favor verifique los datos e intente nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-sm border-gray-100">
      <CardHeader className="pb-8">
        <CardTitle className="text-2xl font-bold text-[#0b1e4c]">
          Formalidades y archivo del expediente
        </CardTitle>
        <CardDescription className="text-gray-400 text-base italic">
          Objetivo: Asegurar que el expediente físico cumple con las normas de
          control interno (SUNAI) y archivo.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
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

        <div className="flex justify-between pt-8">
          <Button
            type="button"
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg rounded-xl"
            onClick={goToPreviousPage}
            disabled={isSubmitting}
          >
            Anterior
          </Button>
          <Button
            type="button"
            className="bg-[#0097b2] hover:bg-[#008299] text-white px-8 py-6 text-lg rounded-xl"
            onClick={handleCreateDocument}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Crear documento'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
