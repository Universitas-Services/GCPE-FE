import { fetchApi } from '@/lib/api-client';

export interface KPIs {
  totalUsers: number;
  activeProviders: number;
  inactiveProviders: number;
  usersWithCompliance: number;
  usersManagerProviders: number;
  usersWithManual: number;
  totalProviders: number;
}

export interface SpecialtyBreakdown {
  bienes: number;
  servicios: number;
  obras: number;
}

export interface ContractLevel {
  alta: number;
  media: number;
  baja: number;
}

export interface RecentProvider {
  id: string;
  rif: string;
  razonSocial: string;
  nivel: 'ALTA' | 'MEDIA' | 'BAJA';
  status: 'Activo' | 'Inactivo';
}

export interface LatestAudit {
  id: string;
  nomenclatura: string;
  entidad: string;
  fecha: string;
  autor: string;
}

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  cargo: string;
  institucion: string;
}

export interface DashboardMetrics {
  kpis: KPIs;
  specialtyBreakdown: SpecialtyBreakdown;
  contractLevel: ContractLevel;
  recentProviders: RecentProvider[];
  latestAudits: LatestAudit[];
  recentUsers: RecentUser[];
  userGrowth: { month: string; users: number }[];
}

export const dashboardService = {
  /**
   * Obtiene las métricas generales para el panel administrativo
   */
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await fetchApi('/api/dashboard/metrics');

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error al obtener métricas del dashboard:', errorData);
      throw new Error(
        errorData.detail || 'No se pudieron obtener las métricas del dashboard'
      );
    }

    return response.json();
  },
};
