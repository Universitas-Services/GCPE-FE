import { fetchApi } from '@/lib/api-client';
import type {
  GetUsersParams,
  PaginatedUsersResponse,
  AdminUser,
  UserProvider,
  UserCompliance,
  UserManual,
  UserNote,
  NotePayload,
  ResendResponse,
  PaginatedResponse,
} from '../types/admin-users.types';

/**
 * Helper para manejar errores de la API.
 * El manejo de 401 (sesión expirada) se realiza de forma centralizada
 * en fetchApi, que intenta refresh automático antes de fallar.
 */
async function handleApiError(
  response: Response,
  fallbackMessage: string
): Promise<never> {
  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.detail || fallbackMessage);
}

/**
 * Extrae el array de items de una respuesta que puede ser
 * un array directo, un objeto { items: [...] } o el formato paginado del backend.
 */
function extractItems<T>(
  data: T[] | { items?: T[] } | PaginatedResponse<T>
): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

/**
 * Extrae la metadata de paginación de una respuesta del backend.
 */
function extractPagination<T>(data: unknown): {
  total: number;
  page: number;
  page_size: number;
  pages: number;
} {
  if (data && typeof data === 'object' && 'total' in data) {
    return {
      total: (data as PaginatedResponse<T>).total ?? 0,
      page: (data as PaginatedResponse<T>).page ?? 1,
      page_size: (data as PaginatedResponse<T>).page_size ?? 10,
      pages: (data as PaginatedResponse<T>).pages ?? 1,
    };
  }
  return { total: 0, page: 1, page_size: 10, pages: 1 };
}

/**
 * Servicio de administración de usuarios.
 *
 * Todas las peticiones se hacen relativas al BFF de Next.js;
 * NO se inyectan tokens: las cookies HttpOnly se incluyen
 * automáticamente por el navegador.
 */
