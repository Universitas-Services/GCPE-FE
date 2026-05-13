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
import { useMounted } from '@/hooks/use-mounted';
import { ProUpgradeModal } from '@/components/advertisements/ProUpgradeModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Iconos
import { IoIosJournal } from 'react-icons/io';
import {
  IoNewspaperOutline,
  IoEarthOutline,
  IoDocumentTextOutline,
} from 'react-icons/io5';
import { LiaRobotSolid } from 'react-icons/lia';
import { AiOutlineBook } from 'react-icons/ai';
import { BsQuestionCircle } from 'react-icons/bs';
import {
  BookOpenIcon,
  PencilSquareIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const ICON_STYLE = { width: '18px', height: '18px' };

// Wrapper para que InformationCircleIcon (heroicons outline, trazo fino)
// se vea del mismo tamaño visual que los demás iconos
const InfoIcon = (props: React.ComponentProps<'svg'>) => (
  <InformationCircleIcon
    {...props}
    style={{
      ...props.style,
      width: '18px',
      height: '18px',
      transform: 'scale(1.35)',
    }}
  />
);

function getInitials(name: string) {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function UserNav() {
  const { logout } = useAuth();
  const { isSidebarCollapsed } = useDashboard();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const mounted = useMounted();

  useEffect(() => {
    userService.getProfile().then(setProfile).catch(console.error);
  }, []);

  const fullName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : profile?.username || '';
  const initials = profile ? getInitials(fullName) : 'U';

  const userButton = (
    <button
      className={cn(
        'flex w-full items-center gap-2 rounded-md p-2 text-left text-sm outline-none cursor-pointer hover:bg-transparent bg-transparent border-none',
        isSidebarCollapsed && 'justify-center p-0'
      )}
    >
      <Avatar
        className={cn(
          'rounded-full shrink-0',
          isSidebarCollapsed ? 'h-9 w-9' : 'h-9 w-9'
        )}
      >
        <AvatarFallback className="rounded-full bg-[#008CBA] text-white text-sm font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      {!isSidebarCollapsed && (
        <div className="grid flex-1 text-left text-sm leading-normal gap-0.5">
          <span className="truncate font-medium">
            {profile?.first_name} {profile?.last_name || 'Usuario'}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {profile?.email || 'cargando...'}
          </span>
        </div>
      )}
    </button>
  );

  if (!mounted) {
    return userButton;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{userButton}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="start"
        side="top"
        sideOffset={8}
      >
        <div className="px-2 py-2">
          <p className="text-sm font-medium leading-tight">
            {profile?.first_name} {profile?.last_name || 'Usuario'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {profile?.email || 'cargando...'}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/pro">Actualizar a cuenta pro</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">Gestión de perfil</Link>
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

interface SidebarRoute {
  label: string;
  icon: React.ElementType;
  href: string;
  active: boolean;
  hasDropdown?: boolean;
  isProFeature?: boolean;
  onClick?: () => void;
  children?: Array<{
    label: string;
    href: string;
    active: boolean;
  }>;
}

interface SidebarRouteGroup {
  title: string;
  items: SidebarRoute[];
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useDashboard();
  const [openMenus, setOpenMenus] = useState<string[]>([
    '/dashboard/proveedores',
  ]);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const mounted = useMounted();

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
          label: 'Manual de procedimientos',
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
              label: 'Registrar nuevo proveedor',
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
          isProFeature: true,
          onClick: () => setIsProModalOpen(true),
        },
        {
          label: 'Compliance de Expediente de selección de Contratista',
          icon: IoDocumentTextOutline,
          href: '/dashboard/compliance',
          active: pathname.startsWith('/dashboard/compliance'),
        },
      ],
    },
    {
      title: 'Otros servicios',
      items: [
        {
          label: 'Consultor IA',
          icon: LiaRobotSolid,
          href: '/dashboard/consultor-ia',
          active: pathname.startsWith('/dashboard/consultor-ia'),
        },
        {
          label: 'Conócenos',
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
          label: 'Preguntas frecuentes',
          icon: BsQuestionCircle,
          href: '/dashboard/preguntas-frecuentes',
          active: pathname.startsWith('/dashboard/preguntas-frecuentes'),
        },
        {
          label: 'Acerca de',
          icon: InfoIcon,
          href: '/dashboard/acerca-de',
          active: pathname.startsWith('/dashboard/acerca-de'),
        },
      ],
    },
  ];

  const renderRouteItems = (group: SidebarRouteGroup, isMobile = false) => {
    return (
      <div key={group.title} className="mb-4">
        {(!isSidebarCollapsed || isMobile) && (
          <h3 className="px-4 text-[13px] font-medium text-gray-500 mb-2 tracking-wide">
            {group.title}
          </h3>
        )}
        <div className="space-y-1">
          {group.items.map((route) => {
            const hasChildren = route.hasDropdown;
            const isOpen = openMenus.includes(route.href);
            const isChildActive = route.children?.some((child) => child.active);
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
                  } else if (route.isProFeature) {
                    route.onClick?.();
                  }
                }}
                asChild={!hasChildren && !route.isProFeature}
              >
                {!hasChildren && !route.isProFeature ? (
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
                ) : route.isProFeature ? (
                  <>
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
                  </>
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
                    mounted ? (
                      <Popover>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <PopoverTrigger asChild>
                              {buttonContent}
                            </PopoverTrigger>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="bg-[#FFFFFF] text-black font-medium border-none ml-2 shadow-md z-[50]"
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
                              route.children.map((child) => (
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
                    ) : null
                  ) : mounted ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-[#FFFFFF] text-black font-medium border-none ml-2 shadow-md"
                      >
                        {route.label}
                      </TooltipContent>
                    </Tooltip>
                  ) : null
                ) : (
                  buttonContent
                )}

                {hasChildren &&
                  (!isSidebarCollapsed || isMobile) &&
                  isOpen &&
                  route.children &&
                  route.children.length > 0 && (
                    <div className="mt-1 ml-6 border-l-2 border-gray-100 pl-3 space-y-1">
                      {route.children.map((child) => (
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

          {/* User Navbar */}
          <div className="px-3 mt-auto mb-2 border-t border-gray-100 pt-4 bg-white">
            <UserNav />
          </div>

          {/* Copyright - visible solo cuando NO está colapsado */}
          {!isSidebarCollapsed && (
            <div className="px-3 pb-4 text-center">
              <p
                className="text-[7px] font-bold text-[#727272] leading-tight"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Copyright © 2026 Universitas Services | GESTOR CONTRATACIONES
              </p>
            </div>
          )}
        </div>
      </TooltipProvider>

      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
      />
    </div>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([
    '/dashboard/proveedores',
  ]);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const mounted = useMounted();

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
          label: 'Elaboración de Expediente de selección de Contratista',
          icon: PencilSquareIcon,
          href: '/dashboard/elaboracion',
          active: pathname.startsWith('/dashboard/elaboracion'),
          isProFeature: true,
          onClick: () => setIsProModalOpen(true),
        },
        {
          label: 'Compliance de Expediente de selección de Contratista',
          icon: IoDocumentTextOutline,
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
          label: 'Preguntas frecuentes',
          icon: BsQuestionCircle,
          href: '/dashboard/preguntas-frecuentes',
          active: pathname.startsWith('/dashboard/preguntas-frecuentes'),
        },
        {
          label: 'Acerca de',
          icon: InfoIcon,
          href: '/dashboard/acerca-de',
          active: pathname.startsWith('/dashboard/acerca-de'),
        },
      ],
    },
  ];

  return (
    <>
      {mounted ? (
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
                <h2 className="text-xl font-bold text-[#0b1e4c]">
                  Universitas
                </h2>
              </div>

              <ScrollArea className="flex-1 px-4 overflow-y-auto w-full h-[calc(100vh-160px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {routeGroups.map((group: SidebarRouteGroup) => (
                  <div key={group.title} className="mb-4">
                    <h3 className="px-4 text-[13px] font-medium text-gray-500 mb-2 tracking-wide">
                      {group.title}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((route) => {
                        const hasChildren = route.hasDropdown;
                        const isOpen = openMenus.includes(route.href);
                        const isChildActive = route.children?.some(
                          (child) => child.active
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
                                } else if (route.isProFeature) {
                                  route.onClick?.();
                                }
                              }}
                              asChild={!hasChildren && !route.isProFeature}
                            >
                              {!hasChildren && !route.isProFeature ? (
                                <Link href={route.href}>
                                  <ItemIcon
                                    style={ICON_STYLE}
                                    className="shrink-0 mr-3 text-black"
                                  />
                                  <span className="whitespace-normal leading-tight text-left break-words flex-1 text-[13.5px]">
                                    {route.label}
                                  </span>
                                </Link>
                              ) : route.isProFeature ? (
                                <>
                                  <ItemIcon
                                    style={ICON_STYLE}
                                    className="shrink-0 mr-3 text-black"
                                  />
                                  <span className="whitespace-normal leading-tight text-left break-words flex-1 text-[13.5px]">
                                    {route.label}
                                  </span>
                                </>
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
                                  {route.children.map((child) => (
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
                <UserNav />
              </div>
              <div className="px-4 pb-4 text-center">
                <p
                  className="text-[7px] font-bold text-[#727272] leading-tight"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Copyright © 2026 Universitas Services | GESTOR CONTRATACIONES
                </p>
              </div>
            </div>
          </SheetContent>

          <ProUpgradeModal
            isOpen={isProModalOpen}
            onClose={() => setIsProModalOpen(false)}
          />
        </Sheet>
      ) : (
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu />
        </Button>
      )}
    </>
  );
}
