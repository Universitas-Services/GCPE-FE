import React from 'react';
import { useProviderForm } from '../context/ProviderFormContext';
import { Button } from '@/components/ui/button';

export const Step4Completion: React.FC = () => {
  const { formData, updateFormData } = useProviderForm();

  const handleBooleanChange = (value: boolean) => {
    updateFormData({ desea_version_pro_proveedores: value });
  };

  return (
    <div className="flex flex-col h-full flex-grow">
      <div className="flex-grow flex flex-col space-y-12 mb-8">
        <div>
          <label className="block text-[14px] font-medium text-[#0b1e4c] leading-4 mb-6">
            ¿Deseas adquirir el servicio de registro de proveedores completo que
            incluye emisión de certificado de registro personalizado?
          </label>
          <div className="flex space-x-6">
            <Button
              type="button"
              variant={
                formData.desea_version_pro_proveedores === true
                  ? 'default'
                  : 'outline'
              }
              onClick={() => handleBooleanChange(true)}
              className="px-8 py-3 text-[11px] font-medium"
              size="lg"
            >
              Sí
            </Button>
            <Button
              type="button"
              variant={
                formData.desea_version_pro_proveedores === false
                  ? 'default'
                  : 'outline'
              }
              onClick={() => handleBooleanChange(false)}
              className="px-8 py-3 text-[11px] font-medium"
              size="lg"
            >
              No
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
