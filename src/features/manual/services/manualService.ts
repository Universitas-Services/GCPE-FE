import { ManualFormData } from '../types';
import { fetchApi } from '@/lib/api-client';

export const createManual = async (data: ManualFormData): Promise<void> => {
  const response = await fetchApi('/api/manual/pdf', {
    method: 'POST',
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
