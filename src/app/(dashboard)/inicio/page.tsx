import type { Metadata } from 'next';
import { DashboardHomeView } from '@/features/dashboard/views/DashboardHomeView';

export const metadata: Metadata = {
  title: 'Inicio',
};

export default function DashboardPage() {
  return <DashboardHomeView />;
}
