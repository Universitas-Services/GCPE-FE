import { AcercaDeView } from '@/features/acerca-de';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acerca de - Universitas GCPE',
  description: 'Acerca de Gestor de Contrataciones',
};

export default function AcercaDePage() {
  return <AcercaDeView />;
}
