import { ChangePasswordFormValues } from '../schemas/change-password.schema';

export const changePasswordService = {
  async changePassword(data: ChangePasswordFormValues): Promise<void> {
    const payload = {
      current_password: data.currentPassword,
      new_password: data.newPassword,
      confirm_password: data.confirmPassword,
    };

    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Intentamos extraer el mensaje de error específico
      if (errorData.detail) {
        throw new Error(errorData.detail);
      }

      const fieldErrors = Object.keys(errorData)
        .map((key) =>
          Array.isArray(errorData[key]) ? errorData[key][0] : errorData[key]
        )
        .filter(Boolean);

      if (fieldErrors.length > 0) {
        throw new Error(fieldErrors.join(', '));
      }

      throw new Error('No se pudo cambiar la contraseña');
    }
  },
};
