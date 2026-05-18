import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Enviar credenciales a Django
    const res = await fetch(`${API_URL}/api/token/pair`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      console.error('[Login Route] HTML response received:', res.status);
      return NextResponse.json(
        { error: 'Backend error' },
        { status: res.status }
      );
    }

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // 2. Crear la respuesta exitosa
    const response = NextResponse.json(
      { message: 'Login exitoso', user: data.user },
      { status: 200 }
    );

    // 3. Setear cookies HttpOnly
    // Configuración de cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const, // o 'strict' si API y Next.js están en el mismo dominio
      path: '/',
    };

    response.cookies.set('accessToken', data.access, {
      ...cookieOptions,
      maxAge: 60 * 60, // 1 hora
    });

    if (data.refresh) {
      response.cookies.set('refreshToken', data.refresh, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 7, // 7 días
      });
    }

    return response;
  } catch (error) {
    console.error('[Login Route Handler] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
