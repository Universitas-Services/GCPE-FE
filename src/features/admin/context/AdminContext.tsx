'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, User } from '@/features/auth/context/AuthContext';
import { type LoginCredentials } from '@/features/auth/services/auth.service';
import { fetchApi } from '@/lib/api-client';

// Extendemos la interfaz User asumiendo que el backend envía información del rol o avatar
export interface AdminUser extends User {
  role?: string;
  avatar?: string;
}

export interface AdminContextType {
  user: AdminUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
    login,
    logout,
  } = useAuth();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Solo verificamos permisos si AuthContext ya terminó de cargar
    if (isAuthLoading) return;

    // Si no hay sesión activa, lo mandamos al login directamente
    if (!isAuthenticated) {
      router.replace('/login');
      setIsVerifying(false);
      return;
    }

    // Verificamos directamente contra el endpoint /api/auth/me
    // para no depender del estado del AuthContext
    const verifyAdmin = async () => {
      try {
        const res = await fetchApi('/api/auth/me', { method: 'GET' });

        if (!res.ok) {
          // Token inválido o expirado
          setIsAdmin(false);
          setIsVerifying(false);
          router.replace('/login');
          return;
        }

        const meData = await res.json();
        const hasAdminRole =
          meData.is_staff === true && meData.is_superuser === true;

        setIsAdmin(hasAdminRole);
        setIsVerifying(false);

        if (!hasAdminRole) {
          router.replace('/inicio');
        }
      } catch {
        console.error('Error verificando permisos de admin');
        setIsAdmin(false);
        setIsVerifying(false);
        router.replace('/login');
      }
    };

    verifyAdmin();
  }, [isAuthenticated, isAuthLoading, router]);

  const isLoading = isAuthLoading || isVerifying;

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0091be] border-t-transparent"></div>
          <p className="mt-4 text-sm font-medium text-gray-500">
            Verificando acceso administrativo...
          </p>
        </div>
      </div>
    );
  }

  // Si ya se verificó y no es admin, evitamos renderizar el contenido (el router ya lo está redirigiendo)
  if (!isAdmin) {
    return null;
  }

  return (
    <AdminContext.Provider
      value={{
        user: user as AdminUser | null,
        isAdmin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
