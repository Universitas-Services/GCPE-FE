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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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
  DashboardMetrics,
} from '@/services/dashboardService';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await dashboardService.getMetrics();
      setMetrics(data);
    };
    fetchMetrics();
  }, []);

  if (!metrics) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
        Cargando métricas...
      </div>
    );
  }

  // --- Transform Data for Charts ---
  const pieData = [
    {
      name: 'Bienes',
      value: metrics.specialtyBreakdown.bienes,
      fill: '#0091be',
    },
    {
      name: 'Servicios',
      value: metrics.specialtyBreakdown.servicios,
      fill: '#005282',
    },
    { name: 'Obras', value: metrics.specialtyBreakdown.obras, fill: '#38bdf8' },
  ];
  const totalPie = pieData.reduce((sum, d) => sum + d.value, 0);

  const pieChartConfig = {
    bienes: { label: 'Bienes', color: '#0091be' },
    servicios: { label: 'Servicios', color: '#005282' },
    obras: { label: 'Obras', color: '#38bdf8' },
  };

  const lineChartConfig = {
    users: { label: 'Usuarios', color: '#0091be' },
  };

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
                {metrics.kpis.totalUsers}
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
                {metrics.kpis.totalProviders}
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
                {metrics.kpis.usersWithCompliance}
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
                {metrics.kpis.usersWithManual}
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
              Área de Especialidad
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
                                {(totalPie / 1000).toFixed(1)}k
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
                  data={metrics.userGrowth}
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
                    dataKey="users"
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

      {/* ── Sección C: Tablas de Gestión (Control de Listados) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Tabla 1: Gestión de Usuarios */}
        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              Gestión de Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100 hover:bg-transparent">
                  <TableHead className="text-xs font-medium uppercase text-muted-foreground">
                    Usuario
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-muted-foreground">
                    Cargo
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-muted-foreground">
                    Institución
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-muted-foreground text-right">
                    Acción
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.recentUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="text-sm font-medium text-gray-900">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {user.cargo}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 truncate max-w-[120px]">
                      {user.institucion}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toast.info('Página en construcción', {
                            description:
                              'Gestión de usuarios disponible próximamente.',
                          })
                        }
                        className="text-xs border-gray-200 text-gray-600 hover:text-[#0091be] hover:border-[#0091be] transition-colors"
                      >
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tabla 2: Monitor de Proveedores */}
        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              Monitor de Proveedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100 hover:bg-transparent">
                  <TableHead className="text-xs font-medium uppercase text-muted-foreground">
                    RIF
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-muted-foreground">
                    Razón Social
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-muted-foreground">
                    Nivel
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-muted-foreground">
                    Estado
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-muted-foreground text-right">
                    Acción
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.recentProviders.map((prov) => (
                  <TableRow
                    key={prov.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="text-sm font-medium text-gray-900">
                      {prov.rif}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 truncate max-w-[150px]">
                      {prov.razonSocial}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {prov.nivel}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs font-medium border-none ${prov.status === 'Activo' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}`}
                      >
                        {prov.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toast.info('Página en construcción', {
                            description:
                              'Monitor de proveedores disponible próximamente.',
                          })
                        }
                        className="text-xs border-gray-200 text-gray-600 hover:text-[#0091be] hover:border-[#0091be] transition-colors"
                      >
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tabla 3: Últimas Auditorías (Toma el ancho completo abajo) */}
        <Card className="border-none shadow-sm bg-white rounded-xl xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              Últimas Auditorías
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100 hover:bg-transparent">
                  <TableHead className="text-xs font-medium uppercase text-muted-foreground">
                    Nomenclatura
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-muted-foreground">
                    Órgano / Entidad
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-muted-foreground">
                    Fecha
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-muted-foreground">
                    Elaborado Por
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-muted-foreground text-right">
                    Acción
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.latestAudits.map((audit) => (
                  <TableRow
                    key={audit.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="text-sm font-medium text-gray-900">
                      {audit.nomenclatura}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {audit.entidad}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {audit.fecha}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {audit.autor}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toast.info('Página en construcción', {
                            description:
                              'Detalles de auditoría disponibles próximamente.',
                          })
                        }
                        className="text-xs border-gray-200 text-gray-600 hover:text-[#0091be] hover:border-[#0091be] transition-colors"
                      >
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
