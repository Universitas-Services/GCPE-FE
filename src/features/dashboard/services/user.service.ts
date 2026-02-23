import { fetchApi } from '@/lib/api-client';

export interface UserProfileResponse {
  username: string;
  email: string;
}

export const userService = {
  /**
   * Obtiene la información del perfil del usuario logueado
   */
  async getProfile(): Promise<UserProfileResponse> {
    const response = await fetchApi('/api/me');

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error al obtener perfil de usuario:', errorData);
      throw new Error(
        errorData.detail || 'No se pudo obtener la información del usuario'
      );
    }

    return response.json();
  },
};
