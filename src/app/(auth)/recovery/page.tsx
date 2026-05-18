import type { Metadata } from 'next';
import { RecoveryView } from '@/features/auth/views/RecoveryView';

export const metadata: Metadata = {
  title: 'Recuperar contraseña',
};

export default function RecoveryPage() {
  return <RecoveryView />;
}
