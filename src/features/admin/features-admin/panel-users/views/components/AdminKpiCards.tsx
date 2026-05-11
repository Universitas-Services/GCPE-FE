'use client';

import React from 'react';
import { Users, Building2, ShieldCheck, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AdminPanelKpis } from '../../types/admin-users.types';

interface AdminKpiCardsProps {
  kpis: AdminPanelKpis | null;
  isLoading: boolean;
}

const kpiConfig = [
  {
    key: 'total_usuarios' as const,
    label: 'Total Usuarios',
    icon: Users,
    accent: '#0091be',
  },
  {
    key: 'gestion_proveedores' as const,
    label: 'Gestión Proveedores',
    icon: Building2,
    accent: '#005282',
  },
  {
    key: 'informes_compliance' as const,
    label: 'Informes Compliance',
    icon: ShieldCheck,
    accent: '#0091be',
  },
  {
    key: 'manuales_generados' as const,
    label: 'Manuales Generados',
    icon: BookOpen,
    accent: '#0091be',
  },
];

export function AdminKpiCards({ kpis, isLoading }: AdminKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpiConfig.map((item) => (
        <Card
          key={item.key}
          className="border-none shadow-sm bg-white rounded-xl"
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${item.accent}15` }}
              >
                <item.icon className="h-5 w-5" style={{ color: item.accent }} />
              </div>
            </div>
            <div className="mt-4">
              {isLoading || !kpis ? (
                <>
                  <Skeleton className="h-7 w-16 mb-2" />
                  <Skeleton className="h-4 w-28" />
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-900">
                    {kpis[item.key].toLocaleString('es-VE')}
                  </p>
                  <p className="text-[13px] font-bold text-[#005282]">
                    {item.label}
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
