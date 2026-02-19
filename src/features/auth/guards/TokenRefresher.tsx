'use client';

import { useEffect } from 'react';
import { authStorage } from '../lib/auth-storage';

interface TokenRefresherProps {
  accessToken: string;
  refreshToken?: string;
}

/**
 * Client Component invisible que guarda tokens renovados por el servidor.
 *
 * Cuando el ServerAuthGuard detecta un accessToken inválido y logra
 * renovarlo via refresh server-side, pasa los tokens nuevos a este
 * componente. Al hidratarse, guarda los tokens en localStorage + cookies.
 *
 * No renderiza nada visible — es solo un efecto de sincronización.
 */
export function TokenRefresher({
  accessToken,
  refreshToken,
}: TokenRefresherProps) {
  useEffect(() => {
    // Guardar el nuevo accessToken en localStorage + cookie
    authStorage.setAccessToken(accessToken);

    // Si el backend envió un nuevo refreshToken, guardarlo también
    if (refreshToken) {
      authStorage.setRefreshToken(refreshToken);
    }

    console.info(
      '[TokenRefresher] Tokens renovados sincronizados en cliente (localStorage + cookies)'
    );
  }, [accessToken, refreshToken]);

  // No renderiza nada visible
  return null;
}
