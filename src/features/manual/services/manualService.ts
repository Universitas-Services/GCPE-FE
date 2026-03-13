import { ManualFormData } from '../types';
import { fetchApi } from '@/lib/api-client';

export const createManual = async (data: ManualFormData): Promise<void> => {
  const response = await fetchApi('/api/manual/enviar-email', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al enviar el manual por correo electrónico');
  }
};
