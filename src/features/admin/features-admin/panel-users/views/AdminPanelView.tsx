'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AdminUser } from '../types/admin-users.types';
import { adminUsersService } from '../services/admin.service';
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
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // ── Filtros ──────────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const ordering = '-date_joined';
  const [pageSize, setPageSize] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  // ── Modal de detalle ─────────────────────────────────────────────────
  const [activeModal, setActiveModal] = useState<DetailModalType>(null);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [selectedUserName, setSelectedUserName] = useState('');

  // ── Modal de confirmación (eliminar/activar) ─────────────────────────
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'activate';
    userId: number;
    userName: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  // ── Carga de usuarios ────────────────────────────────────────────────
  const loadUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const result = await adminUsersService.getUsers({
        search: debouncedSearch || undefined,
        ordering,
        page: currentPage,
        page_size: Number(pageSize),
        is_active: statusFilter !== 'all' ? statusFilter : undefined,
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
  }, [debouncedSearch, ordering, currentPage, pageSize, statusFilter]);

  // ── Efectos ──────────────────────────────────────────────────────────

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

  const handleDeleteUser = (userId: number, userName: string) => {
    setConfirmAction({ type: 'delete', userId, userName });
  };

  const handleActivateUser = (userId: number, userName: string) => {
    setConfirmAction({ type: 'activate', userId, userName });
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    setIsProcessing(true);
    try {
      if (confirmAction.type === 'delete') {
        await adminUsersService.deleteUser(confirmAction.userId);
      } else {
        await adminUsersService.activateUser(confirmAction.userId);
      }
      // Recargar la tabla después de la acción
      await loadUsers();
    } catch (err) {
      console.warn('[AdminPanel] Error en acción de usuario:', err);
    } finally {
      setIsProcessing(false);
      setConfirmAction(null);
    }
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
            loadUsers();
          }}
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {/* Filtros */}
      <AdminFilters
        searchValue={search}
        onSearchChange={setSearch}
        pageSize={pageSize}
        onPageSizeChange={(v) => {
          setPageSize(v);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(v) => {
          setStatusFilter(v);
          setCurrentPage(1);
        }}
      />

      {/* Tabla de usuarios */}
      <UsersTable
        users={users}
        isLoading={isLoadingUsers}
        onAction={handleAction}
        onDeleteUser={handleDeleteUser}
        onActivateUser={handleActivateUser}
      />

      {/* Paginación simple */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
          <span>
            Mostrando{' '}
            {Math.min((currentPage - 1) * Number(pageSize) + 1, totalCount)} -{' '}
            {Math.min(currentPage * Number(pageSize), totalCount)} de{' '}
            {totalCount} usuarios
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 font-medium text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
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

      {/* Modal de confirmación para eliminar/activar usuario */}
      {confirmAction && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            {confirmAction.type === 'delete' ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  ¿Eliminar usuario?
                </h3>
                <p className="text-slate-600 mb-6">
                  ¿Estás seguro de que deseas eliminar a{' '}
                  <strong>{confirmAction.userName}</strong>? El usuario será
                  desactivado y no podrá acceder a la plataforma.
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  ¿Activar usuario?
                </h3>
                <p className="text-slate-600 mb-6">
                  ¿Estás seguro de que deseas activar a{' '}
                  <strong>{confirmAction.userName}</strong>? El usuario podrá
                  acceder nuevamente a la plataforma.
                </p>
              </>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setConfirmAction(null)}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                className={`flex-1 text-white ${
                  confirmAction.type === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                onClick={handleConfirmAction}
                disabled={isProcessing}
              >
                {isProcessing
                  ? 'Procesando...'
                  : confirmAction.type === 'delete'
                    ? 'Eliminar'
                    : 'Activar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
