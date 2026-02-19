import { redirect } from 'next/navigation';
import { verifyServerSession } from '../services/session-check';

interface ServerAuthGuardProps {
  children: React.ReactNode;
}

/**
 * Server Component Guard — Capa 2 de "Defensa en Profundidad".
 *
 * Valida el token del usuario contra el backend antes de renderizar
 * cualquier contenido protegido. Si el token es inválido, expirado
 * o ha sido revocado, redirige al usuario a /login.
 *
 * Uso: Envolver layouts o páginas protegidas.
 * ```tsx
 * <ServerAuthGuard>
 *   <DashboardLayout>{children}</DashboardLayout>
 * </ServerAuthGuard>
 * ```
 */
export async function ServerAuthGuard({ children }: ServerAuthGuardProps) {
  const isValid = await verifyServerSession();

  if (!isValid) {
    redirect('/login');
  }

  return <>{children}</>;
}
