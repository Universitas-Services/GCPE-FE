export interface DashboardMetrics {
  kpis: {
    totalUsers: number;
    totalProviders: number;
    usersWithCompliance: number;
    usersWithManual: number;
  };
  specialtyBreakdown: {
    bienes: number;
    servicios: number;
    obras: number;
  };
  contractLevel: {
    alta: number;
    media: number;
    baja: number;
  };
  userGrowth: { month: string; users: number }[];
  recentUsers: {
    id: string;
    name: string;
    email: string;
    cargo: string;
    institucion: string;
  }[];
  recentProviders: {
    id: string;
    rif: string;
    razonSocial: string;
    nivel: string;
    status: string;
  }[];
  latestAudits: {
    id: string;
    nomenclatura: string;
    entidad: string;
    fecha: string;
    autor: string;
  }[];
}

class DashboardService {
  async getMetrics(): Promise<DashboardMetrics> {
    // Return mock data for the dashboard
    return {
      kpis: {
        totalUsers: 1250,
        totalProviders: 840,
        usersWithCompliance: 320,
        usersWithManual: 450,
      },
      specialtyBreakdown: {
        bienes: 400,
        servicios: 300,
        obras: 140,
      },
      contractLevel: {
        alta: 120,
        media: 350,
        baja: 370,
      },
      userGrowth: [
        { month: 'Ene', users: 100 },
        { month: 'Feb', users: 200 },
        { month: 'Mar', users: 400 },
        { month: 'Abr', users: 800 },
        { month: 'May', users: 1250 },
      ],
      recentUsers: [
        {
          id: '1',
          name: 'Carlos Perez',
          email: 'carlos.perez@example.com',
          cargo: 'Director',
          institucion: 'Min. de Salud',
        },
        {
          id: '2',
          name: 'Maria Gomez',
          email: 'maria.gomez@example.com',
          cargo: 'Analista',
          institucion: 'Min. de Educación',
        },
        {
          id: '3',
          name: 'Luis Rodriguez',
          email: 'luis.rodriguez@example.com',
          cargo: 'Coordinador',
          institucion: 'Gobernación Central',
        },
      ],
      recentProviders: [
        {
          id: '1',
          rif: 'J-12345678-9',
          razonSocial: 'Distribuidora XYZ, C.A.',
          nivel: 'Alta',
          status: 'Activo',
        },
        {
          id: '2',
          rif: 'J-98765432-1',
          razonSocial: 'Servicios Integrales 2000, S.A.',
          nivel: 'Media',
          status: 'Inactivo',
        },
        {
          id: '3',
          rif: 'J-55555555-5',
          razonSocial: 'Constructora El Pilar, C.A.',
          nivel: 'Baja',
          status: 'Activo',
        },
      ],
      latestAudits: [
        {
          id: '1',
          nomenclatura: 'AUD-2026-001',
          entidad: 'Min. de Salud',
          fecha: '2026-04-20',
          autor: 'Ana Martinez',
        },
        {
          id: '2',
          nomenclatura: 'AUD-2026-002',
          entidad: 'Min. de Educación',
          fecha: '2026-04-22',
          autor: 'Jose Fernandez',
        },
        {
          id: '3',
          nomenclatura: 'AUD-2026-003',
          entidad: 'Gobernación Central',
          fecha: '2026-04-25',
          autor: 'Elena Suarez',
        },
      ],
    };
  }
}

export const dashboardService = new DashboardService();
