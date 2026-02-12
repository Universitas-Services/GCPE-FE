import { ProviderFormData } from '../types/provider.types';
// ✅ CAMBIO: Importamos la libreta de almacenamiento
import { authStorage } from '@/features/auth/lib/auth-storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createProvider = async (
  data: ProviderFormData
): Promise<unknown> => {
  if (!API_URL) {
    throw new Error('API URL is not defined');
  }

  // ✅ CAMBIO: Usamos getAccessToken()
  const token = authStorage.getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Map form data to API payload
  const payload = {
    ...data,
    tipo_persona: data.tipo_persona === 'Natural' ? 'N' : 'J',
    // Ensure numeric values are sent as numbers
    anos_experiencia: Number(data.anos_experiencia),
  };

  const response = await fetch(`${API_URL}/api/proveedores`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error:', errorData);
    throw new Error(errorData.detail || 'Error al registrar el proveedor');
  }

  return response.json();
};

export const getProviders = async (): Promise<any[]> => {
  if (!API_URL) {
    throw new Error('API URL is not defined');
  }

  // ✅ CAMBIO: Usamos getAccessToken()
  const token = authStorage.getAccessToken();
  console.log('GetProviders Token:', token ? 'Present' : 'Missing');

  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api/proveedores?skip=0&limit=100`, {
    method: 'GET',
    headers: headers,
  });

  console.log(
    'GetProviders Response Status:',
    response.status,
    response.statusText
  );

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: response.statusText };
    }
    console.error('API Error:', errorData);
    throw new Error(errorData.detail || 'Error al obtener los proveedores');
  }

  return response.json();
};
