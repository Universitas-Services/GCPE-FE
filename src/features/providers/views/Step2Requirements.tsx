import React from 'react';
import { useProviderForm } from '../context/ProviderFormContext';

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
      <label className="block text-base font-medium text-gray-800 mb-4">
        {label}
      </label>
      <div className="flex space-x-6">
        <button
          type="button"
          onClick={() => handleBooleanChange(name, true)}
          className={`px-8 py-3 rounded-md border text-base font-medium transition-colors ${
            value === true
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          SI
        </button>
        <button
          type="button"
          onClick={() => handleBooleanChange(name, false)}
          className={`px-8 py-3 rounded-md border text-base font-medium transition-colors ${
            value === false
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          NO
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full flex-grow">
      <div className="flex-grow flex flex-col justify-center space-y-12 max-w-2xl mx-auto w-full">
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
