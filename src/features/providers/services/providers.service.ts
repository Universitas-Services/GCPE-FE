import { ProviderFormData } from '../types/provider.types';
import { fetchApi } from '@/lib/api-client';

export const createProvider = async (
  data: ProviderFormData
): Promise<unknown> => {
  // Map form data to API payload
  const payload = {
    ...data,
    tipo_persona: data.tipo_persona === 'Natural' ? 'N' : 'J',
    anos_experiencia: Number(data.anos_experiencia),
  };

  const response = await fetchApi('/api/proveedores', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error:', errorData);
    throw errorData;
  }

  return response.json();
};

export const getProviders = async (): Promise<any[]> => {
  const response = await fetchApi('/api/proveedores?skip=0&limit=100');

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: 'Error desconocido' };
    }
    console.error('API Error:', errorData);
    throw new Error(errorData.detail || 'Error al obtener los proveedores');
  }

  return response.json();
};
