import React from 'react';
import { useProviderForm } from '../context/ProviderFormContext';

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

  const handlePhoneOperatorChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const operator = e.target.value;
    updateFormData({ telefono_proveedor: operator + currentNumber });
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
  const currentRifLetter = 'J'; // Enforced to 'J' as requested
  const currentRifNumbers = rawRif.replace(/\D/g, ''); // Extract only the digits

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

  const handleCedulaLetterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const letter = e.target.value;
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
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-blue-900 mb-2">
          Datos de identificación del proveedor
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Ingresa los datos básicos para generar una demostración del manual de
          concurso abierto. Lo recibirás en tu correo en pocos minutos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Correo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico del proveedor
            </label>
            <input
              type="email"
              name="correo_proveedor"
              value={formData.correo_proveedor || ''}
              onChange={handleChange}
              placeholder="Ejemplo: prueba@gmail.com"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.correo_proveedor ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.correo_proveedor && (
              <p className="text-red-500 text-xs mt-1">
                {errors.correo_proveedor}
              </p>
            )}
          </div>

          {/* Dirección Fiscal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección fiscal (como se indica en el RIF)
            </label>
            <input
              type="text"
              name="direccion_fiscal"
              value={formData.direccion_fiscal || ''}
              onChange={handleChange}
              placeholder="Ej: Avenida 00, entre calles 00 y 00..."
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.direccion_fiscal ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.direccion_fiscal && (
              <p className="text-red-500 text-xs mt-1">
                {errors.direccion_fiscal}
              </p>
            )}
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la empresa o razón social
            </label>
            <input
              type="text"
              name="nombre_proveedor"
              value={formData.nombre_proveedor || ''}
              onChange={handleChange}
              placeholder="Ejemplo: Industrias Carabobo C.A"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nombre_proveedor ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.nombre_proveedor && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nombre_proveedor}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono de contacto
            </label>
            <div className="flex gap-2">
              <select
                value={
                  ['0412', '0422', '0414', '0424', '0416', '0426'].includes(
                    currentOperator
                  )
                    ? currentOperator
                    : ''
                }
                onChange={handlePhoneOperatorChange}
                className={`w-1/3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.telefono_proveedor ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="" disabled>
                  Cod
                </option>
                <option value="0412">0412</option>
                <option value="0422">0422</option>
                <option value="0414">0414</option>
                <option value="0424">0424</option>
                <option value="0416">0416</option>
                <option value="0426">0426</option>
              </select>
              <input
                type="text"
                value={currentNumber}
                onChange={handlePhoneNumberChange}
                placeholder="1234567"
                maxLength={7}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.telefono_proveedor ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {errors.telefono_proveedor && (
              <p className="text-red-500 text-xs mt-1">
                {errors.telefono_proveedor}
              </p>
            )}
          </div>

          {/* RIF */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registro de Información Fiscal (RIF)
            </label>
            <div className="flex gap-2">
              <select
                value={currentRifLetter}
                disabled
                className={`w-1/3 px-3 py-2 border rounded-md bg-gray-50 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.rif_proveedor ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="J">J</option>
              </select>
              <input
                type="text"
                value={currentRifNumbers}
                onChange={handleRifNumberChange}
                placeholder="123456789"
                maxLength={9}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.rif_proveedor ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {errors.rif_proveedor && (
              <p className="text-red-500 text-xs mt-1">
                {errors.rif_proveedor}
              </p>
            )}
          </div>

          {/* Nombre Rep Legal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Representante Legal
            </label>
            <input
              type="text"
              name="nombre_rep_legal"
              value={formData.nombre_rep_legal || ''}
              onChange={handleChange}
              placeholder="Ejemplo: José Ramiréz González Pérez"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nombre_rep_legal ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.nombre_rep_legal && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nombre_rep_legal}
              </p>
            )}
          </div>

          {/* Tipo Persona */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de persona
            </label>
            <select
              name="tipo_persona"
              value={formData.tipo_persona || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tipo_persona ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Selecciona</option>
              <option value="Natural">Persona Natural</option>
              <option value="Juridica">Persona Jurídica</option>
            </select>
            {errors.tipo_persona && (
              <p className="text-red-500 text-xs mt-1">{errors.tipo_persona}</p>
            )}
          </div>

          {/* Cédula Rep Legal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cédula del Representante Legal
            </label>
            <div className="flex gap-2">
              <select
                value={currentCedulaLetter}
                onChange={handleCedulaLetterChange}
                className={`w-1/3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cedula_rep_legal ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="V">V</option>
                <option value="E">E</option>
              </select>
              <input
                type="text"
                value={currentCedulaNumbers.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  '.'
                )} // Display formatted with dots
                onChange={handleCedulaNumberChange}
                placeholder="12.345.678"
                maxLength={10} // 8 digits + 2 dots
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cedula_rep_legal ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {errors.cedula_rep_legal && (
              <p className="text-red-500 text-xs mt-1">
                {errors.cedula_rep_legal}
              </p>
            )}
          </div>

          {/* Forma Jurídica */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Forma jurídica (Si aplica)
            </label>
            <select
              name="tipo_entidad_juridica"
              value={formData.tipo_entidad_juridica || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona</option>
              <option value="Compañía Anónima (C.A)">
                Compañía Anónima (C.A)
              </option>
              <option value="Asociación Civil">Asociación Civil</option>
              <option value="S.R.L.">
                Sociedades de Responsabilidad Limitada (S.R.L.)
              </option>
              <option value="Fundaciones">Fundaciones</option>
              <option value="Cooperativas">Cooperativas</option>
              <option value="Pymes">Pymes</option>
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.estado ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Selecciona</option>
              <option value="Lara">Lara</option>
              <option value="Carabobo">Carabobo</option>
              <option value="Zulia">Zulia</option>
              <option value="Distrito Capital">Distrito Capital</option>
              {/* Add more states as needed */}
            </select>
            {errors.estado && (
              <p className="text-red-500 text-xs mt-1">{errors.estado}</p>
            )}
          </div>

          {/* Municipio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Municipio
            </label>
            <select
              name="municipio"
              value={formData.municipio || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.municipio ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Selecciona</option>
              <option value="Iribarren">Iribarren</option>
              <option value="Palavecino">Palavecino</option>
              {/* Add more municipalities */}
            </select>
            {errors.municipio && (
              <p className="text-red-500 text-xs mt-1">{errors.municipio}</p>
            )}
          </div>

          {/* Parroquia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parroquia
            </label>
            <select
              name="parroquia"
              value={formData.parroquia || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.parroquia ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Selecciona</option>
              <option value="Concepción">Concepción</option>
              <option value="Catedral">Catedral</option>
              {/* Add more parishes */}
            </select>
            {errors.parroquia && (
              <p className="text-red-500 text-xs mt-1">{errors.parroquia}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
