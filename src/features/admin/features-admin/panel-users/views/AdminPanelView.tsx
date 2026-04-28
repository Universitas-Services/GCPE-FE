'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminUsersService } from '../services/admin.service';
import {
  dashboardService,
  DashboardResponse,
} from '@/features/admin/services/dashboardService';
import type { AdminUser, AdminPanelKpis } from '../types/admin-users.types';
import { AdminKpiCards } from './components/AdminKpiCards';
import { AdminFilters } from './components/AdminFilters';
import { UsersTable } from './components/UsersTable';
import {
  UserDetailModals,
  type DetailModalType,
} from './components/UserDetailModals';

export function AdminPanelView() {
  // ── Estado de datos ──────────────────────────────────────────────────
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [kpis, setKpis] = useState<AdminPanelKpis | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingKpis, setIsLoadingKpis] = useState(true);

  // ── Filtros ──────────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const ordering = '-date_joined';
  const [pageSize, setPageSize] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);

  // ── Modal de detalle ─────────────────────────────────────────────────
  const [activeModal, setActiveModal] = useState<DetailModalType>(null);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [selectedUserName, setSelectedUserName] = useState('');

  // ── Debounce del search ──────────────────────────────────────────────
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // ── Carga de KPIs (desde /api/dashboard) ─────────────────────────────
  const loadKpis = useCallback(async () => {
    setIsLoadingKpis(true);
    try {
      const dashData: DashboardResponse = await dashboardService.getMetrics();
      setKpis({
        total_usuarios: dashData.kpis.total_usuarios,
        gestion_proveedores: dashData.kpis.total_proveedores,
        informes_compliance: dashData.kpis.auditorias_compliance,
        manuales_generados: dashData.kpis.generacion_manuales,
      });
    } catch {
      // Silently fail — KPIs are non-critical
      setKpis(null);
    } finally {
      setIsLoadingKpis(false);
    }
  }, []);

  // ── Carga de usuarios ────────────────────────────────────────────────
  const loadUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const result = await adminUsersService.getUsers({
        search: debouncedSearch || undefined,
        ordering,
        page: currentPage,
        page_size: Number(pageSize),
      });
      setUsers(result.results);
      setTotalCount(result.count);
    } catch (err) {
      // console.warn en vez de .error para evitar el overlay de Next.js dev
      console.warn('[AdminPanel] Error al cargar usuarios:', err);
      setUsers([]);
      setTotalCount(0);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [debouncedSearch, ordering, currentPage, pageSize]);

  // ── Efectos ──────────────────────────────────────────────────────────
  useEffect(() => {
    loadKpis();
  }, [loadKpis]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ── Handlers ─────────────────────────────────────────────────────────
  const handleAction = (userId: number, action: DetailModalType) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUserId(userId);
    setSelectedUserName(
      user ? `${user.first_name} ${user.last_name}`.trim() : ''
    );
    setActiveModal(action);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / Number(pageSize)));

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#005282]">
            Panel de Usuarios
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona y supervisa los usuarios registrados en la plataforma.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-[#005282] border-[#005282]/30 hover:bg-[#005282]/5"
          onClick={() => {
            loadKpis();
            loadUsers();
          }}
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {/* KPIs */}
      <AdminKpiCards kpis={kpis} isLoading={isLoadingKpis} />

      {/* Filtros */}
      <AdminFilters
        searchValue={search}
        onSearchChange={setSearch}
        pageSize={pageSize}
        onPageSizeChange={(v) => {
          setPageSize(v);
          setCurrentPage(1);
        }}
      />

      {/* Tabla de usuarios */}
      <UsersTable
        users={users}
        isLoading={isLoadingUsers}
        onAction={handleAction}
      />

      {/* Paginación simple */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Mostrando{' '}
            {Math.min((currentPage - 1) * Number(pageSize) + 1, totalCount)}–
            {Math.min(currentPage * Number(pageSize), totalCount)} de{' '}
            {totalCount} usuarios
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <span className="px-2 font-medium text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Modales de detalle */}
      {selectedUserId > 0 && (
        <UserDetailModals
          modalType={activeModal}
          onClose={() => setActiveModal(null)}
          userId={selectedUserId}
          userName={selectedUserName}
        />
      )}
    </div>
  );
}
