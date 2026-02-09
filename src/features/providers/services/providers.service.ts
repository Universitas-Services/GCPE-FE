import { ProviderFormData } from '../types/provider.types';
import { authService } from '@/features/auth/services/auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createProvider = async (
  data: ProviderFormData
): Promise<unknown> => {
  if (!API_URL) {
    throw new Error('API URL is not defined');
  }

  const token = authService.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Matching the pattern in compliance.service.ts: ${API_URL}/api/...
  // Assuming the backend endpoint is /api/proveedores at the external API.
  // Map form data to API payload
  const payload = {
    ...data,
    tipo_persona: data.tipo_persona === 'Natural' ? 'N' : 'J',
    // Ensure numeric values are sent as numbers (though zod handles this in form, good to be safe)
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
