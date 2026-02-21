import { User } from '../context/AuthContext';

// Claves de localStorage (centralizadas para evitar errores de escritura)
const KEYS = {
  USER: 'user',
};

// Verificación de entorno (seguridad para Next.js SSR)
const isBrowser = typeof window !== 'undefined';

export const authStorage = {
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

  // --- Limpieza Parcial (Logout Client-side) ---
  clearSession: () => {
    if (isBrowser) {
      localStorage.removeItem(KEYS.USER);
    }
  },
};
