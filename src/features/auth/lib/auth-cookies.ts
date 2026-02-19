/**
 * Módulo dedicado a la gestión de cookies de autenticación (client-side).
 *
 * Centraliza las operaciones de set/delete de cookies con configuraciones
 * de seguridad consistentes, siguiendo las recomendaciones de Next.js:
 * @see https://nextjs.org/docs/app/building-your-application/authentication#3-setting-cookies-recommended-options
 *
 * Nota: Este módulo usa `document.cookie` (client-side).
 * Para lectura de cookies server-side, usar `cookies()` de `next/headers`.
 */

// Verificación de entorno (seguridad para Next.js SSR)
const isBrowser = typeof window !== 'undefined';

// Nombres de las cookies (centralizados para evitar errores de escritura)
const COOKIE_NAMES = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

// Configuración por defecto para cookies de sesión
const COOKIE_OPTIONS = {
  path: '/',
  maxAge: 86400, // 1 día (en segundos) — ajustar según duración real del JWT
  sameSite: 'Lax' as const,
};

/**
 * Setea una cookie con las opciones de seguridad estándar.
 */
function setCookie(name: string, value: string): void {
  if (!isBrowser) return;
  document.cookie = `${name}=${value}; path=${COOKIE_OPTIONS.path}; max-age=${COOKIE_OPTIONS.maxAge}; SameSite=${COOKIE_OPTIONS.sameSite}`;
}

/**
 * Elimina una cookie seteando su fecha de expiración en el pasado.
 */
function deleteCookie(name: string): void {
  if (!isBrowser) return;
  document.cookie = `${name}=; path=${COOKIE_OPTIONS.path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export const authCookies = {
  /**
   * Guarda los tokens de autenticación como cookies.
   * Esto permite que el Proxy (Capa 1) y el ServerAuthGuard (Capa 2) los lean.
   */
  setAuthCookies: (accessToken: string, refreshToken?: string): void => {
    setCookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      setCookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken);
    }
  },

  /**
   * Elimina todas las cookies de autenticación.
   * Llamar durante el proceso de logout.
   */
  clearAuthCookies: (): void => {
    deleteCookie(COOKIE_NAMES.ACCESS_TOKEN);
    deleteCookie(COOKIE_NAMES.REFRESH_TOKEN);
  },
};
