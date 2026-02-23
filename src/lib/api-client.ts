/**
 * Cliente API Simplificado para el patrón BFF (Backend-For-Frontend).
 *
 * Envuelve el fetch nativo. Ya NO es necesario inyectar tokens manualmente
 * ni manejar interceptores 401 en el cliente. Todo el referesco y el manejo
 * seguro de Authorization: Bearer <token> lo realiza nuestro servidor Next.js
 * a través de las cookies HttpOnly (Route Handler de proxy).
 *
 * @example
 * ```ts
 * const response = await fetchApi('/api/proveedores');
 * const data = await response.json();
 * ```
 */

export async function fetchApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers);

  // Asegurar Content-Type por defecto si hay body
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // La petición se hace RELATIVA al dominio actual de Next.js.
  // Es decir, 'fetch(/api/proveedores)' impactará en nuestro interceptor [...proxy]/route.ts
  return fetch(endpoint, {
    ...options,
    headers,
  });
}
