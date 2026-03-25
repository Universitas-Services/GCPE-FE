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
      cache: 'no-store',
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

  // Update specific fields for onboarding/first login
  async updateProfilePartial(data: {
    nombre_institucion_ente: string;
    cargo: string;
  }): Promise<ProfileResponse> {
    const response = await fetch('/api/perfil', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre_institucion_ente: data.nombre_institucion_ente,
        cargo: data.cargo,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || 'No se pudo actualizar el perfil parcial'
      );
    }

    return response.json();
  },

  // Delete user account
  async deleteAccount(): Promise<void> {
    const response = await fetch('/api/auth/delete-account', {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (
        errorData.code === 'PROTECT' ||
        errorData.error === 'PROTECT' ||
        errorData.detail?.includes('PROTECT')
      ) {
        throw new Error('PROTECT');
      }
      throw new Error(
        errorData.error || errorData.detail || 'No se pudo eliminar la cuenta'
      );
    }
  },
};
