'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Fingerprint,
  MapPin,
  Pencil,
  Send,
  Trash2,
  Loader2,
  FileText,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  XCircle,
  Calendar,
  Tag,
  UserCheck,
  BadgeDollarSign,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { adminUsersService } from '../services/admin.service';
import type {
  AdminUser,
  UserNote,
  UserProvider,
  UserCompliance,
  UserManual,
} from '../types/admin-users.types';

// ════════════════════════════════════════════════════════════════════════
// Etiquetas CRM
// ════════════════════════════════════════════════════════════════════════

const ETIQUETAS = [
  { value: 'POR_CONTACTAR', label: 'Por contactar' },
  { value: 'CONTACTADO', label: 'Contactado' },
];

function EtiquetaBadge({
  etiqueta,
  selected,
  onClick,
}: {
  etiqueta: { value: string; label: string };
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Badge
      variant={selected ? 'default' : 'outline'}
      className={`cursor-pointer transition-all text-xs ${
        selected
          ? 'bg-[#0091be] hover:bg-[#007da6] text-white border-[#0091be]'
          : 'text-gray-600 border-gray-300 hover:border-[#0091be] hover:text-[#0091be]'
      }`}
      onClick={onClick}
    >
      {etiqueta.label}
    </Badge>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Main Component
// ════════════════════════════════════════════════════════════════════════

interface UserDetailViewProps {
  userId: number;
}

export function UserDetailView({ userId }: UserDetailViewProps) {
  const router = useRouter();

  // ── Estado ──────────────────────────────────────────────────────────
  const [user, setUser] = useState<AdminUser | null>(null);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [providers, setProviders] = useState<UserProvider[]>([]);
  const [compliance, setCompliance] = useState<UserCompliance[]>([]);
  const [manuals, setManuals] = useState<UserManual[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [isLoadingCompliance, setIsLoadingCompliance] = useState(true);
  const [isLoadingManuals, setIsLoadingManuals] = useState(true);

  // ── Paginación ─────────────────────────────────────────────────────────
  const [providersPage, setProvidersPage] = useState(1);
  const [providersTotal, setProvidersTotal] = useState(0);
  const [providersPageSize, setProvidersPageSize] = useState(5);

  const [compliancePage, setCompliancePage] = useState(1);
  const [complianceTotal, setComplianceTotal] = useState(0);
  const [compliancePageSize, setCompliancePageSize] = useState(5);

  const [manualsPage, setManualsPage] = useState(1);
  const [manualsTotal, setManualsTotal] = useState(0);
  const [manualsPageSize, setManualsPageSize] = useState(5);

  // ── Formulario de nota ──────────────────────────────────────────────
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isSendingNote, setIsSendingNote] = useState(false);

  // ── Edición de nota ─────────────────────────────────────────────────
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editEtiqueta, setEditEtiqueta] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // ── Eliminación y Descarga ──────────────────────────────────────────
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [downloadingComplianceId, setDownloadingComplianceId] = useState<
    string | null
  >(null);
  const [downloadingManualId, setDownloadingManualId] = useState<string | null>(
    null
  );
  const [resendingComplianceId, setResendingComplianceId] = useState<
    string | null
  >(null);
  const [resendingManualId, setResendingManualId] = useState<string | null>(
    null
  );

  // ── Etiqueta seleccionada (estado de contacto) ──────────────────────
  const [selectedEtiqueta, setSelectedEtiqueta] = useState('POR_CONTACTAR');

  // ── Pestañas (Tabs) ─────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<
    'proveedores' | 'compliance' | 'manuales'
  >('proveedores');

  // ── Carga de datos ──────────────────────────────────────────────────
  const loadUser = useCallback(async () => {
    setIsLoadingUser(true);
    try {
      const data = await adminUsersService.getUserById(userId);
      setUser(data);
    } catch (err) {
      toast.error('Error al cargar usuario', {
        description: (err as Error).message,
      });
    } finally {
      setIsLoadingUser(false);
    }
  }, [userId]);

  const loadNotes = useCallback(async () => {
    setIsLoadingNotes(true);
    try {
      const data = await adminUsersService.getUserNotes(userId);
      setNotes(data);
    } catch (err) {
      toast.error('Error al cargar notas', {
        description: (err as Error).message,
      });
    } finally {
      setIsLoadingNotes(false);
    }
  }, [userId]);

  const loadProviders = useCallback(async () => {
    setIsLoadingProviders(true);
    try {
      const result = await adminUsersService.getUserProviders(
        userId,
        providersPage,
        providersPageSize
      );
      setProviders(result.items);
      setProvidersTotal(result.pagination.total);
    } catch (err) {
      toast.error('Error al cargar proveedores', {
        description: (err as Error).message,
      });
    } finally {
      setIsLoadingProviders(false);
    }
  }, [userId, providersPage, providersPageSize]);

  const loadCompliance = useCallback(async () => {
    setIsLoadingCompliance(true);
    try {
      const result = await adminUsersService.getUserCompliance(
        userId,
        compliancePage,
        compliancePageSize
      );
      setCompliance(result.items);
      setComplianceTotal(result.pagination.total);
    } catch (err) {
      toast.error('Error al cargar compliance', {
        description: (err as Error).message,
      });
    } finally {
      setIsLoadingCompliance(false);
    }
  }, [userId, compliancePage, compliancePageSize]);

  const loadManuals = useCallback(async () => {
    setIsLoadingManuals(true);
    try {
      const result = await adminUsersService.getUserManuals(
        userId,
        manualsPage,
        manualsPageSize
      );
      setManuals(result.items);
      setManualsTotal(result.pagination.total);
    } catch (err) {
      toast.error('Error al cargar manuales', {
        description: (err as Error).message,
      });
    } finally {
      setIsLoadingManuals(false);
    }
  }, [userId, manualsPage, manualsPageSize]);

  // Sincronizar etiqueta seleccionada con la última nota cuando se cargan
  useEffect(() => {
    if (notes.length > 0) {
      setSelectedEtiqueta(notes[0].etiqueta);
    }
  }, [notes]);

  useEffect(() => {
    loadUser();
    loadNotes();
    loadProviders();
    loadCompliance();
    loadManuals();
  }, [loadUser, loadNotes, loadProviders, loadCompliance, loadManuals]);

  // ── Handlers ────────────────────────────────────────────────────────
  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) return;

    setIsSendingNote(true);
    try {
      await adminUsersService.createNote(userId, {
        contenido: newNoteContent.trim(),
        etiqueta: selectedEtiqueta,
      });
      toast.success('Nota creada correctamente');
      setNewNoteContent('');
      loadNotes();
    } catch (err) {
      toast.error('Error al crear nota', {
        description: (err as Error).message,
      });
    } finally {
      setIsSendingNote(false);
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editContent.trim()) return;

    setIsSavingEdit(true);
    try {
      await adminUsersService.updateNote(noteId, {
        contenido: editContent.trim(),
        etiqueta: editEtiqueta,
      });
      toast.success('Nota actualizada');
      setEditingNoteId(null);
      loadNotes();
    } catch (err) {
      toast.error('Error al actualizar nota', {
        description: (err as Error).message,
      });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    setDeletingNoteId(noteId);
    try {
      await adminUsersService.deleteNote(noteId);
      toast.success('Nota eliminada');
      loadNotes();
    } catch (err) {
      toast.error('Error al eliminar nota', {
        description: (err as Error).message,
      });
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleDownloadCompliance = async (complianceId: string) => {
    setDownloadingComplianceId(complianceId);
    try {
      await adminUsersService.downloadCompliancePDF(userId, complianceId);
      toast.success('Descarga iniciada exitosamente');
    } catch (err) {
      toast.error('Error al descargar el compliance', {
        description: (err as Error).message,
      });
    } finally {
      setDownloadingComplianceId(null);
    }
  };

  const handleResendCompliance = async (complianceId: string) => {
    setResendingComplianceId(complianceId);
    try {
      await adminUsersService.resendCompliance(complianceId);
      toast.success('Informe de compliance reenviado exitosamente');
    } catch (err) {
      toast.error('Error al reenviar el compliance', {
        description: (err as Error).message,
      });
    } finally {
      setResendingComplianceId(null);
    }
  };

  const handleResendManual = async (manualId: string) => {
    setResendingManualId(manualId);
    try {
      await adminUsersService.resendManual(manualId);
      toast.success('Manual reenviado exitosamente');
    } catch (err) {
      toast.error('Error al reenviar el manual', {
        description: (err as Error).message,
      });
    } finally {
      setResendingManualId(null);
    }
  };

  const handleDownloadManual = async (manualId: string) => {
    setDownloadingManualId(manualId);
    try {
      await adminUsersService.downloadManualPDF(userId, manualId);
      toast.success('Descarga del manual iniciada exitosamente');
    } catch (err) {
      toast.error('Error al descargar el manual', {
        description: (err as Error).message,
      });
    } finally {
      setDownloadingManualId(null);
    }
  };

  const startEditing = (note: UserNote) => {
    setEditingNoteId(note.id);
    setEditContent(note.contenido);
    setEditEtiqueta(note.etiqueta);
  };

  // ── Helpers ─────────────────────────────────────────────────────────
  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const getEtiquetaLabel = (value: string) => {
    return ETIQUETAS.find((e) => e.value === value)?.label ?? value;
  };

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">
      {/* Header con botón volver */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-[#005282] hover:bg-[#005282]/10"
          onClick={() => router.push('/admin/dashboard/usuarios')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-[#005282]">
          Detalle de Usuario
        </h1>
      </div>

      {/* Card: Avatar + Nombre + Email */}
      <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
        <CardContent className="p-6">
          {isLoadingUser ? (
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-[#0091be]/20">
                <AvatarFallback className="bg-[#005282] text-white text-lg font-semibold">
                  {getInitials(user.first_name, user.last_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {user.first_name} {user.last_name}
                </h2>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No se encontró información del usuario.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Grid: Información General + Gestión Operativa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Información General ──────────────────────────────────── */}
        <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
              Información General
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-[#005282]"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoadingUser ? (
              <div className="grid grid-cols-2 gap-y-5 gap-x-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            ) : user ? (
              <div className="grid grid-cols-2 gap-y-5 gap-x-6">
                {/* Nombre Completo */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Nombre Completo
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <span className="text-[#0091be]">👤</span>
                    {user.first_name} {user.last_name}
                  </div>
                </div>

                {/* ID del Sistema */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    ID del Sistema
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <Fingerprint className="h-4 w-4 text-[#0091be]" />
                    <span className="truncate max-w-[160px]">{user.id}</span>
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Teléfono
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <Phone className="h-4 w-4 text-[#0091be]" />
                    {user.telefono || '—'}
                  </div>
                </div>

                {/* Ubicación (placeholder — no viene del endpoint) */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Ubicación
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <MapPin className="h-4 w-4 text-[#0091be]" />—
                  </div>
                </div>

                {/* Institución */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Institución
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <Building2 className="h-4 w-4 text-[#0091be]" />
                    <span className="line-clamp-2">
                      {user.nombre_institucion_ente || '—'}
                    </span>
                  </div>
                </div>

                {/* Cargo */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Cargo
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <Briefcase className="h-4 w-4 text-[#0091be]" />
                    {user.cargo || '—'}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Sin datos disponibles.
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Gestión Operativa (CRM) ─────────────────────────────── */}
        <Card className="border border-gray-200 shadow-sm bg-white rounded-xl flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Gestión Operativa
            </CardTitle>

            {/* Estado de contacto (badges) */}
            <div className="mt-2">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Estado de Contacto
              </p>
              <div className="flex flex-wrap gap-2">
                {ETIQUETAS.map((et) => (
                  <EtiquetaBadge
                    key={et.value}
                    etiqueta={et}
                    selected={selectedEtiqueta === et.value}
                    onClick={() => setSelectedEtiqueta(et.value)}
                  />
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col pt-0">
            {/* Título sección notas */}
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-gray-500" />
              <p className="text-sm font-medium text-gray-700">
                Notas Internas (CRM)
              </p>
            </div>

            {/* Lista de notas */}
            <ScrollArea className="flex-1 min-h-[180px] max-h-[280px] border border-gray-100 rounded-lg bg-gray-50/50 p-3">
              {isLoadingNotes ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : notes.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[120px] text-sm text-muted-foreground">
                  No hay notas registradas para este usuario
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs"
                    >
                      {editingNoteId === note.id ? (
                        /* ── Modo edición ──────────────────── */
                        <div className="space-y-2">
                          <textarea
                            className="w-full text-sm border border-gray-200 rounded-md p-2 resize-none focus:outline-none focus:ring-1 focus:ring-[#0091be] focus:border-[#0091be]"
                            rows={2}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                          />
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {ETIQUETAS.map((et) => (
                              <EtiquetaBadge
                                key={et.value}
                                etiqueta={et}
                                selected={editEtiqueta === et.value}
                                onClick={() => setEditEtiqueta(et.value)}
                              />
                            ))}
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingNoteId(null)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              size="sm"
                              className="bg-[#0091be] hover:bg-[#007da6] text-white"
                              disabled={isSavingEdit}
                              onClick={() => handleUpdateNote(note.id)}
                            >
                              {isSavingEdit ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                              ) : null}
                              Guardar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        /* ── Modo lectura ──────────────────── */
                        <>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-[#005282]">
                                  {note.autor_nombre || 'Sistema'}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  {getEtiquetaLabel(note.etiqueta)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {note.contenido}
                              </p>
                              <p className="text-[11px] text-gray-400 mt-1">
                                {new Date(
                                  note.fecha_creacion
                                ).toLocaleDateString('es-VE', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-400 hover:text-[#0091be]"
                                onClick={() => startEditing(note)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-400 hover:text-red-500"
                                disabled={deletingNoteId === note.id}
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                {deletingNoteId === note.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Input para nueva nota */}
            <div className="flex items-center gap-2 mt-3">
              <input
                type="text"
                placeholder="Añadir una nota..."
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#0091be] focus:border-[#0091be] bg-white"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCreateNote();
                  }
                }}
              />
              <Button
                size="icon"
                className="h-10 w-10 bg-[#0091be] hover:bg-[#007da6] text-white rounded-lg shrink-0"
                disabled={isSendingNote || !newNoteContent.trim()}
                onClick={handleCreateNote}
              >
                {isSendingNote ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Detalles Específicos unificados con Tabs ─────────────────── */}
      <Card className="border border-gray-200 shadow-sm bg-white rounded-xl overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-3 gap-4">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('proveedores')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  activeTab === 'proveedores'
                    ? 'bg-white text-[#0091be] shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Building2 className="h-4 w-4" />
                Proveedores ({providersTotal})
              </button>
              <button
                onClick={() => setActiveTab('compliance')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  activeTab === 'compliance'
                    ? 'bg-white text-[#0091be] shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Compliance ({complianceTotal})
              </button>
              <button
                onClick={() => setActiveTab('manuales')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  activeTab === 'manuales'
                    ? 'bg-white text-[#0091be] shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Manuales ({manualsTotal})
              </button>
            </div>

            {/* Selectores de paginación por pestaña */}
            <div>
              {activeTab === 'proveedores' && (
                <select
                  value={providersPageSize}
                  onChange={(e) => {
                    setProvidersPageSize(Number(e.target.value));
                    setProvidersPage(1);
                  }}
                  className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#0091be]"
                >
                  <option value={5}>5 por página</option>
                  <option value={10}>10 por página</option>
                  <option value={20}>20 por página</option>
                </select>
              )}
              {activeTab === 'compliance' && (
                <select
                  value={compliancePageSize}
                  onChange={(e) => {
                    setCompliancePageSize(Number(e.target.value));
                    setCompliancePage(1);
                  }}
                  className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#0091be]"
                >
                  <option value={5}>5 por página</option>
                  <option value={10}>10 por página</option>
                  <option value={20}>20 por página</option>
                </select>
              )}
              {activeTab === 'manuales' && (
                <select
                  value={manualsPageSize}
                  onChange={(e) => {
                    setManualsPageSize(Number(e.target.value));
                    setManualsPage(1);
                  }}
                  className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#0091be]"
                >
                  <option value={5}>5 por página</option>
                  <option value={10}>10 por página</option>
                  <option value={20}>20 por página</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Contenido de la pestaña activa */}
        <div className="animate-in fade-in duration-300">
          {activeTab === 'proveedores' && (
            <>
              <CardContent className="pt-4">
                {isLoadingProviders ? (
                  <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))}
                  </div>
                ) : providers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No hay proveedores registrados para este usuario.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {providers.map((p) => (
                      <div
                        key={p.id}
                        className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-5 gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-[#005282]">
                              {p.nombre_proveedor}
                            </h3>
                            <p className="text-sm text-gray-500 mt-0.5">
                              RIF:{' '}
                              <span className="font-medium text-gray-700">
                                {p.rif_proveedor}
                              </span>{' '}
                              • {p.tipo_persona} ({p.tipo_entidad_juridica})
                            </p>
                          </div>
                          <Badge
                            variant={p.activo ? 'default' : 'secondary'}
                            className={
                              p.activo
                                ? 'bg-emerald-500 hover:bg-emerald-600'
                                : ''
                            }
                          >
                            {p.activo ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                          {/* Contacto y Ubicación */}
                          <div className="space-y-3">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                              Contacto y Ubicación
                            </h4>
                            <div className="text-sm text-gray-700 space-y-2">
                              <p className="flex items-start gap-2">
                                <Mail className="w-4 h-4 text-[#0091be] shrink-0 mt-0.5" />
                                <span className="break-all">
                                  {p.correo_proveedor}
                                </span>
                              </p>
                              <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#0091be]" />
                                {p.telefono_proveedor}
                              </p>
                              <p className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-[#0091be] shrink-0 mt-0.5" />
                                <span className="leading-snug">
                                  {p.estado}, {p.municipio}, {p.parroquia}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500 pl-6 border-l-2 border-gray-200 ml-1">
                                {p.direccion_fiscal}
                              </p>
                            </div>
                          </div>

                          {/* Representante Legal */}
                          <div className="space-y-3">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                              Representante Legal
                            </h4>
                            <div className="text-sm text-gray-700 space-y-2">
                              <p className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-[#0091be]" />
                                {p.nombre_rep_legal}
                              </p>
                              <p className="flex items-center gap-2">
                                <Fingerprint className="w-4 h-4 text-[#0091be]" />
                                {p.cedula_rep_legal}
                              </p>
                              <p className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#0091be]" />
                                Registrado:{' '}
                                {new Date(
                                  p.fecha_registro
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Comercial y Financiero */}
                          <div className="space-y-3">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                              Comercial y Financiero
                            </h4>
                            <div className="text-sm text-gray-700 space-y-2">
                              <p className="flex items-start gap-2">
                                <Briefcase className="w-4 h-4 text-[#0091be] shrink-0 mt-0.5" />
                                <span className="line-clamp-2">
                                  {p.actividad_comercial_principal ||
                                    'No especificada'}
                                </span>
                              </p>
                              <p className="flex items-start gap-2">
                                <Tag className="w-4 h-4 text-[#0091be] shrink-0 mt-0.5" />
                                <span>
                                  {p.area_especialidad || 'Sin especialidad'}
                                  <span className="text-gray-400 text-xs ml-1">
                                    ({p.anos_experiencia} años exp.)
                                  </span>
                                </span>
                              </p>
                              <p className="flex items-center gap-2">
                                <BadgeDollarSign className="w-4 h-4 text-[#0091be]" />
                                Patrimonio: Bs. {p.patrimonio_reportado}
                              </p>
                              <p className="text-xs text-gray-500 pl-6">
                                Nivel Contratación: {p.nivel_contratacion}
                              </p>
                            </div>
                          </div>

                          {/* Requisitos */}
                          <div className="space-y-3">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                              Requisitos Legales
                            </h4>
                            <div className="text-sm space-y-2.5">
                              <p className="flex items-center gap-2">
                                {p.tiene_rnc ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                                <span
                                  className={
                                    p.tiene_rnc
                                      ? 'text-gray-800 font-medium'
                                      : 'text-gray-500 line-through'
                                  }
                                >
                                  Inscripción en RNC
                                </span>
                              </p>
                              <p className="flex items-center gap-2">
                                {p.tiene_solvencia_laboral ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                                <span
                                  className={
                                    p.tiene_solvencia_laboral
                                      ? 'text-gray-800 font-medium'
                                      : 'text-gray-500 line-through'
                                  }
                                >
                                  Solvencia Laboral
                                </span>
                              </p>
                              <p className="flex items-center gap-2">
                                {p.tiene_licencia_municipal ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                                <span
                                  className={
                                    p.tiene_licencia_municipal
                                      ? 'text-gray-800 font-medium'
                                      : 'text-gray-500 line-through'
                                  }
                                >
                                  Licencia Municipal
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {providersTotal > providersPageSize && (
                <div className="flex items-center justify-between px-6 pb-4 pt-2 border-t border-gray-100 mt-4">
                  <p className="text-sm text-gray-500">
                    Mostrando {(providersPage - 1) * providersPageSize + 1} -{' '}
                    {Math.min(
                      providersPage * providersPageSize,
                      providersTotal
                    )}{' '}
                    de {providersTotal}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={providersPage === 1}
                      onClick={() => setProvidersPage((p) => p - 1)}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      {providersPage} /{' '}
                      {Math.ceil(providersTotal / providersPageSize)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        providersPage >=
                        Math.ceil(providersTotal / providersPageSize)
                      }
                      onClick={() => setProvidersPage((p) => p + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'compliance' && (
            <>
              <CardContent className="pt-4">
                {isLoadingCompliance ? (
                  <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full rounded-xl" />
                    ))}
                  </div>
                ) : compliance.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No hay informes de compliance asociados.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {compliance.map((c) => (
                      <div
                        key={c.id}
                        className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                          <div>
                            <h3 className="text-lg font-bold text-[#005282]">
                              {c.nombre_organo_entidad}
                            </h3>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {c.nombre_unidad_revisora}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge
                              variant="outline"
                              className="border-[#0091be] text-[#0091be] bg-blue-50/50"
                            >
                              {c.nomenclatura}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-3 gap-1.5 border-[#0091be] text-[#0091be] hover:bg-[#0091be] hover:text-white transition-colors"
                              disabled={downloadingComplianceId === c.id}
                              onClick={() => handleDownloadCompliance(c.id)}
                            >
                              {downloadingComplianceId === c.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Download className="h-3.5 w-3.5" />
                              )}
                              <span className="text-xs">Descargar PDF</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-3 gap-1.5 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                              disabled={resendingComplianceId === c.id}
                              onClick={() => handleResendCompliance(c.id)}
                            >
                              {resendingComplianceId === c.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Send className="h-3.5 w-3.5" />
                              )}
                              <span className="text-xs">Reenviar</span>
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2 text-sm text-gray-700">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                              Detalles de Revisión
                            </p>
                            <p className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-[#0091be]" />
                              Revisor ID:{' '}
                              <span className="font-medium">
                                {c.usuario_revisor}
                              </span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[#0091be]" />
                              Fecha Revisión:{' '}
                              <span className="font-medium">
                                {new Date(
                                  c.fecha_revision
                                ).toLocaleDateString()}
                              </span>
                            </p>
                          </div>

                          <div className="space-y-2 text-sm text-gray-700">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                              Contacto
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-[#0091be]" />
                              {c.persona_contacto}
                            </p>
                          </div>

                          <div className="space-y-2 text-sm text-gray-700">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                              Registro del Sistema
                            </p>
                            <p className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[#0091be]" />
                              Creación:{' '}
                              {new Date(c.fecha_creacion).toLocaleDateString()}
                            </p>
                            <p className="flex items-center gap-2">
                              <Fingerprint className="w-4 h-4 text-[#0091be]" />
                              <span
                                className="truncate max-w-[200px]"
                                title={c.id}
                              >
                                ID: {c.id}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {complianceTotal > compliancePageSize && (
                <div className="flex items-center justify-between px-6 pb-4 pt-2 border-t border-gray-100 mt-4">
                  <p className="text-sm text-gray-500">
                    Mostrando {(compliancePage - 1) * compliancePageSize + 1} -{' '}
                    {Math.min(
                      compliancePage * compliancePageSize,
                      complianceTotal
                    )}{' '}
                    de {complianceTotal}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={compliancePage === 1}
                      onClick={() => setCompliancePage((p) => p - 1)}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      {compliancePage} /{' '}
                      {Math.ceil(complianceTotal / compliancePageSize)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        compliancePage >=
                        Math.ceil(complianceTotal / compliancePageSize)
                      }
                      onClick={() => setCompliancePage((p) => p + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'manuales' && (
            <>
              <CardContent className="pt-4">
                {isLoadingManuals ? (
                  <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full rounded-xl" />
                    ))}
                  </div>
                ) : manuals.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No hay manuales generados para este usuario.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {manuals.map((m) => (
                      <div
                        key={m.id}
                        className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                          <div>
                            <h3 className="text-lg font-bold text-[#005282]">
                              {m.nombre_institucion_ente}
                            </h3>
                            <p className="text-sm font-medium text-gray-500 mt-0.5">
                              Siglas:{' '}
                              <span className="text-[#0091be]">
                                {m.siglas_institucion_ente}
                              </span>
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-3 gap-1.5 border-[#0091be] text-[#0091be] hover:bg-[#0091be] hover:text-white transition-colors"
                              disabled={downloadingManualId === m.id}
                              onClick={() => handleDownloadManual(m.id)}
                            >
                              {downloadingManualId === m.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Download className="h-3.5 w-3.5" />
                              )}
                              <span className="text-xs">Descargar PDF</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-3 gap-1.5 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                              disabled={resendingManualId === m.id}
                              onClick={() => handleResendManual(m.id)}
                            >
                              {resendingManualId === m.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Send className="h-3.5 w-3.5" />
                              )}
                              <span className="text-xs">Reenviar</span>
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2 text-sm text-gray-700">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                              Unidad de Administración y Finanzas
                            </p>
                            <p className="flex items-start gap-2">
                              <Building2 className="w-4 h-4 text-[#0091be] shrink-0 mt-0.5" />
                              <span className="leading-tight">
                                {m.nombre_unidad_admin_financiera}
                              </span>
                            </p>
                          </div>

                          <div className="space-y-2 text-sm text-gray-700">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                              Unidad de Sistemas / Tecnología
                            </p>
                            <p className="flex items-start gap-2">
                              <Building2 className="w-4 h-4 text-[#0091be] shrink-0 mt-0.5" />
                              <span className="leading-tight">
                                {m.nombre_unidad_sistemas_tecnologia}
                              </span>
                            </p>
                          </div>

                          <div className="space-y-2 text-sm text-gray-700">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                              Contacto de Recepción
                            </p>
                            <p className="flex items-center gap-2 font-medium">
                              <Mail className="w-4 h-4 text-[#0091be]" />
                              {m.correo_electronico_manual}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {manualsTotal > manualsPageSize && (
                <div className="flex items-center justify-between px-6 pb-4 pt-2 border-t border-gray-100 mt-4">
                  <p className="text-sm text-gray-500">
                    Mostrando {(manualsPage - 1) * manualsPageSize + 1} -{' '}
                    {Math.min(manualsPage * manualsPageSize, manualsTotal)} de{' '}
                    {manualsTotal}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={manualsPage === 1}
                      onClick={() => setManualsPage((p) => p - 1)}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      {manualsPage} /{' '}
                      {Math.ceil(manualsTotal / manualsPageSize)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        manualsPage >= Math.ceil(manualsTotal / manualsPageSize)
                      }
                      onClick={() => setManualsPage((p) => p + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
