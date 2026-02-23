import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleProxyRequest(
  request: NextRequest,
  isRetry = false
): Promise<NextResponse> {
  try {
    const pathname = request.nextUrl.pathname; // ej: /api/proveedores

    const searchParams = request.nextUrl.searchParams.toString();
    const query = searchParams ? `?${searchParams}` : '';

    // Ruta en el backend (omitimos el /api local si queremos llamar directamente al endpoint de django con el mismo path, o mapeamos)
    // Asumimos que Django también responde en `/api/...`
    const backendUrl = `${API_URL}${pathname}${query}`;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const headers = new Headers(request.headers);
    // Limpiamos headers que causan problemas en proxy (host, origin, etc.)
    headers.delete('host');
    headers.delete('cookie');
    headers.delete('origin');
    headers.delete('referer');

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const init: RequestInit = {
      method: request.method,
      headers,
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const bodyBlob = await request.blob();
      init.body = bodyBlob;
    }

    const response = await fetch(backendUrl, init);

    // Si recibimos 401 y no es un reintento, intentamos refrescar el token
    if (response.status === 401 && !isRetry) {
      const refreshToken = cookieStore.get('refreshToken')?.value;
      if (refreshToken) {
        // Intentar refresh contra el backend de Django
        const refreshResponse = await fetch(`${API_URL}/api/token/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          // Token renovado!
          // Seteamos silenciosamente las cookies y reintentamos.
          // Para setear cookies en un Route Handler sin devolver la respuesta al frontend aún, Next.js permite NextResponse
          // Pero necesitamos construir una respuesta, así que lo guardamos en variables para inyectarlo en la respuesta final de retry

          cookieStore.set('accessToken', refreshData.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 15,
          });

          if (refreshData.refresh) {
            cookieStore.set('refreshToken', refreshData.refresh, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60 * 24,
            });
          }

          // Reintentamos la petición original recursivamente con las nuevas cookies (ahora disponibles en la request)
          // El request.headers NO cambiará mágicamente para la llamada fetch interna de retry, así que el proxy de retry
          // extraerá las cookies seteadas de cookieStore y las usará para el nuevo Bearer.
          return handleProxyRequest(request, true);
        }
      }

      // Si el refresh falla, limpiamos las cookies y dejamos el 401 fluir al cliente para que cierre sesión.
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
    }

    // Convertir respuesta de Django a NextResponse
    const responseHeaders = new Headers(response.headers);
    // Podemos limpiar ciertos headers de repuesta restrictivos si es necesario
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');

    // Si isRetry es true y fue exitoso, el frontend necesita recibir las cookies seteadas.
    // Como usamos `cookieStore.set()` antes de este retry, las cookies ya están adjuntas en el objeto de Next.js.
    // NextResponse devolverá esto automáticamente porque el cookieStore interacciona con el context.

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[BFF Proxy Error]', error);
    return NextResponse.json({ error: 'BFF Proxy Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return handleProxyRequest(request);
}

export async function POST(request: NextRequest) {
  return handleProxyRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleProxyRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleProxyRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleProxyRequest(request);
}
