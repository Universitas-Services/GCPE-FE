import React from 'react';
import { useProviderForm } from '../context/ProviderFormContext';

export const Step4Completion: React.FC = () => {
  const { formData, updateFormData } = useProviderForm();

  const handleBooleanChange = (value: boolean) => {
    updateFormData({ desea_version_pro_proveedores: value });
  };

  return (
    <div className="flex flex-col h-full flex-grow">
      <div className="flex-grow flex flex-col space-y-12 mb-8">
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-6">
            ¿Deseas adquirir el servicio de registro de proveedores completo que
            incluye emisión de certificado de registro personalizado?
          </label>
          <div className="flex space-x-6">
            <button
              type="button"
              onClick={() => handleBooleanChange(true)}
              className={`px-8 py-3 rounded-md border text-base font-medium transition-colors ${
                formData.desea_version_pro_proveedores === true
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Sí
            </button>
            <button
              type="button"
              onClick={() => handleBooleanChange(false)}
              className={`px-8 py-3 rounded-md border text-base font-medium transition-colors ${
                formData.desea_version_pro_proveedores === false
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              No
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-8 text-center mt-auto">
          <h3 className="text-xl font-bold text-blue-800 mb-4">
            ¡Has completado el 60% del registro con éxito!
          </h3>
          <p className="text-gray-600 text-base">
            Para ver el listado completo de tus proveedores registrados, puedes
            hacer clic en ver proveedores.
          </p>
        </div>
      </div>
    </div>
  );
};
