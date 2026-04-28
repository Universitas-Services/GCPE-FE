import { fetchApi } from '@/lib/api-client';
import type {
  GetUsersParams,
  PaginatedUsersResponse,
  UserProvider,
  UserCompliance,
  UserManual,
  ResendResponse,
} from '../types/admin-users.types';

/**
 * Helper para manejar errores de la API.
 * Si la respuesta es 401 (sesión expirada), redirige al login.
 */
async function handleApiError(
  response: Response,
  fallbackMessage: string
): Promise<never> {
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Sesión expirada. Redirigiendo al inicio de sesión...');
  }

  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.detail || fallbackMessage);
}

/**
 * Extrae el array de items de una respuesta que puede ser
 * un array directo o un objeto { items: [...] }.
 */
function extractItems<T>(data: T[] | { items?: T[] }): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
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
  async getUserProviders(userId: number): Promise<UserProvider[]> {
    const response = await fetchApi(`/api/usuarios/${userId}/proveedores`);

    if (!response.ok) {
      await handleApiError(
        response,
        'No se pudieron obtener los proveedores del usuario'
      );
    }

    const data = await response.json();
    return extractItems(data);
  },

  // ── Detalle: Compliance de un usuario ─────────────────────────────────
  async getUserCompliance(userId: number): Promise<UserCompliance[]> {
    const response = await fetchApi(`/api/usuarios/${userId}/compliance`);

    if (!response.ok) {
      await handleApiError(
        response,
        'No se pudieron obtener los informes de compliance del usuario'
      );
    }

    const data = await response.json();
    return extractItems(data);
  },

  // ── Acción: Reenviar compliance ───────────────────────────────────────
  async resendCompliance(complianceId: number): Promise<ResendResponse> {
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

  // ── Detalle: Manuales de un usuario ───────────────────────────────────
  async getUserManuals(userId: number): Promise<UserManual[]> {
    const response = await fetchApi(`/api/usuarios/${userId}/manuales`);

    if (!response.ok) {
      await handleApiError(
        response,
        'No se pudieron obtener los manuales del usuario'
      );
    }

    const data = await response.json();
    return extractItems(data);
  },

  // ── Acción: Reenviar manual ───────────────────────────────────────────
  async resendManual(manualId: number): Promise<ResendResponse> {
    const response = await fetchApi(`/api/manuales/${manualId}/reenviar`, {
      method: 'POST',
    });

    if (!response.ok) {
      await handleApiError(response, 'Error al reenviar el manual');
    }

    return response.json();
  },
};
