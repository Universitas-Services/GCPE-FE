'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  profileService,
  ProfileResponse,
} from '@/features/profile/services/profile.service';
import { CompleteProfileModal } from '@/features/profile/components/CompleteProfileModal';
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
  FileText,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardHomeView() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfile(data);

        // Check if first login explicitly based on missing cargo and institucion
        if (
          (!data.cargo || data.cargo.trim() === '') &&
          (!data.nombre_institucion_ente ||
            data.nombre_institucion_ente.trim() === '')
        ) {
          const hasSeenModal = localStorage.getItem(
            `profile_modal_shown_${data.email}`
          );
          if (!hasSeenModal) {
            setShowProfileModal(true);
          }
        }
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
          <h1 className="text-2xl font-bold tracking-tight text-[#101829] leading-tight">
            Hola,{' '}
            <span className="text-[#005282]">
              {profile?.first_name} {profile?.last_name || 'Usuario'}
            </span>
          </h1>
        )}
        <p className="text-slate-600 font-medium text-xs mt-1.5">
          Aquí tienes el resumen de tu gestión hoy.
        </p>
      </div>

      {/* Main Modules */}
      <div className="flex flex-col gap-2 shrink-0">
        <div className="flex items-center gap-2 text-[#005282]">
          <div className="grid grid-cols-2 gap-1 w-3.5 h-3.5">
            <div className="bg-[#005496] rounded-sm"></div>
            <div className="bg-[#005496] rounded-sm"></div>
            <div className="bg-[#005496] rounded-sm"></div>
            <div className="bg-[#005496] rounded-sm"></div>
          </div>
          <h2 className="text-base font-semibold text-[#005282]">
            Módulos Principales
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Manual Express */}
          <Card className="relative overflow-hidden border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between p-3 bg-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -z-10 opacity-70"></div>
            <CardHeader className="p-0 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Book className="w-5 h-5 text-[#005496]" />
                </div>
                <CardTitle className="text-sm font-bold leading-tight text-[#005282]">
                  Manual Express
                </CardTitle>
              </div>
              <CardDescription className="text-[11px] mt-1.5 text-slate-600 leading-relaxed">
                Genera al instante tu demo de manual para concursos abiertos de
                bienes (Acto Único / Apertura Única).
                <span className="block mt-1 font-medium text-slate-500">
                  Simplifica tu proceso de contratación desde el primer paso.
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-2 pt-2 border-t border-slate-100">
              <Link
                href="/dashboard/manual"
                className="inline-flex items-center text-[11px] font-bold text-[#0091BE] hover:text-[#005282] transition-colors"
              >
                Acceder <ArrowRight className="ml-1 w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>

          {/* Registro de Proveedores */}
          <Card className="relative overflow-hidden border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between p-3 bg-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-bl-full -z-10 opacity-70"></div>
            <CardHeader className="p-0 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5 text-[#00C853]" />
                </div>
                <CardTitle className="text-sm font-bold leading-tight text-[#005282]">
                  Registro de Proveedores
                </CardTitle>
              </div>
              <CardDescription className="text-[11px] mt-1.5 text-slate-600 leading-relaxed">
                Registra y gestiona el listado oficial de proveedores,
                asegurando un control eficiente y en orden.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-2 pt-2 border-t border-slate-100">
              <Link
                href="/dashboard/proveedores/registro"
                className="inline-flex items-center text-[11px] font-bold text-[#0091BE] hover:text-[#005282] transition-colors mt-auto"
              >
                Registrar proveedor <ArrowRight className="ml-1 w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>

          {/* Compliance Expediente */}
          <Card className="relative overflow-hidden border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between p-3 bg-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/50 rounded-bl-full -z-10 opacity-70"></div>
            <CardHeader className="p-0 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#FFC107]" />
                </div>
                <CardTitle className="text-sm font-bold leading-tight text-[#005282]">
                  Compliance de expediente
                </CardTitle>
              </div>
              <CardDescription className="text-[11px] mt-1.5 text-slate-600 leading-relaxed">
                Válida al instante el cumplimiento documental de expedientes de
                bienes bajo la modalidad de concurso abierto, acto único y
                apertura única .
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-2 pt-2 border-t border-slate-100">
              <Link
                href="/dashboard/compliance"
                className="inline-flex items-center text-[11px] font-bold text-[#0091BE] hover:text-[#005282] transition-colors"
              >
                Verificar cumplimiento{' '}
                <ArrowRight className="ml-1 w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lower Cards - PRO Modules & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0 mt-2">
        <Card className="relative overflow-hidden border-slate-200 flex flex-col justify-between p-3 bg-white">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50/50 rounded-bl-full -z-10 opacity-70"></div>
          <CardHeader className="p-0 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-[#00C853]" />
              </div>
              <CardTitle className="text-sm font-bold text-[#005282] leading-tight">
                Proveedores registrados
              </CardTitle>
            </div>
            <CardDescription className="text-[11px] leading-relaxed text-slate-600">
              Lleva el control total de tus proveedores: gestiona su información
              documental, emite certificados de registro y asegura la
              actualización anual en cumplimiento con las Normas de Control
              Interno de la SUNAI .
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-2 pt-2 border-t border-slate-100 flex justify-center w-full">
            <Link
              href="/dashboard/pro"
              className="z-10 w-full mt-2 flex justify-center"
            >
              <Button
                variant="secondary"
                size="sm"
                className="w-full md:w-auto bg-white text-[#0091BE] hover:bg-slate-50 shadow-md border-0 font-bold gap-2 h-10 px-6 text-sm hover:scale-105 transition-transform"
              >
                Actualizar a la versión PRO{' '}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-slate-200 flex flex-col justify-between p-3 bg-white">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50/50 rounded-bl-full -z-10 opacity-70"></div>
          <CardHeader className="p-0 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-md bg-amber-50 flex items-center justify-center shrink-0">
                <FileCheck className="w-4 h-4 text-[#FFC107]" />
              </div>
              <CardTitle className="text-sm font-bold text-[#005282] leading-tight">
                Compliance realizado
              </CardTitle>
            </div>
            <CardDescription className="text-[11px] leading-relaxed text-slate-600">
              ¿Deseas revisar a detalle el contenido de cada acta de tu
              expediente y conocer tu porcentaje exacto de cumplimiento? Obtén
              análisis profundos y métricas de gestión con nuestra herramienta
              avanzada.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-2 pt-2 border-t border-slate-100 flex justify-center w-full">
            <Link
              href="/dashboard/pro"
              className="z-10 w-full mt-2 flex justify-center"
            >
              <Button
                variant="secondary"
                size="sm"
                className="w-full md:w-auto bg-white text-[#0091BE] hover:bg-slate-50 shadow-md border-0 font-bold gap-2 h-10 px-6 text-sm hover:scale-105 transition-transform"
              >
                Actualizar a la versión PRO{' '}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-slate-200 flex flex-col justify-between p-3 bg-white">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50/50 rounded-bl-full -z-10 opacity-70"></div>
          <CardHeader className="p-0 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-[#005496]" />
              </div>
              <CardTitle className="text-sm font-bold text-[#005282] leading-tight">
                Elaboración de expedientes de contrataciones
              </CardTitle>
            </div>
            <CardDescription className="text-[11px] leading-relaxed text-slate-600">
              Automatiza tus procesos de contratación pública. Genera
              cronogramas y actas listas al instante, garantizando el
              cumplimiento automático de la Ley de Contrataciones Públicas .
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-2 pt-2 border-t border-slate-100 flex justify-center w-full">
            <Link
              href="/dashboard/pro"
              className="z-10 w-full mt-2 flex justify-center"
            >
              <Button
                variant="secondary"
                size="sm"
                className="w-full md:w-auto bg-white text-[#0091BE] hover:bg-slate-50 shadow-md border-0 font-bold gap-2 h-10 px-6 text-sm hover:scale-105 transition-transform"
              >
                Actualizar a la versión PRO{' '}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Pro Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-sky-500 rounded-xl px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg overflow-hidden relative shrink-0 mt-3">
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-10 -top-10 w-28 h-28 bg-black/10 rounded-full blur-xl"></div>

        <div className="flex items-center gap-4 z-10 w-full">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm shadow-sm border border-white/20">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
              ¡Lleva tu gestión al siguiente nivel!
            </h3>
            <p className="text-teal-50 text-xs md:text-sm max-w-xl leading-relaxed mt-1.5">
              Desbloquea la generación automática de tus expedientes de
              Contrataciones Públicas en todas sus modalidades, el análisis de
              cumplimiento porcentual de tus expedientes, gestión avanzada de
              los proveedores registrados al instante.
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
            className="w-full md:w-auto bg-white text-[#0091BE] hover:bg-slate-50 shadow-md border-0 font-bold gap-2 h-10 px-6 text-sm hover:scale-105 transition-transform"
          >
            Actualizar a la versión PRO <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Social Networks Below Banner */}
      <div className="flex flex-col items-center justify-center pt-3 pb-2 shrink-0">
        <div className="flex gap-4 items-center justify-center">
          <Link
            href="https://www.facebook.com/universitasf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-blue-600 transition-colors"
          >
            <Facebook className="w-5 h-5" />
          </Link>
          <Link
            href="https://www.instagram.com/universitasf/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-pink-600 transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </Link>
          <Link
            href="https://www.linkedin.com/school/universitasf/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-blue-700 transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </Link>
          <Link
            href="https://www.youtube.com/@UniversitasF"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-red-600 transition-colors"
          >
            <Youtube className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {profile && (
        <CompleteProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          uid={profile.email} // using email as identifier for localstorage
          onSuccess={() => {
            // Refetch after saving to hide modal and refresh data
            profileService.getProfile().then(setProfile);
          }}
        />
      )}
    </div>
  );
}
