// Interfaz para las credenciales (Username + Password)
export interface LoginCredentials {
  username: string;
  password: string;
}

// Interfaz de respuesta de login
export interface AuthResponse {
  access: string;
  refresh: string;
  user?: {
    id: number;
    email: string;
    name?: string;
  };
}

// Interfaz de respuesta de refresh
export interface RefreshResponse {
  access: string;
  refresh?: string; // SimpleJWT puede o no devolver un nuevo refresh token
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  // --- Login ---
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

  // --- Refresh Token ---
  async refreshToken(refresh_token: string): Promise<RefreshResponse> {
    const response = await fetch(`${API_URL}/api/token/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // SimpleJWT espera { refresh: "<token>" } en el body
      body: JSON.stringify({ refresh: refresh_token }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudo renovar el token`);
    }

    return response.json();
  },
};
