import type { Metadata } from 'next';
import { Inter, Roboto } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { SessionExpiredModal } from '@/components/shared/SessionExpiredModal';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: {
    // El %s será reemplazado por el título de cada módulo/página
    template: '%s | GCPE Universitas',
    // default se usa si una página no define su propio título
    default: 'Inicio | GCPE Universitas',
  },
  description: 'Sistema de Gestión de Contrataciones Públicas Estatales',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${roboto.variable} antialiased`}>
        {/* 2. Envolver los children con el AuthProvider */}
        <AuthProvider>
          {children}
          <SessionExpiredModal />
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
