'use client';

import Link from 'next/link';
import { LayoutDashboard, FileText, Menu, Users, BookOpen } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useDashboard } from '../context/DashboardContext';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useDashboard();

  const routes = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      active: pathname === '/dashboard',
    },
    {
      label: 'Compliance de Expediente de selección de contratista',
      icon: FileText,
      href: '/dashboard/compliance',
      active: pathname.startsWith('/dashboard/compliance'),
    },
    {
      label: 'Registro de proveedores',
      icon: Users,
      href: '/dashboard/proveedores/registro',
      active: pathname.startsWith('/dashboard/proveedores'),
    },
    {
      label: 'Elabora tu manual express',
      icon: BookOpen,
      href: '/dashboard/manual',
      active: pathname.startsWith('/dashboard/manual'),
    },
  ];

  return (
    <div
      className={cn(
        'pb-12 h-screen border-r bg-gray-100 hidden lg:flex lg:flex-col transition-all duration-300 ease-in-out',
        isSidebarCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="space-y-4 py-4 h-full flex flex-col">
        {/* Toggle Button / Header */}
        <div
          className={cn(
            'px-3 py-2 flex items-center mb-2',
            isSidebarCollapsed ? 'justify-center' : 'justify-between'
          )}
        >
          {!isSidebarCollapsed && (
            <span className="text-xl font-bold text-transparent select-none">
              .
            </span> // Spacer to keep layout if needed or just empty
          )}
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="hover:bg-gray-200"
          >
            <Menu className="h-6 w-6 text-[#0b1e4c]" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-2">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.active ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start transition-all',
                  route.active && 'bg-white shadow-sm font-medium',
                  isSidebarCollapsed ? 'px-2 justify-center' : 'px-4'
                )}
                asChild
              >
                <Link
                  href={route.href}
                  className="flex items-center h-auto min-h-[40px] py-1"
                >
                  <route.icon
                    className={cn(
                      'h-5 w-5 shrink-0 text-[#0b1e4c]',
                      isSidebarCollapsed ? 'mr-0' : 'mr-3'
                    )}
                  />
                  {!isSidebarCollapsed && (
                    <span className="whitespace-normal leading-tight text-left break-words">
                      {route.label}
                    </span>
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const routes = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      active: pathname === '/dashboard',
    },
    {
      label: 'Compliance de Expediente de selección de contratista',
      icon: FileText,
      href: '/dashboard/compliance',
      active: pathname.startsWith('/dashboard/compliance'),
    },
    {
      label: 'Registro de proveedores',
      icon: Users,
      href: '/dashboard/proveedores/registro',
      active: pathname.startsWith('/dashboard/proveedores'),
    },
    {
      label: 'Elabora tu manual express',
      icon: BookOpen,
      href: '/dashboard/manual',
      active: pathname.startsWith('/dashboard/manual'),
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-gray-100 w-72">
        <div className="space-y-4 py-4 h-full flex flex-col">
          <div className="px-4 py-2 flex items-center gap-2 mb-6">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <h2 className="text-xl font-bold text-[#0b1e4c]">Universitas</h2>
          </div>
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-1">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  variant={route.active ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    route.active && 'bg-white shadow-sm font-medium'
                  )}
                  asChild
                >
                  <Link href={route.href} className="h-auto py-2">
                    <route.icon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="whitespace-normal text-left">
                      {route.label}
                    </span>
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
