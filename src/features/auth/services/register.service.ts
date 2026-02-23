export interface RegisterCredentials {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  telefono: string;
}

export interface RegisterResponse {
  // Ajustar la interfaz dependiendo de la estructura real que retorna el backend
  message?: string;
  user?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  [key: string]: unknown;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerService = {
  /**
   * Envía los datos de registro al backend.
   * @param data Los datos rellenados del formulario de registro
   * @returns La respuesta del servidor
   */
  async register(data: RegisterCredentials): Promise<RegisterResponse> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error del backend en registro:', errorData);

      if (errorData.detail) {
        throw new Error(errorData.detail);
      }

      // Manejo estandar de errores de validación de campos
      const fieldErrors = Object.keys(errorData)
        .map((key) => {
          const value = errorData[key];
          return `${key}: ${Array.isArray(value) ? value[0] : value}`;
        })
        .join(', ');

      if (fieldErrors) {
        throw new Error(fieldErrors);
      }

      throw new Error(
        `Error ${response.status}: No se pudo completar el registro`
      );
    }

    return response.json();
  },
};
