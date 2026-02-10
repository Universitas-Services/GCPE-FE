import { ManualFormData } from '../types';

import { authService } from '@/features/auth/services/auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createManual = async (data: ManualFormData): Promise<void> => {
  const token = authService.getToken();
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

  // Handle PDF download if the API returns a blob
  // Assuming the API returns a PDF blob for download
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
