// Interfaz para las credenciales (Username + Password)
export interface LoginCredentials {
  username: string;
  password: string;
}

// Interfaz de respuesta (Access + Refresh)
export interface AuthResponse {
  access: string;
  refresh: string;
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
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

      // 1. Manejo de error específico 'detail' (ej. Credenciales inválidas)
      if (errorData.detail) {
        throw new Error(errorData.detail);
      }

      // 2. Manejo de errores de validación por campo (ej. campo requerido)
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

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  },
};
