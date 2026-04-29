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
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { adminUsersService } from '../services/admin.service';
import type { AdminUser, UserNote } from '../types/admin-users.types';

// ════════════════════════════════════════════════════════════════════════
// Etiquetas CRM
// ════════════════════════════════════════════════════════════════════════

const ETIQUETAS = [
  { value: 'POR_CONTACTAR', label: 'Por contactar' },
  { value: 'CONTACTADO', label: 'Contactado' },
  { value: 'EN_SEGUIMIENTO', label: 'En seguimiento' },
  { value: 'CERRADO', label: 'Cerrado' },
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
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);

  // ── Formulario de nota ──────────────────────────────────────────────
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isSendingNote, setIsSendingNote] = useState(false);

  // ── Edición de nota ─────────────────────────────────────────────────
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editEtiqueta, setEditEtiqueta] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // ── Eliminación ─────────────────────────────────────────────────────
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  // ── Etiqueta seleccionada (estado de contacto) ──────────────────────
  const [selectedEtiqueta, setSelectedEtiqueta] = useState('POR_CONTACTAR');

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

  // Sincronizar etiqueta seleccionada con la última nota cuando se cargan
  useEffect(() => {
    if (notes.length > 0) {
      setSelectedEtiqueta(notes[0].etiqueta);
    }
  }, [notes]);

  useEffect(() => {
    loadUser();
    loadNotes();
  }, [loadUser, loadNotes]);

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
    </div>
  );
}
