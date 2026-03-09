'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';

// Imports de UI y Contexto
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../context/AuthContext';

// 1. Esquema de validación actualizado a "username"
const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'El correo electrónico es requerido' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const [globalError, setGlobalError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '', // Ahora usamos username
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setGlobalError('');
    try {
      // Nota: Asegúrate de que tu auth.service.ts espere { username, password }
      // y no { email, password }
      await login(data as any);
    } catch (err: any) {
      setGlobalError(
        err.message || 'Credenciales inválidas. Inténtalo de nuevo.'
      );
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left Side - Gray Background */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-[#A6A9B0] p-10 lg:w-1/2 lg:px-20">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="relative w-full max-w-lg animate-in fade-in zoom-in duration-700">
            <Image
              src="/logo-con-letra-blanco.png"
              alt="Logo Principal"
              width={500}
              height={500}
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#eaeef4] p-8 lg:p-20">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Logo Pequeño"
                width={50}
                height={50}
                className="h-12 w-auto"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Bienvenido
            </h1>
            <p className="text-sm text-gray-500">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo Usuario (Modificado) */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">
                Correo electrónico
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingresa tu correo electrónico"
                className={`bg-white border-gray-200 ${errors.username ? 'border-red-500' : ''}`}
                {...register('username')}
              />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Campo Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                className={`bg-white border-gray-200 ${errors.password ? 'border-red-500' : ''}`}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/recovery"
                className="text-sm font-medium text-[#008CBA] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {globalError && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md text-center">
                {globalError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white py-6 text-lg shadow-sm disabled:opacity-50"
              variant="default"
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#eaeef4] px-2 text-gray-500">O</span>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            ¿No tienes cuenta?{' '}
            <Link
              href="/register"
              className="font-bold text-[#008CBA] hover:underline"
            >
              Registrate AQUÍ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
