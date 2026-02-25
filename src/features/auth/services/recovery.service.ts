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
};
