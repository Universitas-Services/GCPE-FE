import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/features/auth/services/auth.service';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // Si existe un refresh token, avisar al backend de Django para invalidarlo
  if (refreshToken) {
    try {
      await authService.logout(refreshToken);
    } catch (error) {
      console.error(
        '[Logout Route] Error al procesar logout en el backend:',
        error
      );
    }
  }

  const response = NextResponse.json(
    { message: 'Logout exitoso' },
    { status: 200 }
  );

  // Limpiar cookies de sesión
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');

  return response;
}
