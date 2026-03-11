import React from 'react';
import { useProviderForm } from '../context/ProviderFormContext';
import { SharedDatePicker } from '@/components/shared/SharedDatePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
      const numericValue = value.replace(/\D/g, '');
      updateFormData({
        [name]: numericValue === '' ? undefined : parseInt(numericValue, 10),
      });
      return;
    }
    if (name === 'patrimonio_reportado') {
      const filteredValue = value.replace(/[^0-9.,]/g, '');
      updateFormData({ [name]: filteredValue });
      return;
    }
    updateFormData({ [name]: value });
  };

  return (
    <div className="flex flex-col h-full flex-grow">
      <div className="flex-grow flex flex-col space-y-8">
        {/* Actividad Comercial Principal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Actividad comercial principal
          </label>
          <p className="text-xs text-gray-500 mb-2 italic">
            Ejemplo: El objeto principal es la prestación de servicios de
            consultoría...
          </p>
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                handleBooleanChange('actividad_comercial_principal', true)
              }
              className={`px-6 py-2 text-sm font-medium ${
                formData.actividad_comercial_principal === true
                  ? 'btn-option-selected'
                  : 'btn-option-unselected'
              }`}
            >
              SI
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                handleBooleanChange('actividad_comercial_principal', false)
              }
              className={`px-6 py-2 text-sm font-medium ${
                formData.actividad_comercial_principal === false
                  ? 'btn-option-selected'
                  : 'btn-option-unselected'
              }`}
            >
              NO
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Área de especialidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área de especialidad
            </label>
            <div className="flex space-x-2">
              {['Bienes', 'Obras', 'Servicio'].map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant="outline"
                  onClick={() => updateFormData({ area_especialidad: type })}
                  className={`px-4 py-2 text-sm font-medium ${
                    formData.area_especialidad === type
                      ? 'btn-option-selected'
                      : 'btn-option-unselected'
                  }`}
                >
                  {type}
                </Button>
              ))}
            </div>
            {errors.area_especialidad && (
              <p className="text-red-500 text-xs mt-1">
                {errors.area_especialidad}
              </p>
            )}
          </div>

          {/* Nivel de contratación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de contratación
            </label>
            <div className="flex space-x-2">
              {['ALTA', 'MEDIA', 'BAJA'].map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant="outline"
                  onClick={() => updateFormData({ nivel_contratacion: level })}
                  className={`px-4 py-2 text-sm font-medium ${
                    formData.nivel_contratacion === level
                      ? 'btn-option-selected'
                      : 'btn-option-unselected'
                  }`}
                >
                  {level}
                </Button>
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
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="anos_experiencia"
              value={formData.anos_experiencia ?? ''}
              onChange={handleChange}
              className={`h-10 ${errors.anos_experiencia ? 'border-red-500' : ''}`}
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
            <SharedDatePicker
              name="fecha_estado_financiero"
              value={formData.fecha_estado_financiero || ''}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              error={Boolean(errors.fecha_estado_financiero)}
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
            <p className="text-xs text-gray-500 mb-2 italic">Ejemplo: 0.00</p>
            <Input
              type="text"
              name="patrimonio_reportado"
              value={formData.patrimonio_reportado || ''}
              onChange={handleChange}
              className={`h-10 ${errors.patrimonio_reportado ? 'border-red-500' : ''}`}
            />
            {errors.patrimonio_reportado && (
              <p className="text-red-500 text-xs mt-1">
                {errors.patrimonio_reportado}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
