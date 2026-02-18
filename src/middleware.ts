import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Obtener el token de las cookies
  const token = request.cookies.get('accessToken')?.value;

  // 2. Definir rutas
  const { pathname } = request.nextUrl;

  // Rutas públicas a las que NO se puede entrar si ya estás logueado
  const authRoutes = ['/login', '/register', '/recovery'];

  // Rutas protegidas (todas las que empiecen por /dashboard)
  const isProtectedRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // CASO A: Usuario NO logueado intenta entrar a ruta protegida
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // (Opcional) Guardar a dónde quería ir para redirigirlo después
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // CASO B: Usuario YA logueado intenta entrar a Login/Register
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Si no aplica ninguna regla, dejar pasar
  return NextResponse.next();
}

// Configuración: En qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    // Ejecutar en todas las rutas excepto archivos estáticos, imágenes, etc.
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)',
  ],
};
