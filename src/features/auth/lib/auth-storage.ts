import { User } from '../context/AuthContext';
import { authCookies } from './auth-cookies';

// Claves de localStorage (centralizadas para evitar errores de escritura)
const KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
};

// Verificación de entorno (seguridad para Next.js SSR)
const isBrowser = typeof window !== 'undefined';

export const authStorage = {
  // --- Token de Acceso ---
  getAccessToken: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(KEYS.ACCESS_TOKEN);
  },

  setAccessToken: (token: string) => {
    if (isBrowser) {
      // Guardar en LocalStorage (para llamadas API desde el cliente)
      localStorage.setItem(KEYS.ACCESS_TOKEN, token);
    }
  },

  // --- Token de Refresco ---
  getRefreshToken: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(KEYS.REFRESH_TOKEN);
  },

  setRefreshToken: (token: string) => {
    if (isBrowser) localStorage.setItem(KEYS.REFRESH_TOKEN, token);
  },

  // --- Datos del Usuario ---
  getUser: (): User | null => {
    if (!isBrowser) return null;
    const data = localStorage.getItem(KEYS.USER);
    if (!data) return null;

    try {
      return JSON.parse(data) as User;
    } catch (error) {
      console.error(
        'Error al leer datos del usuario del almacenamiento local:',
        error
      );
      localStorage.removeItem(KEYS.USER);
      return null;
    }
  },

  setUser: (user: User) => {
    if (isBrowser) {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
    }
  },

  /**
   * Guarda ambos tokens en localStorage y sincroniza cookies.
   * Usar este método en lugar de llamar setAccessToken + setRefreshToken por separado
   * cuando se tienen ambos tokens disponibles (ej. después del login).
   */
  setTokens: (accessToken: string, refreshToken: string) => {
    if (isBrowser) {
      localStorage.setItem(KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(KEYS.REFRESH_TOKEN, refreshToken);
      // Sincronizar cookies para Proxy (Capa 1) y ServerAuthGuard (Capa 2)
      authCookies.setAuthCookies(accessToken, refreshToken);
    }
  },

  // --- Limpieza Total (Logout) ---
  clearSession: () => {
    if (isBrowser) {
      localStorage.removeItem(KEYS.ACCESS_TOKEN);
      localStorage.removeItem(KEYS.REFRESH_TOKEN);
      localStorage.removeItem(KEYS.USER);

      // Eliminar cookies delegando a authCookies
      authCookies.clearAuthCookies();
    }
  },
};
