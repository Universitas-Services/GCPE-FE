'use client';

import React from 'react';
import Link from 'next/link';
import {
  MoreHorizontal,
  Building2,
  ShieldCheck,
  BookOpen,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { AdminUser } from '../../types/admin-users.types';

type DetailAction = 'providers' | 'compliance' | 'manuals';

interface UsersTableProps {
  users: AdminUser[];
  isLoading: boolean;
  onAction: (userId: number, action: DetailAction) => void;
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 6 }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function UsersTable({ users, isLoading, onAction }: UsersTableProps) {
  return (
    <Card className="border-none shadow-sm bg-white rounded-xl overflow-hidden p-0">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
            <TableHead className="font-semibold text-gray-700">
              Nombre y Apellido
            </TableHead>
            <TableHead className="font-semibold text-gray-700">Email</TableHead>
            <TableHead className="font-semibold text-gray-700 hidden md:table-cell">
              Teléfono
            </TableHead>
            <TableHead className="font-semibold text-gray-700 hidden lg:table-cell">
              Institución / Ente
            </TableHead>
            <TableHead className="font-semibold text-gray-700 hidden lg:table-cell">
              Cargo
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableSkeleton />
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-muted-foreground"
              >
                No se encontraron usuarios.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="group">
                <TableCell>
                  <Link
                    href={`/admin/dashboard/usuarios/${user.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:underline"
                  >
                    <span className="font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">
                  {user.telefono || '—'}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="text-sm text-gray-700 line-clamp-1">
                    {user.nombre_institucion_ente || '—'}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground hidden lg:table-cell">
                  {user.cargo || '—'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú de acciones</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Detalles del usuario
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer" asChild>
                        <Link
                          href={`/admin/dashboard/usuarios/${user.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <User className="mr-2 h-4 w-4 text-[#0091be]" />
                          Ver Detalle
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onAction(user.id, 'providers')}
                      >
                        <Building2 className="mr-2 h-4 w-4 text-[#0091be]" />
                        Ver Proveedores
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onAction(user.id, 'compliance')}
                      >
                        <ShieldCheck className="mr-2 h-4 w-4 text-[#0091be]" />
                        Ver Compliance
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onAction(user.id, 'manuals')}
                      >
                        <BookOpen className="mr-2 h-4 w-4 text-[#0091be]" />
                        Ver Manuales
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
