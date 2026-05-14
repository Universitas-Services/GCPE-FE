import { DashboardLayout } from '@/features/dashboard';
import { ServerAuthGuard } from '@/features/auth/guards/ServerAuthGuard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ServerAuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </ServerAuthGuard>
  );
}
