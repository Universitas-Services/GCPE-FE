import React from 'react';
import { useProviderForm } from '../context/ProviderFormContext';

export const Step4Completion: React.FC = () => {
  const { formData, updateFormData } = useProviderForm();

  const handleBooleanChange = (value: boolean) => {
    updateFormData({ desea_version_pro_proveedores: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-blue-900 mb-6">
        Finalizar registro
      </h2>

      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-800 mb-4">
          ¿Deseas adquirir el servicio de registro de proveedores completo que
          incluye emisión de certificado de registro personalizado?
        </label>
        <div className="flex space-x-4">
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

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold text-blue-800 mb-2">
          ¡Has completado el 60% del registro con éxito!
        </h3>
        <p className="text-gray-600">
          Para ver el listado completo de tus proveedores registrados, puedes
          hacer clic en ver proveedores.
        </p>
      </div>
    </div>
  );
};
