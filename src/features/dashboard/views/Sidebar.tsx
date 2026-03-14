'use client';

import Link from 'next/link';
import { Menu, ChevronDown } from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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

// Iconos
import { IoIosJournal } from 'react-icons/io';
import {
  IoNewspaperOutline,
  IoEarthOutline,
  IoSearchSharp,
} from 'react-icons/io5';
import { LiaRobotSolid } from 'react-icons/lia';
import { AiOutlineBook } from 'react-icons/ai';
import { BsQuestionCircle } from 'react-icons/bs';
import { BookOpenIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const ICON_STYLE = { width: '18px', height: '18px' };

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

  const fullName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : profile?.username || '';
  const initials = profile ? getInitials(fullName) : 'U';

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
                  {profile?.first_name} {profile?.last_name || 'Usuario'}
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
              {profile?.first_name} {profile?.last_name || 'Usuario'}
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

  // Cerrar submenús abiertos al colapsar para evitar flash al re-expandir
  useEffect(() => {
    if (isSidebarCollapsed) {
      setOpenMenus([]);
    }
  }, [isSidebarCollapsed]);

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    );
  };

  const routeGroups = [
    {
      title: 'Menú principal',
      items: [
        {
          label: 'Inicio',
          icon: IoIosJournal,
          href: '/dashboard',
          active: pathname === '/dashboard',
        },
        {
          label: 'Manual',
          icon: BookOpenIcon,
          href: '/dashboard/manual',
          active: pathname.startsWith('/dashboard/manual'),
        },
        {
          label: 'Registro de proveedores',
          icon: IoNewspaperOutline,
          href: '/dashboard/proveedores',
          active: pathname.startsWith('/dashboard/proveedores'),
          hasDropdown: true,
          children: [
            {
              label: 'Panel de registro',
              href: '/dashboard/proveedores/registro',
              active: pathname === '/dashboard/proveedores/registro',
            },
            {
              label: 'Ver proveedores registrados',
              href: '/dashboard/proveedores/lista',
              active: pathname === '/dashboard/proveedores/lista',
            },
          ],
        },
        {
          label: 'Elaboración de Expediente de selección de Contratista',
          icon: PencilSquareIcon,
          href: '/dashboard/elaboracion',
          active: pathname.startsWith('/dashboard/elaboracion'),
        },
        {
          label: 'Compliance de Expediente de selección de Contratista',
          icon: IoSearchSharp,
          href: '/dashboard/compliance',
          active: pathname.startsWith('/dashboard/compliance'),
        },
      ],
    },
    {
      title: 'Otros Servicios',
      items: [
        {
          label: 'Consultor IA',
          icon: LiaRobotSolid,
          href: '/dashboard/consultor-ia',
          active: pathname.startsWith('/dashboard/consultor-ia'),
        },
        {
          label: 'Conocenos',
          icon: IoEarthOutline,
          href: '/dashboard/conocenos',
          active: pathname.startsWith('/dashboard/conocenos'),
        },
        {
          label: 'Repositorio legal',
          icon: AiOutlineBook,
          href: '/dashboard/repositorio-legal',
          active: pathname.startsWith('/dashboard/repositorio-legal'),
        },
        {
          label: 'Preguntas Frecuentes',
          icon: BsQuestionCircle,
          href: '/dashboard/preguntas-frecuentes',
          active: pathname.startsWith('/dashboard/preguntas-frecuentes'),
        },
      ],
    },
  ];

  const renderRouteItems = (group: any, isMobile = false) => {
    return (
      <div key={group.title} className="mb-4">
        {(!isSidebarCollapsed || isMobile) && (
          <h3 className="px-4 text-[13px] font-medium text-gray-500 mb-2 tracking-wide">
            {group.title}
          </h3>
        )}
        <div className="space-y-1">
          {group.items.map((route: any) => {
            const hasChildren = route.hasDropdown;
            const isOpen = openMenus.includes(route.href);
            const isChildActive = route.children?.some(
              (child: any) => child.active
            );
            const ItemIcon = route.icon;

            const buttonContent = (
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start transition-colors duration-200 hover:bg-[#F3F4F6] hover:text-gray-900 relative flex items-center h-auto min-h-[36px] cursor-pointer rounded-lg text-gray-700',
                  (route.active || isChildActive) &&
                    'bg-[#F3F4F6] text-gray-900 font-medium',
                  isSidebarCollapsed && !isMobile
                    ? 'px-2 justify-center'
                    : 'px-4 py-2'
                )}
                onClick={() => {
                  if (hasChildren && (!isSidebarCollapsed || isMobile)) {
                    toggleMenu(route.href);
                  }
                }}
                asChild={!hasChildren}
              >
                {!hasChildren ? (
                  <Link href={route.href}>
                    <ItemIcon
                      style={ICON_STYLE}
                      className={cn(
                        'shrink-0 text-[#1a1a1a]',
                        !isSidebarCollapsed || isMobile ? 'mr-3' : 'mr-0'
                      )}
                    />
                    {(!isSidebarCollapsed || isMobile) && (
                      <span className="whitespace-normal leading-tight text-left break-words flex-1 text-[13.5px]">
                        {route.label}
                      </span>
                    )}
                  </Link>
                ) : (
                  <>
                    <ItemIcon
                      style={ICON_STYLE}
                      className={cn(
                        'shrink-0 text-[#1a1a1a]',
                        !isSidebarCollapsed || isMobile ? 'mr-3' : 'mr-0'
                      )}
                    />
                    {(!isSidebarCollapsed || isMobile) && (
                      <>
                        <span className="whitespace-normal leading-tight text-left break-words flex-1 text-[13.5px]">
                          {route.label}
                        </span>
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 text-gray-500 transition-transform ml-2 shrink-0',
                            isOpen && 'rotate-180'
                          )}
                        />
                      </>
                    )}
                  </>
                )}
              </Button>
            );

            return (
              <div key={route.href}>
                {isSidebarCollapsed && !isMobile ? (
                  hasChildren ? (
                    <Popover>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <PopoverTrigger asChild>
                            {buttonContent}
                          </PopoverTrigger>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="bg-[#0091BE] text-white font-medium border-none ml-2 shadow-md z-[50]"
                        >
                          {route.label}
                        </TooltipContent>
                      </Tooltip>
                      <PopoverContent
                        side="right"
                        align="start"
                        sideOffset={14}
                        className="w-48 p-2 bg-card border-none shadow-lg rounded-xl z-[51]"
                      >
                        <div className="flex flex-col space-y-1">
                          <div className="px-3 pb-2 mb-1 border-b border-gray-200">
                            <span className="text-black font-semibold text-[13px] tracking-wide">
                              {route.label}
                            </span>
                          </div>
                          {route.children &&
                            route.children.map((child: any) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  'px-3 py-2 text-sm text-black font-medium hover:bg-[#F3F4F6] rounded-lg transition-colors',
                                  child.active && 'bg-[#F3F4F6]'
                                )}
                              >
                                {child.label}
                              </Link>
                            ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-[#0091BE] text-white font-medium border-none ml-2 shadow-md"
                      >
                        {route.label}
                      </TooltipContent>
                    </Tooltip>
                  )
                ) : (
                  buttonContent
                )}

                {hasChildren &&
                  (!isSidebarCollapsed || isMobile) &&
                  isOpen &&
                  route.children &&
                  route.children.length > 0 && (
                    <div className="mt-1 ml-6 border-l-2 border-gray-100 pl-3 space-y-1">
                      {route.children.map((child: any) => (
                        <Button
                          key={child.href}
                          variant="ghost"
                          className={cn(
                            'w-full justify-start h-[32px] text-[12.5px] cursor-pointer transition-colors duration-200 hover:bg-[#F3F4F6] rounded-md text-gray-600',
                            child.active &&
                              'bg-[#F3F4F6] text-gray-900 font-medium'
                          )}
                          asChild
                        >
                          <Link href={child.href} className="flex items-center">
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
      </div>
    );
  };

  return (
    <div
      className={cn(
        'h-screen border-r bg-[#FFFFFF] hidden lg:flex lg:flex-col transition-all duration-300 ease-in-out overflow-hidden',
        isSidebarCollapsed ? 'w-16' : 'w-[280px]',
        className
      )}
    >
      <TooltipProvider delayDuration={150}>
        <div
          className={cn(
            'flex flex-col h-full overflow-hidden',
            !isSidebarCollapsed && 'min-w-[280px]'
          )}
        >
          {/* Toggle Button / Header restored exactly as it was */}
          <div
            className={cn(
              'px-3 py-2 flex items-center mt-2',
              isSidebarCollapsed ? 'justify-center' : 'justify-between'
            )}
          >
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className={cn(
                'hover:bg-gray-200 shrink-0 flex items-center justify-center',
                !isSidebarCollapsed && 'ml-2'
              )}
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

          <ScrollArea
            className={cn(
              'flex-1 px-3 mt-0 w-full h-[calc(100vh-140px)]',
              isSidebarCollapsed
                ? 'overflow-hidden [&>div]:!overflow-hidden [&::-webkit-scrollbar]:!hidden [-ms-overflow-style:!none] [scrollbar-width:!none]'
                : 'overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
            )}
          >
            {routeGroups.map((group) => renderRouteItems(group))}
          </ScrollArea>

          {/* User Navbar exactly as it was */}
          <div className="px-3 mt-auto mb-4 border-t border-gray-100 pt-4 bg-white">
            <UserNav isCollapsed={isSidebarCollapsed} />
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
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

  const routeGroups = [
    {
      title: 'Menú principal',
      items: [
        {
          label: 'Dashboard',
          icon: IoIosJournal,
          href: '/dashboard',
          active: pathname === '/dashboard',
        },
        {
          label: 'Manual',
          icon: BookOpenIcon,
          href: '/dashboard/manual',
          active: pathname.startsWith('/dashboard/manual'),
        },
        {
          label: 'Registro de proveedores',
          icon: IoNewspaperOutline,
          href: '/dashboard/proveedores',
          active: pathname.startsWith('/dashboard/proveedores'),
          hasDropdown: true,
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
          label: 'Compliance de Expediente de selección de Contratista',
          icon: PencilSquareIcon,
          href: '/dashboard/compliance',
          active: pathname.startsWith('/dashboard/compliance'),
        },
      ],
    },
    {
      title: 'Otros Servicios',
      items: [
        {
          label: 'Consultor IA',
          icon: LiaRobotSolid,
          href: '/dashboard/consultor-ia',
          active: pathname.startsWith('/dashboard/consultor-ia'),
        },
        {
          label: 'Conocenos',
          icon: IoEarthOutline,
          href: '/dashboard/conocenos',
          active: pathname.startsWith('/dashboard/conocenos'),
        },
        {
          label: 'Repositorio legal',
          icon: AiOutlineBook,
          href: '/dashboard/repositorio-legal',
          active: pathname.startsWith('/dashboard/repositorio-legal'),
        },
        {
          label: 'Preguntas Frecuentes',
          icon: BsQuestionCircle,
          href: '/dashboard/preguntas-frecuentes',
          active: pathname.startsWith('/dashboard/preguntas-frecuentes'),
        },
      ],
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-[#FFFFFF] w-72">
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

          <ScrollArea className="flex-1 px-4 overflow-y-auto w-full h-[calc(100vh-160px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {routeGroups.map((group) => (
              <div key={group.title} className="mb-4">
                <h3 className="px-4 text-[13px] font-medium text-gray-500 mb-2 tracking-wide">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.items.map((route: any) => {
                    const hasChildren = route.hasDropdown;
                    const isOpen = openMenus.includes(route.href);
                    const isChildActive = route.children?.some(
                      (child: any) => child.active
                    );
                    const ItemIcon = route.icon;

                    return (
                      <div key={route.href}>
                        <Button
                          variant="ghost"
                          className={cn(
                            'w-full justify-start transition-colors duration-200 hover:bg-[#F3F4F6] relative flex items-center h-auto min-h-[36px] cursor-pointer rounded-lg text-gray-700 px-4 py-2',
                            (route.active || isChildActive) &&
                              'bg-[#F3F4F6] text-gray-900 font-medium'
                          )}
                          onClick={() => {
                            if (hasChildren) {
                              toggleMenu(route.href);
                            }
                          }}
                          asChild={!hasChildren}
                        >
                          {!hasChildren ? (
                            <Link href={route.href}>
                              <ItemIcon
                                style={ICON_STYLE}
                                className="shrink-0 mr-3 text-black"
                              />
                              <span className="whitespace-normal leading-tight text-left break-words flex-1 text-[13.5px]">
                                {route.label}
                              </span>
                            </Link>
                          ) : (
                            <>
                              <ItemIcon
                                style={ICON_STYLE}
                                className="shrink-0 mr-3 text-black"
                              />
                              <span className="whitespace-normal leading-tight text-left break-words flex-1 text-[13.5px]">
                                {route.label}
                              </span>
                              <ChevronDown
                                className={cn(
                                  'h-4 w-4 text-gray-500 transition-transform ml-2 shrink-0',
                                  isOpen && 'rotate-180'
                                )}
                              />
                            </>
                          )}
                        </Button>

                        {hasChildren &&
                          isOpen &&
                          route.children &&
                          route.children.length > 0 && (
                            <div className="mt-1 ml-6 border-l-2 border-gray-100 pl-3 space-y-1">
                              {route.children.map((child: any) => (
                                <Button
                                  key={child.href}
                                  variant="ghost"
                                  className={cn(
                                    'w-full justify-start h-[32px] text-[12.5px] cursor-pointer transition-colors duration-200 hover:bg-[#F3F4F6] rounded-md text-gray-600',
                                    child.active &&
                                      'bg-[#F3F4F6] text-gray-900 font-medium'
                                  )}
                                  asChild
                                >
                                  <Link
                                    href={child.href}
                                    className="flex items-center"
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
              </div>
            ))}
          </ScrollArea>

          <div className="px-4 mt-auto border-t pt-4 mb-4">
            <UserNav isCollapsed={false} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
