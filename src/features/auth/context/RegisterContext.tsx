'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos de datos para el formulario de registro
export interface RegisterFormData {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptedTerms?: boolean;
}

interface RegisterContextType {
  currentStep: number;
  formData: RegisterFormData;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<RegisterFormData>) => void;
}

const RegisterContext = createContext<RegisterContextType | undefined>(
  undefined
);

export function RegisterProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>({});

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (data: Partial<RegisterFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <RegisterContext.Provider
      value={{ currentStep, formData, nextStep, prevStep, updateFormData }}
    >
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {
  const context = useContext(RegisterContext);
  if (context === undefined) {
    throw new Error('useRegister must be used within a RegisterProvider');
  }
  return context;
}
