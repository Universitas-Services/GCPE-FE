'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface RecoveryFormData {
  email?: string;
  code?: string;
  resetToken?: string;
  password?: string;
  confirmPassword?: string;
}

interface RecoveryContextType {
  currentStep: number;
  formData: RecoveryFormData;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<RecoveryFormData>) => void;
}

const RecoveryContext = createContext<RecoveryContextType | undefined>(
  undefined
);

export function RecoveryProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RecoveryFormData>({});

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (data: Partial<RecoveryFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <RecoveryContext.Provider
      value={{ currentStep, formData, nextStep, prevStep, updateFormData }}
    >
      {children}
    </RecoveryContext.Provider>
  );
}

export function useRecovery() {
  const context = useContext(RecoveryContext);
  if (context === undefined) {
    throw new Error('useRecovery must be used within a RecoveryProvider');
  }
  return context;
}
