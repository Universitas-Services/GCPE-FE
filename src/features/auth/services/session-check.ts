import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Tiempo máximo (ms) para esperar la respuesta del backend.
 */
const VERIFY_TIMEOUT_MS = 10_000;

/**
 * Resultado de la verificación de sesión server-side.
 */
export interface SessionVerifyResult {
  /** Si la sesión es válida (ya sea directamente o tras un refresh exitoso). */
  valid: boolean;
  /** Tokens nuevos obtenidos del refresh (solo si hubo renovación). */
  refreshedTokens?: {
    access: string;
    refresh?: string;
  };
}

/**
 * Verifica la sesión del usuario contra el backend (Django).
 *
 * Capa 2 de "Defensa en Profundidad":
 * - Capa 1 (proxy.ts): Verifica existencia de la cookie (chequeo optimista).
 * - Capa 2 (esta función): Valida que el token sea real, vigente y no revocado.
 *
 * Flujo de recuperación:
 * 1. Verificar accessToken → si OK, retorna { valid: true }.
 * 2. Si falla, intentar renovar con refreshToken.
 * 3. Si refresh OK, retorna { valid: true, refreshedTokens: { access, refresh? } }.
 * 4. Si todo falla, retorna { valid: false }.
 */
export async function verifyServerSession(): Promise<SessionVerifyResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    return { valid: false };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

    const response = await fetch(`${API_URL}/api/token/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return { valid: true };
    }

    // Token inválido → intentar renovar con refreshToken
    console.warn(
      '[ServerAuth] Token inválido (status %d) — intentando refresh...',
      response.status
    );
    return await attemptServerRefresh(cookieStore);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.warn(
        '[ServerAuth] Timeout al verificar sesión — asumiendo válida'
      );
      return { valid: true };
    }

    console.error('[ServerAuth] Error al verificar sesión:', error);
    return { valid: true };
  }
}

/**
 * Intenta renovar el accessToken usando el refreshToken (server-side).
 * Retorna los tokens nuevos para que un Client Component los guarde.
 */
async function attemptServerRefresh(
  cookieStore: Awaited<ReturnType<typeof cookies>>
): Promise<SessionVerifyResult> {
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    console.warn('[ServerAuth] No hay refreshToken — sesión inválida');
    return { valid: false };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

    const response = await fetch(`${API_URL}/api/token/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      console.info(
        '[ServerAuth] Token renovado exitosamente — enviando al cliente para guardar'
      );
      return {
        valid: true,
        refreshedTokens: {
          access: data.access,
          refresh: data.refresh, // puede ser undefined si SimpleJWT no rota refresh
        },
      };
    }

    console.warn(
      '[ServerAuth] Refresh token rechazado (status %d) — sesión expirada',
      response.status
    );
    return { valid: false };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.warn('[ServerAuth] Timeout en refresh — asumiendo válida');
      return { valid: true };
    }

    console.error('[ServerAuth] Error en refresh:', error);
    return { valid: true };
  }
}
