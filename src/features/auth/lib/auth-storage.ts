import { User } from '../context/AuthContext'; // O desde tu archivo de tipos si lo tienes centralizado

// Definimos las claves ("keys") como constantes para evitar errores de dedo
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
    if (isBrowser) localStorage.setItem(KEYS.ACCESS_TOKEN, token);
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
      // Si el JSON está corrupto, es mejor limpiar para evitar bugs
      localStorage.removeItem(KEYS.USER);
      return null;
    }
  },

  setUser: (user: User) => {
    if (isBrowser) {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
    }
  },

  // --- Limpieza Total (Logout) ---
  clearSession: () => {
    if (isBrowser) {
      localStorage.removeItem(KEYS.ACCESS_TOKEN);
      localStorage.removeItem(KEYS.REFRESH_TOKEN);
      localStorage.removeItem(KEYS.USER);
    }
  },
};
