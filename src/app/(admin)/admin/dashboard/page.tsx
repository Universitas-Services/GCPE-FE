'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Building2,
  ShieldCheck,
  UserCog,
  PieChart as PieChartIcon,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
  LineChart,
  Line,
} from 'recharts';
import {
  dashboardService,
  DashboardResponse,
} from '@/features/admin/services/dashboardService';

// Colores para el pie chart de especialidad
const SPECIALTY_COLORS: Record<string, string> = {
  Bienes: '#0091be',
  Servicios: '#005282',
  Obras: '#38bdf8',
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardService
      .getMetrics()
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Error al cargar métricas');
      });
  }, []);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-red-500">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
        Cargando métricas...
      </div>
    );
  }

  // --- Transform Data for Charts ---
  const pieData = data.charts.especialidad.map((item) => ({
    name: item.label,
    value: item.valor,
    fill: SPECIALTY_COLORS[item.label] || '#94a3b8',
  }));
  const totalPie = pieData.reduce((sum, d) => sum + d.value, 0);

  const pieChartConfig = {
    bienes: { label: 'Bienes', color: '#0091be' },
    servicios: { label: 'Servicios', color: '#005282' },
    obras: { label: 'Obras', color: '#38bdf8' },
  };

  const lineChartConfig = {
    usuarios: { label: 'Usuarios', color: '#0091be' },
  };

  // Transform actividad_reciente for LineChart
  const lineData = data.charts.actividad_reciente.map((item) => ({
    month: item.mes,
    usuarios: item.usuarios,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* ── Fila 1: Título ── */}
      <div>
        <h1 className="text-3xl font-bold text-[#005282]">
          Panel Administrativo
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Métricas avanzadas de proveedores, auditorías y gestión de usuarios.
        </p>
      </div>

      {/* ── Sección A: Métricas Generales (Grid de KPIs) ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0091be]/10">
                <Users className="h-5 w-5 text-[#0091be]" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">
                {data.kpis.total_usuarios}
              </p>
              <p className="text-[13px] font-bold text-[#005282]">
                Total Usuarios
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#005282]/10">
                <Building2 className="h-5 w-5 text-[#005282]" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">
                {data.kpis.total_proveedores}
              </p>
              <p className="text-[13px] font-bold text-[#005282]">
                Total Proveedores
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0091be]/10">
                <ShieldCheck className="h-5 w-5 text-[#0091be]" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">
                {data.kpis.auditorias_compliance}
              </p>
              <p className="text-[13px] font-bold text-[#005282]">
                Auditorías Compliance
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0091be]/10">
                <UserCog className="h-5 w-5 text-[#0091be]" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">
                {data.kpis.generacion_manuales}
              </p>
              <p className="text-[13px] font-bold text-[#005282]">
                Generación de Manuales
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Sección B: Visualización de Datos (Gráficos) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Donut Chart: Área de Especialidad */}
        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-[#0091be]" />
            <CardTitle className="text-base font-semibold text-gray-900">
              Área de especialidad de los proveedores registrados
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer
              config={pieChartConfig}
              className="h-[220px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={85}
                    strokeWidth={2}
                    stroke="#ffffff"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 6}
                                className="fill-gray-900 text-xl font-bold"
                              >
                                {totalPie >= 1000
                                  ? `${(totalPie / 1000).toFixed(1)}k`
                                  : totalPie}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 14}
                                className="fill-gray-500 text-xs"
                              >
                                Total
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-2 flex items-center justify-center gap-4">
              {pieData.map((entry) => (
                <div
                  key={entry.name}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <span
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ backgroundColor: entry.fill }}
                  />
                  {entry.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Line Chart: Actividad Reciente */}
        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#0091be]" />
            <CardTitle className="text-base font-semibold text-gray-900">
              Usuarios nuevos registrados
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer
              config={lineChartConfig}
              className="h-[220px] w-full mt-4"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) =>
                      v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                    }
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="usuarios"
                    stroke="#0091be"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#0091be' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
