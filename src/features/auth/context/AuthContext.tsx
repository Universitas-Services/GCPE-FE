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
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      // Llamamos a nuestro Route Handler de Next.js (el BFF)
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

      if (data.user) {
        const userToStore: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        };
        authStorage.setUser(userToStore);
        setUser(userToStore);
      }

      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
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
    router.push('/login');
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
