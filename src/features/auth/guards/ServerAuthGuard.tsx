import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { verifyServerSession } from '../services/session-check';

interface ServerAuthGuardProps {
  children: React.ReactNode;
}

/**
 * Server Component Guard — Capa 2 de "Defensa en Profundidad".
 *
 * Valida el token del usuario contra el backend antes de renderizar
 * cualquier contenido protegido. Si el token es inválido y necesita refresh,
 * redirige al Route Handler de refresh para sincronizar cookies.
 * Si no se puede renovar, redirige al usuario a /login.
 */
export async function ServerAuthGuard({ children }: ServerAuthGuardProps) {
  const result = await verifyServerSession();

  if (result.needsRefresh) {
    const headerList = await headers();
    const currentPath = headerList.get('x-invoke-path') || '/inicio';
    redirect(
      `/api/auth/refresh?callbackUrl=${encodeURIComponent(currentPath)}`
    );
  }

  if (!result.valid) {
    redirect('/login');
  }

  return <>{children}</>;
}
