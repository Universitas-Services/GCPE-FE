import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Logout exitoso' },
    { status: 200 }
  );

  // Limpiar cookies de sesión
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');

  return response;
}
