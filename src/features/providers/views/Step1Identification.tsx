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
            <input
              type="text"
              name="telefono_proveedor"
              value={formData.telefono_proveedor || ''}
              onChange={handleChange}
              placeholder="Ejemplo: 0412-5555555"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.telefono_proveedor ? 'border-red-500' : 'border-gray-300'}`}
            />
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
            <input
              type="text"
              name="rif_proveedor"
              value={formData.rif_proveedor || ''}
              onChange={handleChange}
              placeholder="Ejemplo: J-00000000-0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.rif_proveedor ? 'border-red-500' : 'border-gray-300'}`}
            />
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
            <input
              type="text"
              name="cedula_rep_legal"
              value={formData.cedula_rep_legal || ''}
              onChange={handleChange}
              placeholder="Ejemplo: V-00.000.000"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cedula_rep_legal ? 'border-red-500' : 'border-gray-300'}`}
            />
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
