'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProviderFormData } from '../types/provider.types';
import { providerSchema } from '../schemas/provider.schema';
import { ZodError } from 'zod';

interface ProviderFormContextProps {
  currentStep: number;
  formData: Partial<ProviderFormData>;
  updateFormData: (data: Partial<ProviderFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  errors: Record<string, string>;
  validateStep: (step: number) => boolean;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  resetForm: () => void;
}

const ProviderFormContext = createContext<ProviderFormContextProps | undefined>(
  undefined
);

export const ProviderFormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ProviderFormData>>({
    tipo_persona: 'Juridica', // Default based on example
    actividad_comercial_principal: false,
    tiene_rnc: false,
    tiene_solvencia_laboral: false,
    tiene_licencia_municipal: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (data: Partial<ProviderFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // Clear errors for updated fields
    const newErrors = { ...errors };
    Object.keys(data).forEach((key) => {
      delete newErrors[key];
    });
    setErrors(newErrors);
  };

  const validateStep = (step: number): boolean => {
    try {
      let stepSchema;
      switch (step) {
        case 1:
          stepSchema = providerSchema.pick({
            correo_proveedor: true,
            nombre_proveedor: true,
            rif_proveedor: true,
            tipo_persona: true,
            tipo_entidad_juridica: true,
            estado: true,
            municipio: true,
            parroquia: true,
            direccion_fiscal: true,
            telefono_proveedor: true,
            nombre_rep_legal: true,
            cedula_rep_legal: true,
          });
          break;
        case 2:
          stepSchema = providerSchema.pick({
            tiene_rnc: true,
            tiene_solvencia_laboral: true,
            tiene_licencia_municipal: true,
          });
          break;
        case 3:
          stepSchema = providerSchema.pick({
            actividad_comercial_principal: true,
            area_especialidad: true,
            anos_experiencia: true,
            fecha_estado_financiero: true,
            patrimonio_reportado: true,
            nivel_contratacion: true,
          });
          break;
        case 4:
          stepSchema = providerSchema.pick({
            desea_version_pro_proveedores: true,
          });
          break;
        default:
          return true;
      }

      stepSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        // ZodError issues can be in .errors or .issues depending on version/bundling
        const issues = (error as any).errors || (error as any).issues;

        if (Array.isArray(issues)) {
          issues.forEach((err: any) => {
            if (err.path && err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
        }
        setErrors(fieldErrors);
      } else {
        console.error('Validation error:', error);
      }
      return false;
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const resetForm = () => {
    setFormData({});
    setCurrentStep(1);
    setIsSubmitting(false);
  };

  return (
    <ProviderFormContext.Provider
      value={{
        currentStep,
        formData,
        updateFormData,
        nextStep,
        prevStep,
        errors,
        validateStep,
        isSubmitting,
        setIsSubmitting,
        resetForm,
      }}
    >
      {children}
    </ProviderFormContext.Provider>
  );
};

export const useProviderForm = () => {
  const context = useContext(ProviderFormContext);
  if (!context) {
    throw new Error(
      'useProviderForm must be used within a ProviderFormProvider'
    );
  }
  return context;
};
