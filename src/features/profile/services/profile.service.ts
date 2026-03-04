import { EditProfileFormValues } from '../schemas/edit-profile.schema';

export interface ProfileResponse {
  email: string;
  first_name: string;
  last_name: string;
  telefono: string;
  nombre_institucion_ente: string;
  cargo: string;
}

export const profileService = {
  // Get user profile data
  async getProfile(): Promise<ProfileResponse> {
    const response = await fetch('/api/profile', {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'No se pudo obtener el perfil');
    }

    return response.json();
  },

  // Update user profile data
  async updateProfile(data: EditProfileFormValues): Promise<ProfileResponse> {
    const payload = {
      first_name: data.firstName,
      last_name: data.lastName,
      telefono: data.phone,
      nombre_institucion_ente: data.institution,
      cargo: data.role,
    };

    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'No se pudo actualizar el perfil');
    }

    return response.json();
  },
};
