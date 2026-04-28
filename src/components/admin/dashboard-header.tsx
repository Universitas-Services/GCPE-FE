'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/40 bg-white px-6">
      {/* Left: Sidebar toggle */}
      <SidebarTrigger className="-ml-2 text-gray-500 hover:text-gray-700" />
      <Separator orientation="vertical" className="h-5" />

      {/* Center: Spacer + Title */}
      <div className="flex-1">
        <h2 className="text-sm font-semibold text-[#005282]">
          Panel Administrativo
        </h2>
      </div>

      {/* Right: Quick actions - Removed */}
      <div className="flex items-center gap-1"></div>
    </header>
  );
}
