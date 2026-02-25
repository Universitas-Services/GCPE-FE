'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  userService,
  UserProfileResponse,
} from '@/features/dashboard/services/user.service';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Book,
  Store,
  Rocket,
  Users,
  FileCheck,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  ShieldCheck,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardHomeView() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col flex-1 gap-1.5 lg:gap-2 max-w-7xl mx-auto w-full h-full overflow-y-auto pb-4">
      {/* Header / Greeting */}
      <div className="flex flex-col shrink-0">
        {isLoading ? (
          <Skeleton className="h-8 w-64 mb-1" />
        ) : (
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 leading-tight">
            Hola,{' '}
            <span className="text-blue-600">
              {profile?.username || 'Usuario'}
            </span>
          </h1>
        )}
        <p className="text-gray-500 text-xs mt-0.5">
          Aquí tienes el resumen de tu gestión hoy.
        </p>
      </div>

      {/* Main Modules */}
      <div className="flex flex-col gap-2 shrink-0">
        <div className="flex items-center gap-2 text-slate-700">
          <div className="grid grid-cols-2 gap-1 w-3.5 h-3.5">
            <div className="bg-sky-500 rounded-sm"></div>
            <div className="bg-sky-500 rounded-sm"></div>
            <div className="bg-sky-500 rounded-sm"></div>
            <div className="bg-sky-500 rounded-sm"></div>
          </div>
          <h2 className="text-base font-semibold">Módulos Principales</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Manual Express */}
          <Card className="relative overflow-hidden border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 opacity-70"></div>
            <CardHeader className="p-2 pb-1">
              <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center mb-1">
                <Book className="w-3 h-3 text-blue-600" />
              </div>
              <CardTitle className="text-sm leading-tight">
                Manual Express
              </CardTitle>
              <CardDescription className="text-[11px] mt-0.5 leading-tight">
                Genera demostraciones de manuales de concurso abierto
                rápidamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <Link
                href="/dashboard/manual"
                className="inline-flex items-center text-[11px] font-medium text-blue-700 hover:text-blue-800 transition-colors"
              >
                Acceder <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </CardContent>
          </Card>

          {/* Registro de Proveedores */}
          <Card className="relative overflow-hidden border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 opacity-70"></div>
            <CardHeader className="p-2 pb-1">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center mb-1">
                <Store className="w-3 h-3 text-emerald-600" />
              </div>
              <CardTitle className="text-sm leading-tight">
                <Link
                  href="/dashboard/proveedores/registro"
                  className="hover:underline"
                >
                  Registro de Proveedores
                </Link>
              </CardTitle>
              <CardDescription className="text-[11px] mt-0.5 leading-tight">
                Gestiona el alta, validación y categorización de nuevos
                proveedores.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <Link
                href="/dashboard/proveedores/registro"
                className="inline-flex items-center text-[11px] font-medium text-blue-700 hover:text-blue-800 transition-colors mt-auto"
              >
                Registrar proveedor <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </CardContent>
          </Card>

          {/* Compliance Expediente */}
          <Card className="relative overflow-hidden border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 opacity-70"></div>
            <CardHeader className="p-2 pb-1">
              <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center mb-1">
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
              <CardTitle className="text-sm leading-tight">
                Compliance Expediente
              </CardTitle>
              <CardDescription className="text-[11px] mt-0.5 leading-tight">
                Auditoría legal y validación de expedientes de contratación
                pública.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <Link
                href="/dashboard/compliance"
                className="inline-flex items-center text-[11px] font-medium text-blue-700 hover:text-blue-800 transition-colors"
              >
                Auditar <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats and Social */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 shrink-0">
        <Card className="relative overflow-hidden border-slate-200 flex flex-col justify-center min-h-[50px]">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -z-10 opacity-70"></div>
          <CardHeader className="p-2 pb-0">
            <div className="w-5 h-5 rounded-md bg-blue-50 flex items-center justify-center mb-0.5">
              <Users className="w-3 h-3 text-blue-600" />
            </div>
            <CardDescription className="text-[8px] font-medium uppercase tracking-wider">
              Total Proveedores Activos
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 pt-0.5">
            <p className="text-sm font-bold text-blue-700 leading-none">
              Version PRO
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-slate-200 flex flex-col justify-center min-h-[50px]">
          <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 rounded-bl-full -z-10 opacity-70"></div>
          <CardHeader className="p-2 pb-0">
            <div className="w-5 h-5 rounded-md bg-orange-50 flex items-center justify-center mb-0.5">
              <FileCheck className="w-3 h-3 text-orange-600" />
            </div>
            <CardDescription className="text-[8px] font-medium uppercase tracking-wider">
              Auditorías realizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 pt-0.5">
            <p className="text-sm font-bold text-blue-700 leading-none">
              Version PRO
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 flex flex-col justify-center items-center p-2 min-h-[50px]">
          <h3 className="text-[9px] font-medium text-slate-700 mb-1 self-start uppercase tracking-wider">
            Redes sociales
          </h3>
          <div className="flex gap-3 items-center justify-center w-full mt-1">
            <Link
              href="https://www.facebook.com/universitasf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-blue-600 transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </Link>
            <Link
              href="https://www.instagram.com/universitasf/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-pink-600 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </Link>
            <Link
              href="https://www.linkedin.com/school/universitasf/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-blue-700 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </Link>
            <Link
              href="https://www.youtube.com/@UniversitasF"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-red-600 transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Pro Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-sky-500 rounded-xl px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg overflow-hidden relative shrink-0">
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-10 -top-10 w-28 h-28 bg-black/10 rounded-full blur-xl"></div>

        <div className="flex items-center gap-4 z-10 w-full">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm shadow-sm border border-white/20">
            <Rocket className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
              ¡Desbloquea todo el potencial!
            </h3>
            <p className="text-teal-50 text-xs md:text-sm max-w-xl leading-relaxed mt-1">
              Actualiza a PRO para acceder a reportes, auditorías ilimitadas y
              soporte exclusivo para tu gestión.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/pro"
          className="z-10 w-full md:w-auto mt-2 md:mt-0"
        >
          <Button
            variant="secondary"
            size="sm"
            className="w-full md:w-auto bg-white text-teal-800 hover:bg-slate-50 shadow-md border-0 font-bold gap-2 h-9 md:h-10 px-5 md:px-6 text-xs md:text-sm hover:scale-105 transition-transform"
          >
            Actualizar a PRO <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
