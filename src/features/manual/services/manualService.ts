import { ManualFormData } from '../types';
// ✅ CAMBIO: Importamos la libreta de almacenamiento
import { authStorage } from '@/features/auth/lib/auth-storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createManual = async (data: ManualFormData): Promise<void> => {
  // ✅ CAMBIO: Usamos getAccessToken()
  const token = authStorage.getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api/manual/pdf`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al generar el manual');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'manual_express.pdf';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
