'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

// Tipos para los datos generales
export interface GeneralData {
  email: string;
  entityName: string;
  unitName: string;
  reviewDate?: Date;
  reviewerName: string;
  documentCode: string;
}

// Tipo para las respuestas de todos los formularios de cumplimiento
// Las respuestas pueden ser 'SI', 'NO', 'NO_APLICA' o undefined si no se ha respondido
export type QuestionAnswer = 'SI' | 'NO' | 'NO_APLICA';

export interface ComplianceAnswers {
  [questionId: number]: QuestionAnswer;
}

interface ComplianceContextType {
  // Estado
  currentPage: number;
  generalData: GeneralData;
  complianceAnswers: ComplianceAnswers;
  totalPages: number;
  complianceId: number | null;

  // Acciones
  setCurrentPage: (page: number) => void;
  setGeneralData: (data: GeneralData) => void;
  setAnswer: (questionId: number, answer: QuestionAnswer) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  setComplianceId: (id: number) => void;
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(
  undefined
);

export function ComplianceProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [generalData, setGeneralDataState] = useState<GeneralData>({
    email: '',
    entityName: '',
    unitName: '',
    reviewerName: '',
    documentCode: '',
  });
  const [complianceAnswers, setComplianceAnswers] = useState<ComplianceAnswers>(
    {}
  );

  const [complianceId, setComplianceId] = useState<number | null>(null);

  const totalPages = 7; // Definido en el requerimiento original (vista de paginación)

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [currentPage]);

  const setGeneralData = (data: GeneralData) => {
    setGeneralDataState(data);
  };

  const setAnswer = (questionId: number, answer: QuestionAnswer) => {
    setComplianceAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const value = {
    currentPage,
    generalData,
    complianceAnswers,
    totalPages,
    complianceId,
    setCurrentPage,
    setGeneralData,
    setAnswer,
    goToNextPage,
    goToPreviousPage,
    setComplianceId,
  };

  return (
    <ComplianceContext.Provider value={value}>
      {children}
    </ComplianceContext.Provider>
  );
}

export function useCompliance() {
  const context = useContext(ComplianceContext);
  if (context === undefined) {
    throw new Error('useCompliance must be used within a ComplianceProvider');
  }
  return context;
}
