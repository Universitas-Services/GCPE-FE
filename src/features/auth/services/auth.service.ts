// Interfaz para las credenciales (Username + Password)
export interface LoginCredentials {
  username: string; // Ojo: en tu Context usas 'credentials', asegúrate que los campos coincidan
  password: string;
}

// Interfaz de respuesta
export interface AuthResponse {
  access: string;
  refresh: string;
  user?: {
    id: number;
    email: string;
    name?: string; // Lo puse opcional para coincidir con tu interfaz de User
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  // Solo lógica de API pura
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/token/pair`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error del backend:', errorData);

      if (errorData.detail) {
        throw new Error(errorData.detail);
      }

      // Manejo de errores de campos
      const fieldErrors = Object.keys(errorData)
        .map(
          (key) =>
            `${key}: ${Array.isArray(errorData[key]) ? errorData[key][0] : errorData[key]}`
        )
        .join(', ');

      if (fieldErrors) {
        throw new Error(fieldErrors);
      }

      throw new Error(`Error ${response.status}: No se pudo iniciar sesión`);
    }

    return response.json();
  },
};
