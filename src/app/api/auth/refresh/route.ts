import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get('callbackUrl') || '/inicio';

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const refreshResponse = await fetch(`${API_URL}/api/token/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();

      const response = NextResponse.redirect(new URL(callbackUrl, request.url));

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
      };

      response.cookies.set('accessToken', data.access, {
        ...cookieOptions,
        maxAge: 60 * 15,
      });

      if (data.refresh) {
        response.cookies.set('refreshToken', data.refresh, {
          ...cookieOptions,
          maxAge: 60 * 60 * 24,
        });
      }

      return response;
    }
  } catch (error) {
    console.error('[Refresh Route] Error:', error);
  }

  // Si algo falla, redirigimos al login y limpiamos
  const response = NextResponse.redirect(new URL('/login', request.url));
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
  return response;
}
