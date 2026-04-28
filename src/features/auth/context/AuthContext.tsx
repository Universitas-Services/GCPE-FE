'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
// 1. Importamos la nueva lib (ahora solo LoginCredentials)
import { type LoginCredentials } from '../services/auth.service';
import { authStorage } from '../lib/auth-storage';

// Exportamos User para poder usarlo en auth-storage.ts si lo necesitas,
// o mejor aún, muévelo a un archivo types.ts compartido.
export interface User {
  id: number;
  email: string;
  name?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar sesión al cargar
  useEffect(() => {
    // Ya no leemos el token directamente porque está en una cookie HttpOnly
    // Solo dependemos del usuario guardado para restaurar el estado inicial UI
    const storedUser = authStorage.getUser();

    if (storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);

      // Re-validar en background para mantener los permisos frescos y evitar manipulación
      fetch('/api/auth/me')
        .then((res) => {
          if (res.ok) {
            return res.json().then((meData) => {
              const updatedUser: User = {
                ...storedUser,
                is_staff: meData.is_staff,
                is_superuser: meData.is_superuser,
              };
              authStorage.setUser(updatedUser);
              setUser(updatedUser);
            });
          }
        })
        .catch((e) => console.error('Error re-validando sesión:', e));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      // 1. Llamamos a nuestro Route Handler de Next.js (el BFF)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Error al iniciar sesión');
      }

      // 2. Obtener el perfil completo del usuario desde /api/me
      //    Esto siempre devuelve id, email, name, is_staff, is_superuser
      const meRes = await fetch('/api/auth/me', { method: 'GET' });

      if (!meRes.ok) {
        throw new Error('No se pudo obtener el perfil del usuario');
      }

      const meData = await meRes.json();

      // 3. Construir el usuario a partir de /api/me (fuente de verdad)
      //    Usamos data.user como fallback para id/email/name si existe
      const userToStore: User = {
        id: meData.id ?? data.user?.id,
        email: meData.email ?? data.user?.email,
        name: meData.name ?? data.user?.name,
        is_staff: meData.is_staff ?? false,
        is_superuser: meData.is_superuser ?? false,
      };

      authStorage.setUser(userToStore);
      setUser(userToStore);
      setIsAuthenticated(true);
      setIsLoading(false);

      // 4. Redirección basada en los roles
      if (userToStore.is_staff && userToStore.is_superuser) {
        window.location.href = '/admin/dashboard';
      } else {
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Llamamos al endpoint de logout del BFF para limpiar cookies
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Error durante el logout:', e);
    }

    // Limpieza de UI
    authStorage.clearSession();
    setIsAuthenticated(false);
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