export const adminUsersService = {
  // ── Listado de usuarios (con filtros opcionales) ──────────────────────
  async getUsers(params?: GetUsersParams): Promise<PaginatedUsersResponse> {
    const query = new URLSearchParams();

    if (params?.search) query.set('q', params.search);
    if (params?.ordering) query.set('ordering', params.ordering);
    if (params?.page) query.set('page', String(params.page));
    if (params?.page_size) query.set('page_size', String(params.page_size));

    const qs = query.toString();
    const url = `/api/usuarios${qs ? `?${qs}` : ''}`;

    const response = await fetchApi(url);

    if (!response.ok) {
      await handleApiError(response, 'No se pudieron obtener los usuarios');
    }

    const data = await response.json();

    // Soportar formato del backend real (items/total) y DRF (results/count) y arrays directos
    if (Array.isArray(data)) {
      return {
        count: data.length,
        next: null,
        previous: null,
        results: data,
      };
    }

    // Backend real usa { items, total, page, page_size, pages }
    const results = data.items ?? data.results ?? [];
    const count = data.total ?? data.count ?? 0;

    return {
      count,
      next: data.next ?? null,
      previous: data.previous ?? null,
      results: Array.isArray(results) ? results : [],
    };
  },

  // ── Detalle: Proveedores de un usuario ────────────────────────────────
  async getUserProviders(
    userId: number,
    page?: number,
    page_size?: number
  ): Promise<{
    items: UserProvider[];
    pagination: {
      total: number;
      page: number;
      page_size: number;
      pages: number;
    };
  }> {
    const query = new URLSearchParams();
    if (page) query.set('page', String(page));
    if (page_size) query.set('page_size', String(page_size));

    const qs = query.toString();
    const response = await fetchApi(
      `/api/usuarios/${userId}/proveedores${qs ? `?${qs}` : ''}`
    );

    if (!response.ok) {
      await handleApiError(
        response,
        'No se pudieron obtener los proveedores del usuario'
      );
    }

    const data = await response.json();
    return {
      items: extractItems(data),
      pagination: extractPagination(data),
    };
  },

  // ── Detalle: Compliance de un usuario ─────────────────────────────────
  async getUserCompliance(
    userId: number,
    page?: number,
    page_size?: number
  ): Promise<{
    items: UserCompliance[];
    pagination: {
      total: number;
      page: number;
      page_size: number;
      pages: number;
    };
  }> {
    const query = new URLSearchParams();
    if (page) query.set('page', String(page));
    if (page_size) query.set('page_size', String(page_size));

    const qs = query.toString();
    const response = await fetchApi(
      `/api/usuarios/${userId}/compliance${qs ? `?${qs}` : ''}`
    );

    if (!response.ok) {
      await handleApiError(
        response,
        'No se pudieron obtener los informes de compliance del usuario'
      );
    }

    const data = await response.json();
    return {
      items: extractItems(data),
      pagination: extractPagination(data),
    };
  },

  // ── Acción: Reenviar compliance ───────────────────────────────────────
  async resendCompliance(complianceId: string): Promise<ResendResponse> {
    const response = await fetchApi(
      `/api/compliance/${complianceId}/reenviar`,
      { method: 'POST' }
    );

    if (!response.ok) {
      await handleApiError(
        response,
        'Error al reenviar el informe de compliance'
      );
    }

    return response.json();
  },

  // ── Acción: Descargar PDF de compliance ────────────────────────────────
  async downloadCompliancePDF(
    userId: number,
    complianceId: string
  ): Promise<void> {
    const response = await fetchApi(
      `/api/usuarios/${userId}/compliance/${complianceId}/descargar`
    );

    if (!response.ok) {
      await handleApiError(
        response,
        'Error al descargar el informe de compliance'
      );
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance_${complianceId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // ── Detalle: Manuales de un usuario ───────────────────────────────────
  async getUserManuals(
    userId: number,
    page?: number,
    page_size?: number
  ): Promise<{
    items: UserManual[];
    pagination: {
      total: number;
      page: number;
      page_size: number;
      pages: number;
    };
  }> {
    const query = new URLSearchParams();
    if (page) query.set('page', String(page));
    if (page_size) query.set('page_size', String(page_size));

    const qs = query.toString();
    const response = await fetchApi(
      `/api/usuarios/${userId}/manuales${qs ? `?${qs}` : ''}`
    );

    if (!response.ok) {
      await handleApiError(
        response,
        'No se pudieron obtener los manuales del usuario'
      );
    }

    const data = await response.json();
    return {
      items: extractItems(data),
      pagination: extractPagination(data),
    };
  },

  // ── Acción: Reenviar manual ───────────────────────────────────────────
  async resendManual(manualId: string): Promise<ResendResponse> {
    const response = await fetchApi(`/api/manuales/${manualId}/reenviar`, {
      method: 'POST',
    });

    if (!response.ok) {
      await handleApiError(response, 'Error al reenviar el manual');
    }

    return response.json();
  },

  // ── Acción: Descargar PDF de manual ───────────────────────────────────
  async downloadManualPDF(userId: number, manualId: string): Promise<void> {
    const response = await fetchApi(
      `/api/usuarios/${userId}/manuales/${manualId}/descargar`
    );

    if (!response.ok) {
      await handleApiError(response, 'Error al descargar el manual');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manual_${manualId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // ── Detalle de un usuario por ID ──────────────────────────────────────
  async getUserById(userId: number): Promise<AdminUser> {
    const response = await fetchApi(`/api/usuarios/${userId}`);

    if (!response.ok) {
      await handleApiError(
        response,
        'No se pudo obtener la información del usuario'
      );
    }

    return response.json();
  },

  // ── Notas CRM de un usuario ───────────────────────────────────────────
  async getUserNotes(userId: number): Promise<UserNote[]> {
    const response = await fetchApi(`/api/usuarios/${userId}/notas`);

    if (!response.ok) {
      await handleApiError(
        response,
        'No se pudieron obtener las notas del usuario'
      );
    }

    const data = await response.json();
    return extractItems(data);
  },

  // ── Crear nota ────────────────────────────────────────────────────────
  async createNote(userId: number, payload: NotePayload): Promise<UserNote> {
    const response = await fetchApi(`/api/usuarios/${userId}/notas`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      await handleApiError(response, 'Error al crear la nota');
    }

    return response.json();
  },

  // ── Actualizar nota ───────────────────────────────────────────────────
  async updateNote(noteId: string, payload: NotePayload): Promise<UserNote> {
    const response = await fetchApi(`/api/notas/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      await handleApiError(response, 'Error al actualizar la nota');
    }

    return response.json();
  },

  // ── Eliminar nota ─────────────────────────────────────────────────────
  async deleteNote(noteId: string): Promise<void> {
    const response = await fetchApi(`/api/notas/${noteId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      await handleApiError(response, 'Error al eliminar la nota');
    }
  },
};
