/**
 * Cliente API con interceptor de renovación automática de tokens.
 *
 * Envuelve el fetch nativo para:
 * 1. Inyectar automáticamente el header Authorization: Bearer <token>
 * 2. Interceptar respuestas 401 y renovar el token via refresh
 * 3. Manejar peticiones concurrentes con un sistema de Lock + Cola
 *
 * @example
 * ```ts
 * const response = await fetchApi('/api/proveedores');
 * const data = await response.json();
 * ```
 */

import { authStorage } from './auth-storage';
import { authService } from '../services/auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Sistema de Lock para peticiones concurrentes ---
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

/**
 * Procesa la cola de peticiones pausadas.
 * - Si se obtuvo un nuevo token, resuelve todas las promesas con ese token.
 * - Si falló el refresh, rechaza todas las promesas.
 */
function processQueue(error: Error | null, token: string | null): void {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
}

/**
 * Wrapper del fetch nativo con interceptor de autenticación.
 *
 * @param endpoint - Ruta relativa al API_URL (ej. '/api/proveedores')
 * @param options - Opciones estándar de RequestInit (method, body, headers, etc.)
 * @returns La respuesta del fetch (original o reintentada con token renovado)
 */
export async function fetchApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  // 1. Inyectar token en los headers si existe
  const accessToken = authStorage.getAccessToken();
  const headers = new Headers(options.headers);

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // Asegurar Content-Type por defecto si hay body
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // 2. Realizar la petición original
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 3. Si NO es 401, retornar tal cual
  if (response.status !== 401) {
    return response;
  }

  // --- A partir de aquí, la respuesta fue 401 (Unauthorized) ---

  // 4. Verificar si hay refresh token disponible
  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken) {
    // Sin refresh token → limpiar sesión y redirigir
    authStorage.clearSession();
    window.location.href = '/login';
    return response;
  }

  // 5. Si YA se está refrescando, encolar esta petición
  if (isRefreshing) {
    return new Promise<Response>((resolve, reject) => {
      failedQueue.push({
        resolve: (newToken: string) => {
          // Reintentar la petición original con el nuevo token
          headers.set('Authorization', `Bearer ${newToken}`);
          resolve(
            fetch(`${API_URL}${endpoint}`, {
              ...options,
              headers,
            })
          );
        },
        reject,
      });
    });
  }

  // 6. Iniciar el proceso de refresh
  isRefreshing = true;

  try {
    const data = await authService.refreshToken(refreshToken);

    // Actualizar tokens en localStorage + cookies
    authStorage.setAccessToken(data.access);
    if (data.refresh) {
      authStorage.setRefreshToken(data.refresh);
    }

    // Resolver la cola de peticiones pausadas con el nuevo token
    processQueue(null, data.access);

    // Reintentar la petición original con el nuevo token
    headers.set('Authorization', `Bearer ${data.access}`);
    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    // El refresh token expiró o fue revocado → limpiar sesión
    processQueue(error as Error, null);
    authStorage.clearSession();
    window.location.href = '/login';
    return response;
  } finally {
    isRefreshing = false;
  }
}
