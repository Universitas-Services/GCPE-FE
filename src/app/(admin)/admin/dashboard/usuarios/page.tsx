import type { Metadata } from 'next';
import { AdminPanelView } from '@/features/admin/features-admin/panel-users/views/AdminPanelView';

export const metadata: Metadata = {
  title: 'Usuarios',
};

export default function UsuariosPage() {
  return <AdminPanelView />;
}
