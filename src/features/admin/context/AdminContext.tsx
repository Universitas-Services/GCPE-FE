'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, User } from '@/features/auth/context/AuthContext';
import { type LoginCredentials } from '@/features/auth/services/auth.service';

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
    if (!isAuthLoading) {
      if (isAuthenticated && user) {
        const currentUser = user as AdminUser;

        // Verificamos si tiene rol de administrador.
        // Si no tienes 'role' en tu DB, como fallback podemos verificar si el email es de admin
        const hasAdminRole =
          currentUser.role === 'admin' || currentUser.email.includes('admin');

        setIsAdmin(hasAdminRole);

        // Si se autenticó pero no es admin, lo expulsamos del panel administrativo
        if (!hasAdminRole) {
          router.replace('/dashboard');
        }
      } else {
        // Si no está autenticado en absoluto, lo mandamos al login general
        router.replace('/login');
      }
      setIsVerifying(false);
    }
  }, [user, isAuthenticated, isAuthLoading, router]);

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
