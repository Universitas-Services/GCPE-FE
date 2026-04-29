'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdminFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  pageSize: string;
  onPageSizeChange: (value: string) => void;
}

export function AdminFilters({
  searchValue,
  onSearchChange,
  pageSize,
  onPageSizeChange,
}: AdminFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Buscador */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="admin-search-input"
          placeholder="Buscar por nombre o email..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 bg-white"
        />
      </div>

      {/* Selectores de ordenamiento y paginación */}
      <div className="flex items-center gap-3">
        <Select value={pageSize} onValueChange={onPageSizeChange}>
          <SelectTrigger className="h-9 w-[100px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 filas</SelectItem>
            <SelectItem value="25">25 filas</SelectItem>
            <SelectItem value="50">50 filas</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
