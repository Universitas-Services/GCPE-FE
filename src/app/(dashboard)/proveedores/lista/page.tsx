import type { Metadata } from 'next';
import ProvidersListPage from '@/features/providers/views/ProvidersListPage';

export const metadata: Metadata = {
  title: 'Lista de proveedores',
};

export default function Page() {
  return <ProvidersListPage />;
}
