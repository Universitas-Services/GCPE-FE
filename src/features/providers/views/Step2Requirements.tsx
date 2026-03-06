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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => handleBooleanChange(name, true)}
          className={`px-6 py-2 rounded-md border text-sm font-medium transition-colors ${
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
          className={`px-6 py-2 rounded-md border text-sm font-medium transition-colors ${
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
    <div className="bg-white p-8 md:p-10 rounded-lg shadow-sm h-full flex flex-col">
      <h2 className="text-xl font-bold text-blue-900 mb-2">
        Validación de requisitos
      </h2>
      <p className="text-sm text-gray-500 mb-8">
        Indica el estado de tus documentos legales.
      </p>

      <div className="flex-grow space-y-8">
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
