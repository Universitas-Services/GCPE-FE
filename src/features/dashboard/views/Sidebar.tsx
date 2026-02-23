'use client';

import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Menu,
  Users,
  BookOpen,
  LogOut,
  UserCog,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useDashboard } from '../context/DashboardContext';
import { useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useDashboard();
  const { logout } = useAuth();
  const [openMenus, setOpenMenus] = useState<string[]>([
    '/dashboard/proveedores',
  ]);

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    );
  };

  const routes = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      active: pathname === '/dashboard',
    },
    {
      label: 'Compliance',
      icon: FileText,
      href: '/dashboard/compliance',
      active: pathname.startsWith('/dashboard/compliance'),
    },
    {
      label: 'Proveedores',
      icon: Users,
      href: '/dashboard/proveedores',
      active: pathname.startsWith('/dashboard/proveedores'),
      // submenus
      children: [
        {
          label: 'Registro',
          href: '/dashboard/proveedores/registro',
          active: pathname === '/dashboard/proveedores/registro',
        },
        {
          label: 'Listar proveedores',
          href: '/dashboard/proveedores/lista',
          active: pathname === '/dashboard/proveedores/lista',
        },
      ],
    },
    {
      label: 'Manual Express',
      icon: BookOpen,
      href: '/dashboard/manual',
      active: pathname.startsWith('/dashboard/manual'),
    },
    {
      label: 'Gestión de perfil',
      icon: UserCog,
      href: '/dashboard/profile',
      active: pathname.startsWith('/dashboard/profile'),
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
            </span>
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
            {routes.map((route) => {
              // Simple Item
              if (!route.children) {
                return (
                  <Button
                    key={route.href}
                    variant={route.active ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start transition-all mb-1',
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
                );
              }

              // Parent Item with Children
              const isOpen = openMenus.includes(route.href);
              const isChildActive = route.children.some(
                (child) => child.active
              );

              return (
                <div key={route.href} className="mb-1">
                  <Button
                    variant={
                      route.active || isChildActive ? 'secondary' : 'ghost'
                    }
                    className={cn(
                      'w-full justify-start transition-all',
                      (route.active || isChildActive) &&
                        'bg-gray-200/50 font-medium',
                      isSidebarCollapsed ? 'px-2 justify-center' : 'px-4'
                    )}
                    onClick={() =>
                      !isSidebarCollapsed && toggleMenu(route.href)
                    }
                  >
                    <div className="flex items-center w-full">
                      <route.icon
                        className={cn(
                          'h-5 w-5 shrink-0 text-[#0b1e4c]',
                          isSidebarCollapsed ? 'mr-0' : 'mr-3'
                        )}
                      />
                      {!isSidebarCollapsed && (
                        <>
                          <span className="whitespace-normal leading-tight text-left break-words flex-1">
                            {route.label}
                          </span>
                          {/* Chevron icon could go here if we imported it */}
                        </>
                      )}
                    </div>
                  </Button>

                  {/* Children Container */}
                  {!isSidebarCollapsed && isOpen && (
                    <div className="mt-1 ml-4 border-l-2 border-gray-200 pl-2 space-y-1">
                      {route.children.map((child) => (
                        <Button
                          key={child.href}
                          variant={child.active ? 'secondary' : 'ghost'}
                          className={cn(
                            'w-full justify-start h-9 text-sm',
                            child.active && 'bg-white shadow-sm font-medium'
                          )}
                          asChild
                        >
                          <Link href={child.href}>{child.label}</Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Logout Button */}
        <div className="px-3 mt-auto">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50',
              isSidebarCollapsed ? 'px-2 justify-center' : 'px-4'
            )}
            onClick={logout}
          >
            <LogOut
              className={cn(
                'h-5 w-5 shrink-0',
                isSidebarCollapsed ? 'mr-0' : 'mr-3'
              )}
            />
            {!isSidebarCollapsed && (
              <span className="font-medium">Cerrar sesión</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
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
      label: 'Listar proveedores',
      icon: Users,
      href: '/dashboard/proveedores/lista',
      active: pathname === '/dashboard/proveedores/lista',
    },
    {
      label: 'Elabora tu manual express',
      icon: BookOpen,
      href: '/dashboard/manual',
      active: pathname.startsWith('/dashboard/manual'),
    },
    {
      label: 'Gestión de perfil',
      icon: UserCog,
      href: '/dashboard/profile',
      active: pathname.startsWith('/dashboard/profile'),
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
        {/* Mantenemos el título oculto para accesibilidad */}
        <SheetTitle className="hidden">Menú de Navegación</SheetTitle>

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

          {/* Logout Button for Mobile */}
          <div className="px-4 mt-auto border-t pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut className="mr-2 h-5 w-5 shrink-0" />
              <span className="font-medium">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
