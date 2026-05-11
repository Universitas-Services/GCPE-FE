import { fetchApi } from '@/lib/api-client';

// ── Interfaces que reflejan el JSON real de GET /api/dashboard ──

export interface DashboardKPIs {
  total_usuarios: number;
  total_proveedores: number;
  auditorias_compliance: number;
  generacion_manuales: number;
}

export interface EspecialidadItem {
  label: string;
  valor: number;
}

export interface ActividadRecienteItem {
  mes: string;
  usuarios: number;
}

export interface DashboardCharts {
  especialidad: EspecialidadItem[];
  actividad_reciente: ActividadRecienteItem[];
}

export interface DashboardResponse {
  kpis: DashboardKPIs;
  charts: DashboardCharts;
}

export const dashboardService = {
  /**
   * Obtiene las métricas generales del panel administrativo
   * GET /api/dashboard
   */
  async getMetrics(): Promise<DashboardResponse> {
    const response = await fetchApi('/api/dashboard');

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
