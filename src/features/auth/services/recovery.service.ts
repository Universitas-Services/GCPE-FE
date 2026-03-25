import { fetchApi } from '@/lib/api-client';

export const recoveryService = {
  /**
   * Envía una solicitud de restablecimiento de contraseña al servidor
   * @param email Correo electrónico del usuario
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    const response = await fetchApi('/api/auth/password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(
        'Error al solicitar restablecimiento de contraseña:',
        errorData
      );

      // Lanzar un error estructurado para que EmailStep lo pueda mostrar en SweetAlert
      throw new Error(
        errorData.detail || 'El correo no existe en la base de datos'
      );
    }
  },

  /**
   * Verifica el código de restablecimiento de contraseña
   * @param email Correo electrónico del usuario
   * @param codigo Código de verificación recibido
   * @returns El token de recuperación proporcionado por el backend
   */
  async verifyResetCode(email: string, codigo: string): Promise<string> {
    const response = await fetchApi('/api/auth/verify-reset-code', {
      method: 'POST',
      body: JSON.stringify({ email, codigo }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error al verificar código:', errorData);

      throw new Error(errorData.detail || 'El código ingresado no es válido');
    }

    const data = await response.json();
    return data.reset_token;
  },

  /**
   * Cambia la contraseña por una nueva usando el token de recuperación
   * @param reset_token Token de recuperación
   * @param new_password Nueva contraseña
   * @param confirm_password Confirmación de contraseña
   */
  async resetPassword(
    reset_token: string,
    new_password: string,
    confirm_password: string
  ): Promise<void> {
    const response = await fetchApi('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ reset_token, new_password, confirm_password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error al cambiar contraseña:', errorData);

      throw new Error(
        errorData.detail || 'Ocurrió un error al intentar cambiar la contraseña'
      );
    }
  },
};
