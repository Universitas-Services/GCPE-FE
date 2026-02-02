import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Building2, Scale } from 'lucide-react';

export function LoginForm() {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left Side - Gray Background */}
      <div className="flex flex-col items-center justify-center bg-[#A8ADB5] p-10 lg:w-1/2 lg:px-20">
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* Generic Logo Placeholder */}
          <div className="rounded-full bg-white/20 p-6 backdrop-blur-sm">
            <Building2 className="h-20 w-20 text-[#004e84]" />
          </div>

          <h1 className="text-3xl font-bold uppercase tracking-widest text-[#004e84] drop-shadow-sm">
            Sistema Integrado
            <br />
            <span className="font-light text-slate-700">
              de Selección de Contratista
            </span>
          </h1>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col items-center justify-center bg-[#eaeef4] p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          {/* Top Logo */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 text-[#0b1e4c]">
              <Scale className="h-10 w-10" />
              <div className="text-left leading-tight">
                <span className="block text-2xl font-serif font-bold tracking-wide">
                  UNIVERSITAS
                </span>
                <span className="block text-xl font-handwriting italic text-slate-500">
                  Legal
                </span>
              </div>
            </div>
            <h2 className="mt-6 text-sm text-gray-500">
              Inicia sesión para continuar
            </h2>
          </div>

          {/* Form */}
          <form className="space-y-6">
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

            <Button className="w-full bg-[#008CBA] hover:bg-[#007da6] text-white py-6 text-lg shadow-sm">
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

          <div className="text-center text-sm text-gray-500">
            ¿No tienes cuenta?{' '}
            <Link
              href="/register"
              className="font-semibold text-[#008CBA] hover:underline"
            >
              Regístrate AQUÍ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
