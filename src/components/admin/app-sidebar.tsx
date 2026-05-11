'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  userService,
  UserProfileResponse,
} from '@/features/dashboard/services/user.service';

function getInitials(name: string) {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  isUnderConstruction?: boolean;
}

const adminRouteGroups: { title: string; items: NavItem[] }[] = [
  {
    title: 'Menú principal',
    items: [
      {
        title: 'Panel de Control',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Usuarios',
        href: '/admin/dashboard/usuarios',
        icon: Users,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const isSidebarCollapsed = state === 'collapsed';
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);

  useEffect(() => {
    userService.getProfile().then(setProfile).catch(console.error);
  }, []);

  const fullName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : profile?.username || 'Usuario';
  const initials = profile ? getInitials(fullName) : 'U';

  const handleUnderConstruction = () => {
    toast.info('Página en construcción', {
      description: 'Este módulo estará disponible próximamente.',
      duration: 3000,
    });
  };

  return (
    <Sidebar
      className="border-r border-gray-200 bg-[#FFFFFF] sticky top-0 h-svh"
      collapsible="icon"
    >
      {/* Header */}
      <SidebarHeader
        className={cn(
          'px-3 py-2 flex flex-row items-center mt-2 border-b-0 min-h-[60px]',
          isSidebarCollapsed ? 'justify-center' : 'justify-center pr-8'
        )}
      >
        {!isSidebarCollapsed && (
          <Image
            src="/logo-con-letra.png"
            alt="Universitas Logo"
            width={170}
            height={50}
            className="object-contain"
            priority
          />
        )}
        {isSidebarCollapsed && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0091be]/10 shrink-0">
            <LayoutDashboard className="h-5 w-5 text-[#0091be]" />
          </div>
        )}
      </SidebarHeader>

      {/* Contenido de Navegación */}
      <SidebarContent className="px-3 py-4 space-y-4">
        {adminRouteGroups.map((group) => (
          <SidebarGroup key={group.title} className="px-0 py-0">
            {(!isSidebarCollapsed || isMobile) && (
              <SidebarGroupLabel className="px-4 text-[13px] font-medium text-gray-500 mb-2 tracking-wide h-auto p-0 bg-transparent">
                {group.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    item.href === '/admin/dashboard'
                      ? pathname === '/admin/dashboard'
                      : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      {item.isUnderConstruction ? (
                        <SidebarMenuButton
                          onClick={handleUnderConstruction}
                          isActive={isActive}
                          variant="ghost"
                          className={cn(
                            'transition-colors duration-200 min-h-[36px] cursor-pointer rounded-lg text-gray-700 gap-3 group-data-[collapsible=icon]:!p-2',
                            isActive
                              ? '!bg-[#F3F4F6] !text-gray-900 font-medium'
                              : 'hover:!bg-[#F3F4F6] hover:!text-gray-900'
                          )}
                        >
                          <item.icon className="h-[18px] w-[18px] shrink-0 text-[#1a1a1a]" />
                          {(!isSidebarCollapsed || isMobile) && (
                            <span className="whitespace-normal leading-tight text-left break-words flex-1 text-[13.5px]">
                              {item.title}
                            </span>
                          )}
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          variant="ghost"
                          className={cn(
                            'transition-colors duration-200 min-h-[36px] cursor-pointer rounded-lg text-gray-700 gap-3 group-data-[collapsible=icon]:!p-2',
                            isActive
                              ? '!bg-[#F3F4F6] !text-gray-900 font-medium'
                              : 'hover:!bg-[#F3F4F6] hover:!text-gray-900'
                          )}
                        >
                          <Link href={item.href}>
                            <item.icon className="h-[18px] w-[18px] shrink-0 text-[#1a1a1a]" />
                            {(!isSidebarCollapsed || isMobile) && (
                              <span className="whitespace-normal leading-tight text-left break-words flex-1 text-[13.5px]">
                                {item.title}
                              </span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-gray-100 px-3 py-4 bg-white mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  'flex w-full items-center gap-2 rounded-md p-2 text-left text-sm outline-none cursor-pointer hover:bg-gray-50 bg-transparent border-none transition-colors',
                  isSidebarCollapsed && 'justify-center p-0'
                )}
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-[#008CBA] text-white text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {!isSidebarCollapsed && (
                  <div className="grid flex-1 text-left text-sm leading-normal gap-0.5">
                    <span className="truncate font-medium text-gray-900">
                      {fullName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {profile?.email || 'cargando...'}
                    </span>
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                sideOffset={8}
                className="w-56"
              >
                <div className="px-2 py-2">
                  <p className="text-sm font-medium leading-tight">
                    {fullName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {profile?.email || 'cargando...'}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Copyright */}
        {!isSidebarCollapsed && (
          <div className="pt-4 text-center">
            <p
              className="text-[7px] font-bold text-[#727272] leading-tight"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Copyright © 2026 Universitas Services | GESTOR CONTRATACIONES
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
