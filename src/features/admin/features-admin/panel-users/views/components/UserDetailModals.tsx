'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { adminUsersService } from '../../services/admin.service';
import type {
  UserProvider,
  UserCompliance,
  UserManual,
} from '../../types/admin-users.types';

// ════════════════════════════════════════════════════════════════════════
// Shared helpers
// ════════════════════════════════════════════════════════════════════════

function LoadingRows({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function EmptyRow({ cols, message }: { cols: number; message: string }) {
  return (
    <TableRow>
      <TableCell
        colSpan={cols}
        className="h-24 text-center text-muted-foreground"
      >
        {message}
      </TableCell>
    </TableRow>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Providers Modal
// ════════════════════════════════════════════════════════════════════════

interface ProvidersModalProps {
  open: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
}

export function ProvidersModal({
  open,
  onClose,
  userId,
  userName,
}: ProvidersModalProps) {
  const [data, setData] = useState<UserProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await adminUsersService.getUserProviders(
        userId,
        page,
        pageSize
      );
      setData(result.items);
      setTotal(result.pagination.total);
    } catch (err) {
      toast.error('Error al cargar proveedores', {
        description: (err as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, page, pageSize]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#005282]">
            Proveedores de {userName}
          </DialogTitle>
          <DialogDescription>
            Lista de proveedores registrados por este usuario.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[55vh] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead>Nombre</TableHead>
                <TableHead>RIF</TableHead>
                <TableHead className="hidden md:table-cell">Tipo</TableHead>
                <TableHead className="hidden md:table-cell">Estado</TableHead>
                <TableHead className="hidden lg:table-cell">Correo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <LoadingRows cols={5} />
              ) : data.length === 0 ? (
                <EmptyRow
                  cols={5}
                  message="Este usuario no tiene proveedores registrados."
                />
              ) : (
                data.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-gray-900">
                      {p.nombre_proveedor}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.rif_proveedor}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">
                      {p.tipo_persona}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {p.estado}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden lg:table-cell">
                      {p.correo_proveedor}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        {total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)}{' '}
                de {total}
              </p>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#0091be]"
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">
                {page} / {Math.max(1, Math.ceil(total / pageSize))}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(total / pageSize)}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Compliance Modal (con botón Reenviar)
// ════════════════════════════════════════════════════════════════════════

interface ComplianceModalProps {
  open: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
}

export function ComplianceModal({
  open,
  onClose,
  userId,
  userName,
}: ComplianceModalProps) {
  const [data, setData] = useState<UserCompliance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await adminUsersService.getUserCompliance(
        userId,
        page,
        pageSize
      );
      setData(result.items);
      setTotal(result.pagination.total);
    } catch (err) {
      toast.error('Error al cargar compliance', {
        description: (err as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, page, pageSize]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const handleDownload = async (id: string) => {
    setDownloadingId(id);
    try {
      await adminUsersService.downloadCompliancePDF(userId, id);
      toast.success('Descarga iniciada exitosamente');
    } catch (err) {
      toast.error('Error al descargar el compliance', {
        description: (err as Error).message,
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleResend = async (id: string) => {
    setResendingId(id);
    try {
      const res = await adminUsersService.resendCompliance(id);
      toast.success('Compliance reenviado', {
        description: res.message || 'El informe fue reenviado correctamente.',
      });
      // Refresh data after resend
      load();
    } catch (err) {
      toast.error('Error al reenviar', { description: (err as Error).message });
    } finally {
      setResendingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#005282]">
            Informes Compliance de {userName}
          </DialogTitle>
          <DialogDescription>
            Lista de informes de compliance generados por este usuario.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[55vh] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead>Órgano / Entidad</TableHead>
                <TableHead className="hidden md:table-cell">
                  Unidad Revisora
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Nomenclatura
                </TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Fecha Revisión
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Persona Contacto
                </TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <LoadingRows cols={7} />
              ) : data.length === 0 ? (
                <EmptyRow
                  cols={7}
                  message="Este usuario no tiene informes de compliance."
                />
              ) : (
                data.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-gray-900 max-w-[200px] truncate">
                      {c.nombre_organo_entidad || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">
                      {c.nombre_unidad_revisora || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">
                      {c.nomenclatura || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {c.fecha_creacion
                        ? new Date(c.fecha_creacion).toLocaleDateString('es-VE')
                        : '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                      {c.fecha_revision
                        ? new Date(c.fecha_revision).toLocaleDateString('es-VE')
                        : '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden lg:table-cell max-w-[180px] truncate">
                      {c.persona_contacto || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#0091be] hover:text-[#005282] hover:bg-[#0091be]/10"
                          disabled={downloadingId === c.id}
                          onClick={() => handleDownload(c.id)}
                        >
                          {downloadingId === c.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          <span className="sr-only">Descargar compliance</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#0091be] hover:text-[#005282] hover:bg-[#0091be]/10"
                          disabled={resendingId === c.id}
                          onClick={() => handleResend(c.id)}
                        >
                          {resendingId === c.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          <span className="sr-only">Reenviar compliance</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        {total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)}{' '}
                de {total}
              </p>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#0091be]"
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">
                {page} / {Math.max(1, Math.ceil(total / pageSize))}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(total / pageSize)}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Manuals Modal (con botón Reenviar)
// ════════════════════════════════════════════════════════════════════════

interface ManualsModalProps {
  open: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
}

export function ManualsModal({
  open,
  onClose,
  userId,
  userName,
}: ManualsModalProps) {
  const [data, setData] = useState<UserManual[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await adminUsersService.getUserManuals(
        userId,
        page,
        pageSize
      );
      setData(result.items);
      setTotal(result.pagination.total);
    } catch (err) {
      toast.error('Error al cargar manuales', {
        description: (err as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, page, pageSize]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const handleDownload = async (id: string) => {
    setDownloadingId(id);
    try {
      await adminUsersService.downloadManualPDF(userId, id);
      toast.success('Descarga iniciada exitosamente');
    } catch (err) {
      toast.error('Error al descargar el manual', {
        description: (err as Error).message,
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleResend = async (id: string) => {
    setResendingId(id);
    try {
      const res = await adminUsersService.resendManual(id);
      toast.success('Manual reenviado', {
        description: res.message || 'El manual fue reenviado correctamente.',
      });
      load();
    } catch (err) {
      toast.error('Error al reenviar', { description: (err as Error).message });
    } finally {
      setResendingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#005282]">
            Manuales de {userName}
          </DialogTitle>
          <DialogDescription>
            Lista de manuales generados por este usuario.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[55vh] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead>Institución / Ente</TableHead>
                <TableHead className="hidden md:table-cell">Siglas</TableHead>
                <TableHead className="hidden md:table-cell">
                  Unidad Admin. Financiera
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Unidad Sistemas / Tecnología
                </TableHead>
                <TableHead>Correo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <LoadingRows cols={6} />
              ) : data.length === 0 ? (
                <EmptyRow
                  cols={6}
                  message="Este usuario no tiene manuales generados."
                />
              ) : (
                data.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium text-gray-900 max-w-[200px] truncate">
                      {m.nombre_institucion_ente || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">
                      {m.siglas_institucion_ente || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell max-w-[180px] truncate">
                      {m.nombre_unidad_admin_financiera || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden lg:table-cell max-w-[180px] truncate">
                      {m.nombre_unidad_sistemas_tecnologia || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-[180px] truncate">
                      {m.correo_electronico_manual || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#0091be] hover:text-[#005282] hover:bg-[#0091be]/10"
                          disabled={downloadingId === m.id}
                          onClick={() => handleDownload(m.id)}
                        >
                          {downloadingId === m.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          <span className="sr-only">Descargar manual</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#0091be] hover:text-[#005282] hover:bg-[#0091be]/10"
                          disabled={resendingId === m.id}
                          onClick={() => handleResend(m.id)}
                        >
                          {resendingId === m.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          <span className="sr-only">Reenviar manual</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        {total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)}{' '}
                de {total}
              </p>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#0091be]"
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">
                {page} / {Math.max(1, Math.ceil(total / pageSize))}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(total / pageSize)}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Barrel component – contiene todos los modales
// ════════════════════════════════════════════════════════════════════════

export type DetailModalType = 'providers' | 'compliance' | 'manuals' | null;

interface UserDetailModalsProps {
  modalType: DetailModalType;
  onClose: () => void;
  userId: number;
  userName: string;
}

export function UserDetailModals({
  modalType,
  onClose,
  userId,
  userName,
}: UserDetailModalsProps) {
  return (
    <>
      <ProvidersModal
        open={modalType === 'providers'}
        onClose={onClose}
        userId={userId}
        userName={userName}
      />
      <ComplianceModal
        open={modalType === 'compliance'}
        onClose={onClose}
        userId={userId}
        userName={userName}
      />
      <ManualsModal
        open={modalType === 'manuals'}
        onClose={onClose}
        userId={userId}
        userName={userName}
      />
    </>
  );
}
