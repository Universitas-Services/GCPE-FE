import React from 'react';
import { useProviderForm } from '../context/ProviderFormContext';

export const Step3Capacity: React.FC = () => {
  const { formData, updateFormData, errors } = useProviderForm();

  const handleBooleanChange = (name: string, value: boolean) => {
    updateFormData({ [name]: value });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Handle number inputs
    if (name === 'anos_experiencia') {
      updateFormData({ [name]: parseInt(value) || 0 });
      return;
    }
    updateFormData({ [name]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-blue-900 mb-2">
        Capacidad técnica y financiera
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Información sobre la experiencia y solidez financiera de la empresa.
      </p>

      {/* Actividad Comercial Principal */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Actividad comercial principal
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Ejemplo: El objeto principal es la prestación de servicios de
          consultoría...
        </p>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() =>
              handleBooleanChange('actividad_comercial_principal', true)
            }
            className={`px-6 py-2 rounded-md border text-sm font-medium transition-colors ${
              formData.actividad_comercial_principal === true
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            SI
          </button>
          <button
            type="button"
            onClick={() =>
              handleBooleanChange('actividad_comercial_principal', false)
            }
            className={`px-6 py-2 rounded-md border text-sm font-medium transition-colors ${
              formData.actividad_comercial_principal === false
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            NO
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Área de especialidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Área de especialidad
          </label>
          <div className="flex space-x-2">
            {['Bienes', 'Obras', 'Servicio'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateFormData({ area_especialidad: type })}
                className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                  formData.area_especialidad === type
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {errors.area_especialidad && (
            <p className="text-red-500 text-xs mt-1">
              {errors.area_especialidad}
            </p>
          )}
        </div>

        {/* Nivel de contratación - Moved up to align grid if needed, or stick to order. Stick to order logic roughly but filling grid. */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nivel de contratación
          </label>
          <div className="flex space-x-2">
            {['ALTA', 'MEDIA', 'BAJA'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => updateFormData({ nivel_contratacion: level })}
                className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                  formData.nivel_contratacion === level
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          {errors.nivel_contratacion && (
            <p className="text-red-500 text-xs mt-1">
              {errors.nivel_contratacion}
            </p>
          )}
        </div>

        {/* Años de experiencia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Años de experiencia comprobable
          </label>
          <input
            type="number"
            min="0"
            name="anos_experiencia"
            value={formData.anos_experiencia || 0}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.anos_experiencia ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.anos_experiencia && (
            <p className="text-red-500 text-xs mt-1">
              {errors.anos_experiencia}
            </p>
          )}
        </div>

        {/* Fecha último estado financiero */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha del último estado financiero
          </label>
          <input
            type="date"
            name="fecha_estado_financiero"
            value={formData.fecha_estado_financiero || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fecha_estado_financiero ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.fecha_estado_financiero && (
            <p className="text-red-500 text-xs mt-1">
              {errors.fecha_estado_financiero}
            </p>
          )}
        </div>

        {/* Patrimonio Neto Reportado */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patrimonio neto reportado
          </label>
          <input
            type="text"
            name="patrimonio_reportado"
            value={formData.patrimonio_reportado || ''}
            onChange={handleChange}
            placeholder="0.00"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.patrimonio_reportado ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.patrimonio_reportado && (
            <p className="text-red-500 text-xs mt-1">
              {errors.patrimonio_reportado}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
