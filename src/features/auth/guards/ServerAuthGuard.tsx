import { redirect } from 'next/navigation';
import { verifyServerSession } from '../services/session-check';
import { TokenRefresher } from './TokenRefresher';

interface ServerAuthGuardProps {
  children: React.ReactNode;
}

/**
 * Server Component Guard — Capa 2 de "Defensa en Profundidad".
 *
 * Valida el token del usuario contra el backend antes de renderizar
 * cualquier contenido protegido. Si el token es inválido y no se puede
 * renovar, redirige al usuario a /login.
 *
 * Si el token fue renovado via refresh, renderiza un TokenRefresher
 * invisible que guarda los tokens nuevos en localStorage + cookies.
 */
export async function ServerAuthGuard({ children }: ServerAuthGuardProps) {
  const result = await verifyServerSession();

  if (!result.valid) {
    redirect('/login');
  }

  return (
    <>
      {result.refreshedTokens && (
        <TokenRefresher
          accessToken={result.refreshedTokens.access}
          refreshToken={result.refreshedTokens.refresh}
        />
      )}
      {children}
    </>
  );
}
