import React from 'react';
import { useProviderForm } from '../context/ProviderFormContext';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const Step1Identification: React.FC = () => {
  const { formData, updateFormData, errors } = useProviderForm();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  // Extract operator and phone number from formData
  const rawPhone = formData.telefono_proveedor || '';
  const currentOperator = rawPhone.substring(0, 4);
  const currentNumber = rawPhone.substring(4);

  const handlePhoneOperatorChange = (value: string) => {
    updateFormData({ telefono_proveedor: value + currentNumber });
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits and limit to 7 characters
    if (/^\d{0,7}$/.test(value)) {
      updateFormData({ telefono_proveedor: currentOperator + value });
    }
  };

  // Extract RIF letter and number
  const rawRif = formData.rif_proveedor || '';
  const currentRifLetter = rawRif.charAt(0) === 'V' ? 'V' : 'J'; // Default to J
  const currentRifNumbers = rawRif.replace(/\D/g, ''); // Extract only the digits

  const handleRifLetterChange = (letter: string) => {
    if (currentRifNumbers) {
      let formattedRif = `${letter}-`;
      if (currentRifNumbers.length <= 8) {
        formattedRif += currentRifNumbers;
      } else {
        formattedRif += `${currentRifNumbers.substring(0, 8)}-${currentRifNumbers.substring(8)}`;
      }
      updateFormData({ rif_proveedor: formattedRif });
    } else {
      updateFormData({ rif_proveedor: `${letter}-` });
    }
  };

  const handleRifNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Ensure only numbers
    if (rawValue.length <= 9) {
      if (rawValue.length === 0) {
        updateFormData({ rif_proveedor: '' });
      } else {
        // Format as J-XXXXXXXX-X
        let formattedRif = `${currentRifLetter}-`;
        if (rawValue.length <= 8) {
          formattedRif += rawValue;
        } else {
          formattedRif += `${rawValue.substring(0, 8)}-${rawValue.substring(8)}`;
        }
        updateFormData({ rif_proveedor: formattedRif });
      }
    }
  };

  // Extract Cedula letter and number
  const rawCedula = formData.cedula_rep_legal || '';
  const currentCedulaLetter = rawCedula.charAt(0) === 'E' ? 'E' : 'V'; // Default to V
  const currentCedulaNumbers = rawCedula.replace(/\D/g, ''); // Extract only the digits

  const handleCedulaLetterChange = (letter: string) => {
    if (currentCedulaNumbers) {
      // Re-apply formatting with the new letter
      const formattedNumber = currentCedulaNumbers.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        '.'
      );
      updateFormData({ cedula_rep_legal: `${letter}-${formattedNumber}` });
    } else {
      updateFormData({ cedula_rep_legal: `${letter}-` });
    }
  };

  const handleCedulaNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Ensure only numbers
    if (rawValue.length <= 8) {
      if (rawValue.length === 0) {
        updateFormData({ cedula_rep_legal: '' }); // Clear field
      } else {
        // Format with dots, e.g., 12345678 -> 12.345.678
        const formattedNumber = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        updateFormData({
          cedula_rep_legal: `${currentCedulaLetter}-${formattedNumber}`,
        });
      }
    }
  };

  return (
    <div className="flex flex-col pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        {/* Correo */}
        <div>
          <label className="block form-label-titulos mb-1">
            Correo electrónico del proveedor
          </label>
          <p className="form-label-ejemplo mb-2 mt-1">
            Ejemplo: prueba@gmail.com
          </p>
          <Input
            type="email"
            name="correo_proveedor"
            value={formData.correo_proveedor || ''}
            onChange={handleChange}
            className={`h-10 ${errors.correo_proveedor ? 'border-red-500' : ''}`}
          />
          {errors.correo_proveedor && (
            <p className="text-red-500 text-sm mt-1">
              {errors.correo_proveedor}
            </p>
          )}
        </div>

        {/* Dirección Fiscal */}
        <div>
          <label className="block form-label-titulos mb-1">
            Dirección fiscal (como se indica en el RIF)
          </label>
          <p className="form-label-ejemplo mb-2 mt-1">
            Ejemplo: Avenida 00, entre calles 00 y 00, Centro Comercial Central,
            Piso 2, Local 3
          </p>
          <Input
            type="text"
            name="direccion_fiscal"
            value={formData.direccion_fiscal || ''}
            onChange={handleChange}
            className={`h-10 ${errors.direccion_fiscal ? 'border-red-500' : ''}`}
          />
          {errors.direccion_fiscal && (
            <p className="text-red-500 text-sm mt-1">
              {errors.direccion_fiscal}
            </p>
          )}
        </div>

        {/* Nombre */}
        <div>
          <label className="block form-label-titulos mb-1">
            Nombre de la empresa o razón social
          </label>
          <p className="form-label-ejemplo mb-2 mt-1">
            Ejemplo: Industrias Carabobo C.A
          </p>
          <Input
            type="text"
            name="nombre_proveedor"
            value={formData.nombre_proveedor || ''}
            onChange={handleChange}
            className={`h-10 ${errors.nombre_proveedor ? 'border-red-500' : ''}`}
          />
          {errors.nombre_proveedor && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nombre_proveedor}
            </p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block form-label-titulos mb-1">
            Teléfono de contacto
          </label>
          <p className="form-label-ejemplo mb-2 mt-1">Ejemplo: 1234567</p>
          <div className="flex gap-2">
            <Select
              value={
                ['0412', '0422', '0414', '0424', '0416', '0426'].includes(
                  currentOperator
                )
                  ? currentOperator
                  : undefined
              }
              onValueChange={handlePhoneOperatorChange}
            >
              <SelectTrigger
                className={`w-24 h-10 ${errors.telefono_proveedor ? 'border-red-500' : ''}`}
              >
                <SelectValue placeholder="Cod" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="min-w-0 w-[var(--radix-select-trigger-width)]"
              >
                <SelectItem value="0412">0412</SelectItem>
                <SelectItem value="0422">0422</SelectItem>
                <SelectItem value="0414">0414</SelectItem>
                <SelectItem value="0424">0424</SelectItem>
                <SelectItem value="0416">0416</SelectItem>
                <SelectItem value="0426">0426</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={currentNumber}
              onChange={handlePhoneNumberChange}
              maxLength={7}
              className={`h-10 ${errors.telefono_proveedor ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.telefono_proveedor && (
            <p className="text-red-500 text-sm mt-1">
              {errors.telefono_proveedor}
            </p>
          )}
        </div>

        {/* RIF */}
        <div>
          <label className="block form-label-titulos mb-1">
            Registro de Información Fiscal (RIF)
          </label>
          <p className="form-label-ejemplo mb-2 mt-1">Ejemplo: 123456789</p>
          <div className="flex gap-2">
            <Select
              value={currentRifLetter}
              onValueChange={handleRifLetterChange}
            >
              <SelectTrigger
                className={`w-20 h-10 ${errors.rif_proveedor ? 'border-red-500' : ''}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="min-w-0 w-[var(--radix-select-trigger-width)]"
              >
                <SelectItem value="J">J</SelectItem>
                <SelectItem value="V">V</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={currentRifNumbers}
              onChange={handleRifNumberChange}
              maxLength={9}
              className={`h-10 ${errors.rif_proveedor ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.rif_proveedor && (
            <p className="text-red-500 text-sm mt-1">{errors.rif_proveedor}</p>
          )}
        </div>

        {/* Nombre Rep Legal */}
        <div>
          <label className="block form-label-titulos mb-1">
            Nombre del Representante Legal
          </label>
          <p className="form-label-ejemplo mb-2 mt-1">
            Ejemplo: José Ramiréz González Pérez
          </p>
          <Input
            type="text"
            name="nombre_rep_legal"
            value={formData.nombre_rep_legal || ''}
            onChange={handleChange}
            className={`h-10 ${errors.nombre_rep_legal ? 'border-red-500' : ''}`}
          />
          {errors.nombre_rep_legal && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nombre_rep_legal}
            </p>
          )}
        </div>

        {/* Tipo Persona */}
        <div>
          <label className="block form-label-titulos mb-1">
            Tipo de persona
          </label>
          <Select
            value={formData.tipo_persona || undefined}
            onValueChange={(value) => {
              const newValue = value as 'Natural' | 'Juridica';
              updateFormData({
                tipo_persona: newValue,
                tipo_entidad_juridica:
                  newValue === 'Natural'
                    ? undefined
                    : formData.tipo_entidad_juridica,
              });
            }}
          >
            <SelectTrigger
              className={`w-full h-10 ${errors.tipo_persona ? 'border-red-500' : ''}`}
            >
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Natural">Persona Natural</SelectItem>
              <SelectItem value="Juridica">Persona Jurídica</SelectItem>
            </SelectContent>
          </Select>
          {errors.tipo_persona && (
            <p className="text-red-500 text-sm mt-1">{errors.tipo_persona}</p>
          )}
        </div>

        {/* Cédula Rep Legal */}
        <div>
          <label className="block form-label-titulos mb-1">
            Cédula del Representante Legal
          </label>
          <p className="form-label-ejemplo mb-2 mt-1">Ejemplo: 12.345.678</p>
          <div className="flex gap-2">
            <Select
              value={currentCedulaLetter}
              onValueChange={handleCedulaLetterChange}
            >
              <SelectTrigger
                className={`w-20 h-10 ${errors.cedula_rep_legal ? 'border-red-500' : ''}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="min-w-0 w-[var(--radix-select-trigger-width)]"
              >
                <SelectItem value="V">V</SelectItem>
                <SelectItem value="E">E</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={currentCedulaNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              onChange={handleCedulaNumberChange}
              maxLength={10}
              className={`h-10 ${errors.cedula_rep_legal ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.cedula_rep_legal && (
            <p className="text-red-500 text-sm mt-1">
              {errors.cedula_rep_legal}
            </p>
          )}
        </div>

        {/* Forma Jurídica - Solo visible para Persona Jurídica */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            formData.tipo_persona === 'Juridica'
              ? 'opacity-100 max-h-[200px] mt-0'
              : 'opacity-0 max-h-0 mt-0'
          }`}
        >
          <label className="block form-label-titulos mb-1">
            Forma jurídica
          </label>
          <Select
            value={formData.tipo_entidad_juridica || undefined}
            onValueChange={(value) =>
              updateFormData({ tipo_entidad_juridica: value })
            }
          >
            <SelectTrigger className="w-full h-10">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Compañía Anónima (C.A)">
                Compañía Anónima (C.A)
              </SelectItem>
              <SelectItem value="Asociación Civil">Asociación Civil</SelectItem>
              <SelectItem value="S.R.L.">
                Sociedades de Responsabilidad Limitada (S.R.L.)
              </SelectItem>
              <SelectItem value="Fundaciones">Fundaciones</SelectItem>
              <SelectItem value="Cooperativas">Cooperativas</SelectItem>
              <SelectItem value="Pymes">Pymes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Estado */}
        <div>
          <label className="block form-label-titulos mb-1">Estado</label>
          <Select
            value={formData.estado || undefined}
            onValueChange={(value) => updateFormData({ estado: value })}
          >
            <SelectTrigger
              className={`w-full h-10 ${errors.estado ? 'border-red-500' : ''}`}
            >
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lara">Lara</SelectItem>
              <SelectItem value="Carabobo">Carabobo</SelectItem>
              <SelectItem value="Zulia">Zulia</SelectItem>
              <SelectItem value="Distrito Capital">Distrito Capital</SelectItem>
            </SelectContent>
          </Select>
          {errors.estado && (
            <p className="text-red-500 text-sm mt-1">{errors.estado}</p>
          )}
        </div>

        {/* Municipio */}
        <div>
          <label className="block form-label-titulos mb-1">Municipio</label>
          <Select
            value={formData.municipio || undefined}
            onValueChange={(value) => updateFormData({ municipio: value })}
          >
            <SelectTrigger
              className={`w-full h-10 ${errors.municipio ? 'border-red-500' : ''}`}
            >
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Iribarren">Iribarren</SelectItem>
              <SelectItem value="Palavecino">Palavecino</SelectItem>
            </SelectContent>
          </Select>
          {errors.municipio && (
            <p className="text-red-500 text-sm mt-1">{errors.municipio}</p>
          )}
        </div>

        {/* Parroquia */}
        <div>
          <label className="block form-label-titulos mb-1">Parroquia</label>
          <Select
            value={formData.parroquia || undefined}
            onValueChange={(value) => updateFormData({ parroquia: value })}
          >
            <SelectTrigger
              className={`w-full h-10 ${errors.parroquia ? 'border-red-500' : ''}`}
            >
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Concepción">Concepción</SelectItem>
              <SelectItem value="Catedral">Catedral</SelectItem>
            </SelectContent>
          </Select>
          {errors.parroquia && (
            <p className="text-red-500 text-sm mt-1">{errors.parroquia}</p>
          )}
        </div>
      </div>
    </div>
  );
};
