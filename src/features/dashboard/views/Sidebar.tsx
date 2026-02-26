'use client';

import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Menu,
  Users,
  BookOpen,
  Info,
  Scale,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  userService,
  UserProfileResponse,
} from '@/features/dashboard/services/user.service';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useDashboard } from '../context/DashboardContext';
import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';

function getInitials(name: string) {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function UserNav({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);

  useEffect(() => {
    userService.getProfile().then(setProfile).catch(console.error);
  }, []);

  const initials = profile ? getInitials(profile.username) : 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'w-full h-auto p-2 hover:bg-gray-200',
            isCollapsed ? 'justify-center' : 'justify-start'
          )}
        >
          <div
            className={cn(
              'flex items-center gap-3',
              isCollapsed ? 'justify-center w-full' : 'w-full overflow-hidden'
            )}
          >
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="bg-[#008CBA] text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && profile && (
              <div className="flex flex-col items-start overflow-hidden flex-1">
                <span className="text-sm font-medium leading-none truncate w-full text-left">
                  {profile.username}
                </span>
                <span className="text-xs text-gray-500 truncate mt-1 w-full text-left">
                  {profile.email}
                </span>
              </div>
            )}
            {!isCollapsed && !profile && (
              <div className="flex flex-col items-start overflow-hidden flex-1">
                <span className="text-sm font-medium leading-none truncate">
                  Cargando...
                </span>
              </div>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="start"
        side="top"
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.username || 'Usuario'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile?.email || 'cargando...'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/pro" className="cursor-pointer">
            Actualizar a cuenta pro
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="cursor-pointer">
            Gestión de perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
          onClick={logout}
        >
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useDashboard();
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
      label: 'Repositorio legal',
      icon: Scale,
      href: '/dashboard/repositorio-legal',
      active: pathname.startsWith('/dashboard/repositorio-legal'),
    },
    {
      label: 'Conócenos',
      icon: Info,
      href: '/dashboard/conocenos',
      active: pathname.startsWith('/dashboard/conocenos'),
    },
  ];

  return (
    <div
      className={cn(
        'h-screen border-r bg-gray-100 hidden lg:flex lg:flex-col transition-all duration-300 ease-in-out',
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
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="hover:bg-gray-200 shrink-0"
          >
            <Menu className="h-6 w-6 text-[#0b1e4c]" />
          </Button>
          {!isSidebarCollapsed && (
            <div className="flex-1 flex justify-center pr-8">
              <Image
                src="/logo-con-letra.png"
                alt="Universitas Logo"
                width={170}
                height={50}
                className="object-contain"
                priority
              />
            </div>
          )}
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
                      'w-full justify-start transition-all duration-200 ease-in-out mb-1 group hover:bg-gray-200 hover:text-[#0b1e4c]',
                      route.active && 'bg-white shadow-sm font-medium',
                      isSidebarCollapsed ? 'px-2 justify-center' : 'px-4'
                    )}
                    asChild
                  >
                    <Link
                      href={route.href}
                      className="flex items-center justify-center h-auto min-h-[40px] py-1 cursor-pointer"
                    >
                      <route.icon
                        className={cn(
                          'h-5 w-5 shrink-0 text-[#0b1e4c] group-hover:text-[#0b1e4c] transition-colors',
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
                      'w-full justify-start transition-all duration-200 ease-in-out group hover:bg-gray-200 hover:text-[#0b1e4c]',
                      (route.active || isChildActive) &&
                        'bg-gray-200/50 font-medium',
                      isSidebarCollapsed ? 'px-2 justify-center' : 'px-4'
                    )}
                    onClick={() =>
                      !isSidebarCollapsed && toggleMenu(route.href)
                    }
                  >
                    <div className="flex items-center justify-center w-full cursor-pointer">
                      <route.icon
                        className={cn(
                          'h-5 w-5 shrink-0 text-[#0b1e4c] group-hover:text-[#0b1e4c] transition-colors',
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
                            'w-full justify-start h-9 text-sm cursor-pointer transition-colors duration-200 hover:bg-gray-200 hover:text-[#0b1e4c]',
                            child.active && 'bg-white shadow-sm font-medium'
                          )}
                          asChild
                        >
                          <Link
                            href={child.href}
                            className="flex items-center cursor-pointer"
                          >
                            {child.label}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* User Navbar */}
        <div className="px-3 mt-auto">
          <UserNav isCollapsed={isSidebarCollapsed} />
        </div>
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
      label: 'Repositorio legal',
      icon: Scale,
      href: '/dashboard/repositorio-legal',
      active: pathname.startsWith('/dashboard/repositorio-legal'),
    },
    {
      label: 'Conócenos',
      icon: Info,
      href: '/dashboard/conocenos',
      active: pathname.startsWith('/dashboard/conocenos'),
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
                    'w-full justify-start transition-colors duration-200 group hover:bg-gray-200 hover:text-[#0b1e4c]',
                    route.active && 'bg-white shadow-sm font-medium'
                  )}
                  asChild
                >
                  <Link
                    href={route.href}
                    className="flex items-center h-auto py-2 cursor-pointer"
                  >
                    <route.icon className="mr-2 h-4 w-4 shrink-0 text-[#0b1e4c] group-hover:text-[#0b1e4c] transition-colors" />
                    <span className="whitespace-normal text-left">
                      {route.label}
                    </span>
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* User Navbar for Mobile */}
          <div className="px-4 mt-auto border-t pt-4 mb-4">
            <UserNav isCollapsed={false} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
