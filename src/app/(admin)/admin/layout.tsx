import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Admin Panel - GCPE',
  description: 'Panel Administrativo GCPE - Universitas',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${inter.variable} min-h-full flex flex-col font-sans h-full antialiased`}
    >
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster position="top-right" richColors />
    </div>
  );
}
