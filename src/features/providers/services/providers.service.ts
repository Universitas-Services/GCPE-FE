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

export const getProviders = async (params?: {
  q?: string;
  page?: number;
  page_size?: number;
}): Promise<any> => {
  const queryParams = new URLSearchParams();
  if (params?.q) queryParams.append('q', params.q);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size)
    queryParams.append('page_size', params.page_size.toString());

  const queryString = queryParams.toString();
  const url = `/api/proveedores${queryString ? `?${queryString}` : ''}`;
  const response = await fetchApi(url);

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
