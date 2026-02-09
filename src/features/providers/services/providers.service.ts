import { ProviderFormData } from '../types/provider.types';

const API_URL = '/api/proveedores';

export const createProvider = async (
  data: ProviderFormData
): Promise<unknown> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al registrar el proveedor');
  }

  return response.json();
};
