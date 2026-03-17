'use client';

import { Sidebar, MobileSidebar } from './Sidebar';
import { useDashboard, DashboardProvider } from '../context/DashboardContext';
import { cn } from '@/lib/utils';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useDashboard();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-50 transition-width duration-300 ease-in-out',
          isSidebarCollapsed ? 'w-16' : 'w-[280px]'
        )}
      >
        <Sidebar className="h-full" />
      </div>

      {/* Main Content */}
      <div
        className={cn(
          'flex-1 transition-all duration-300 ease-in-out flex flex-col h-screen overflow-hidden',
          isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-[280px]'
        )}
      >
        <div className="flex items-center p-3 lg:hidden border-b bg-gray-50/50 shrink-0">
          <MobileSidebar />
          <span className="ml-2 font-semibold">Menu</span>
        </div>
        <main className="p-3 lg:p-4 bg-background flex-1 flex flex-col min-h-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <DashboardContent>{children}</DashboardContent>
    </DashboardProvider>
  );
}
