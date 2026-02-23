import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const VERIFY_TIMEOUT_MS = 10_000;

export interface SessionVerifyResult {
  valid: boolean;
  needsRefresh?: boolean;
}

/**
 * Verifica la sesión del usuario contra el backend (Django).
 *
 * Capa 2 de "Defensa en Profundidad":
 * - Capa 1 (proxy.ts): Verifica existencia de la cookie.
 * - Capa 2 (esta función): Valida que el token sea real, vigente y no revocado.
 *
 * Retorna needsRefresh: true si el accessToken es inválido pero existe un refreshToken.
 */
export async function verifyServerSession(): Promise<SessionVerifyResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!token) {
    return { valid: false, needsRefresh: Boolean(refreshToken) };
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

    // Token inválido → necesita refresh si hay refresh token
    console.warn(
      '[ServerAuth] Token inválido (status %d) — solicitando refresh...',
      response.status
    );
    return { valid: false, needsRefresh: Boolean(refreshToken) };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.warn(
        '[ServerAuth] Timeout al verificar sesión — asumiendo válida'
      );
      return { valid: true };
    }

    console.error('[ServerAuth] Error al verificar sesión:', error);
    return { valid: true }; // Fallback optimista si el backend de auth está caído pero Next.js sigue vivo
  }
}
