import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ⚠️ IMPORTANTE: La función ahora se debe llamar "proxy"
export function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  console.log(`[Proxy] Ruta: ${pathname} | Token: ${token ? 'SI' : 'NO'}`);

  // Rutas públicas
  const authRoutes = ['/login', '/register', '/recovery'];
  const isProtectedRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 1. Proteger Dashboard
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // (Opcional) Guardar a dónde quería ir
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirigir si ya tiene sesión
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// La configuración se mantiene igual
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)',
  ],
};
