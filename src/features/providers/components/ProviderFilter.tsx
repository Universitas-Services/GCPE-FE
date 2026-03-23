import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ProviderFilterProps {
  onSearch: (value: string) => void;
  onSortChange: (sort: 'alphabetical' | 'razon_social') => void;
}

export function ProviderFilter({
  onSearch,
  onSortChange,
}: ProviderFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center">
      <div className="relative w-full sm:w-[400px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por tipo de proveedor, RIF o correo..."
          className="pl-10 bg-white"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 bg-white">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[200px] p-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 mb-2 px-2">
                Ordenar por
              </p>
              <Button
                variant="ghost"
                className="w-full justify-start h-8 text-sm font-normal"
                onClick={() => onSortChange('alphabetical')}
              >
                Orden Alfabético
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-8 text-sm font-normal"
                onClick={() => onSortChange('razon_social')}
              >
                Razón Social
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
