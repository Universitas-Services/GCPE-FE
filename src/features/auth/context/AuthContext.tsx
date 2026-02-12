'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
// 1. Importamos la nueva lib
import { authService, LoginCredentials } from '../services/auth.service';
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
    // 2. Usamos la lib para leer datos limpios y seguros
    const token = authStorage.getAccessToken();
    const storedUser = authStorage.getUser(); // Ya viene parseado o null

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);

      // 3. Usamos la lib para guardar
      authStorage.setAccessToken(data.access);
      authStorage.setRefreshToken(data.refresh);

      if (data.user) {
        // Mapeamos el usuario de la respuesta al tipo User si es necesario
        // (Asegúrate de que los campos coincidan con tu interfaz User)
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

  const logout = () => {
    // 4. Limpieza centralizada a través de la lib
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
