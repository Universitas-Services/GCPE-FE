/**
 * Cliente API con retry transparente para el patrón BFF (Backend-For-Frontend).
 *
 * Cuando una petición recibe un 401 Unauthorized, automáticamente intenta
 * renovar el token llamando a POST /api/auth/refresh y reintenta la petición
 * original. Solo si el refresh falla, se dispara el evento 'session-expired'.
 *
 * Incluye un mecanismo de cola: si múltiples peticiones reciben 401
 * simultáneamente, solo se hace UN refresh y todas esperan el resultado.
 *
 * @example
 * ```ts
 * const response = await fetchApi('/api/proveedores');
 * const data = await response.json();
 * ```
 */

// Endpoints de autenticación que NO deben intentar refresh automático
const AUTH_ENDPOINTS = [
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/refresh',
];

// Singleton: promesa de refresh en curso (evita múltiples refreshes simultáneos)
let refreshPromise: Promise<boolean> | null = null;

/**
 * Intenta renovar el access token usando el refresh token.
 * Retorna true si fue exitoso, false si falló.
 */
async function attemptTokenRefresh(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Gestiona el refresh de tokens con cola.
 * Si ya hay un refresh en curso, espera a que termine en vez de hacer otro.
 */
async function handleTokenRefresh(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = attemptTokenRefresh().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

/**
 * Determina si un endpoint es una ruta de autenticación
 * que no debe intentar refresh automático.
 */
function isAuthEndpoint(endpoint: string): boolean {
  return AUTH_ENDPOINTS.some((ep) => endpoint.startsWith(ep));
}

export async function fetchApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers);

  // Asegurar Content-Type por defecto si hay body
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const fetchOptions: RequestInit = {
    cache: 'no-store',
    ...options,
    headers,
  };

  // La petición se hace RELATIVA al dominio actual de Next.js.
  // Es decir, 'fetch(/api/proveedores)' impactará en nuestro interceptor [...proxy]/route.ts
  const response = await fetch(endpoint, fetchOptions);

  // Si no es 401, retornar directamente
  if (response.status !== 401) {
    return response;
  }

  // Si es un endpoint de auth, no intentar refresh
  if (isAuthEndpoint(endpoint)) {
    return response;
  }

  // Solo intentar refresh en el cliente (browser)
  if (typeof window === 'undefined') {
    return response;
  }

  // Intentar refresh y retry
  const refreshed = await handleTokenRefresh();

  if (refreshed) {
    // Reintentar la petición original con las cookies ya renovadas
    return fetch(endpoint, fetchOptions);
  }

  // El refresh falló: la sesión realmente expiró
  window.dispatchEvent(new CustomEvent('session-expired'));
  return response;
}
