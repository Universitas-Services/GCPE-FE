import React from 'react';
import { useProviderForm } from '../context/ProviderFormContext';
import { Button } from '@/components/ui/button';

export const Step2Requirements: React.FC = () => {
  const { formData, updateFormData } = useProviderForm();

  const handleBooleanChange = (name: string, value: boolean) => {
    updateFormData({ [name]: value });
  };

  const BooleanGroup = ({
    label,
    name,
    value,
  }: {
    label: string;
    name: string;
    value: boolean;
  }) => (
    <div className="mb-6">
      <label className="block text-[14px] font-medium text-[#0b1e4c] leading-4 mb-4">
        {label}
      </label>
      <div className="flex space-x-6">
        <Button
          type="button"
          variant={value === true ? 'default' : 'outline'}
          onClick={() => handleBooleanChange(name, true)}
          className="px-8 py-3 text-[11px] font-medium"
          size="lg"
        >
          SI
        </Button>
        <Button
          type="button"
          variant={value === false ? 'default' : 'outline'}
          onClick={() => handleBooleanChange(name, false)}
          className="px-8 py-3 text-[11px] font-medium"
          size="lg"
        >
          NO
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full flex-grow">
      <div className="flex-grow flex flex-col justify-center space-y-8 max-w-2xl mx-auto w-full">
        <BooleanGroup
          label="¿Está registrado en el Registro Nacional de Contratista (RNC)?"
          name="tiene_rnc"
          value={formData.tiene_rnc ?? false}
        />

        <BooleanGroup
          label="¿Tiene solvencia laboral vigente?"
          name="tiene_solvencia_laboral"
          value={formData.tiene_solvencia_laboral ?? false}
        />

        <BooleanGroup
          label="¿Tiene licencia de funcionamiento municipal vigente?"
          name="tiene_licencia_municipal"
          value={formData.tiene_licencia_municipal ?? false}
        />
      </div>
    </div>
  );
};
