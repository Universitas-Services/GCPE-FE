'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

export function LoginForm() {
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simulate login success
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left Side - Gray Background 
          Agregado 'hidden lg:flex' para ocultarlo en móviles según indicación */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-[#A8ADB5] p-10 lg:w-1/2 lg:px-20">
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* Logo Principal (Imagen) */}
          <div className="relative w-full max-w-lg">
            <Image
              src="/logo-con-letra.png"
              alt="Logo Principal"
              width={500}
              height={500}
              className="object-contain drop-shadow-sm"
              priority // Carga prioritaria al ser la imagen más grande (LCP)
            />
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col items-center justify-center bg-[#eaeef4] p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          {/* Top Logo (Icono pequeño) */}
          <div className="flex flex-col items-center justify-center text-center">
            {/* Reemplazo de UNIVERSITAS Legal por logo.png */}
            <div className="mb-2">
              <Image
                src="/logo.png"
                alt="Logo Universitas"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>

            <h2 className="mt-6 text-sm text-gray-500">
              Inicia sesión para continuar
            </h2>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Ingresa tu correo"
                className="bg-white border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                className="bg-white border-gray-200"
              />
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#008CBA] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#008CBA] hover:bg-[#007da6] text-white py-6 text-lg shadow-sm"
            >
              Iniciar sesión
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
        </div>
      </div>
    </div>
  );
}
