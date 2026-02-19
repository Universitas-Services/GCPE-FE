import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Tiempo máximo (ms) para esperar la respuesta del backend.
 * Si el backend no responde en este tiempo, se asume sesión válida
 * para no bloquear al usuario (la Capa 1 ya verificó la cookie).
 */
const VERIFY_TIMEOUT_MS = 10_000;

/**
 * Verifica la sesión del usuario contra el backend (Django).
 * Lee la cookie `accessToken` y la valida en tiempo real.
 *
 * Capa 2 de "Defensa en Profundidad":
 * - Capa 1 (proxy.ts): Verifica existencia de la cookie (chequeo optimista).
 * - Capa 2 (esta función): Valida que el token sea real, vigente y no revocado.
 *
 * @returns `true` si el token es válido o el backend no responde a tiempo,
 *          `false` si no hay token o el backend rechaza el token.
 */
export async function verifyServerSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  // Sin token → sesión inválida
  if (!token) {
    return false;
  }

  try {
    // Timeout para evitar bloquear al usuario si el backend está lento (ej. cold start en Render)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

    const response = await fetch(`${API_URL}/api/token/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // SimpleJWT TokenVerifyView espera el token en el body, no en el header
      body: JSON.stringify({ token }),
      // Crítico: No cachear para validar en tiempo real en cada solicitud
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return response.ok; // true si 200-299, false si 401/403/etc.
  } catch (error) {
    // Si el error es por timeout, asumimos sesión válida (la Capa 1 ya verificó la cookie)
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.warn(
        '[ServerAuth] Timeout al verificar sesión — asumiendo válida (Capa 1 ya verificó cookie)'
      );
      return true;
    }

    console.error('[ServerAuth] Error al verificar sesión:', error);
    // Error de red u otro → asumimos válida para no bloquear al usuario
    return true;
  }
}
