'use client';

import { useEffect, useState } from 'react';
import { getProviders } from '../services/providers.service';
import { ProviderListResponse } from '../types/provider.types';
import { ProviderTable } from '../components/ProviderTable';
import { ProviderFilter } from '../components/ProviderFilter';

export default function ProvidersListPage() {
  const [providers, setProviders] = useState<ProviderListResponse[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<
    ProviderListResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProviders();
        // Ensure data is an array before setting
        const safeData = Array.isArray(data) ? data : [];
        setProviders(safeData);
        setFilteredProviders(safeData);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los proveedores. Intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleSearch = (term: string) => {
    const lowerTerm = term.toLowerCase();
    const filtered = providers.filter(
      (p) =>
        p.nombre_proveedor.toLowerCase().includes(lowerTerm) ||
        p.rif_proveedor.toLowerCase().includes(lowerTerm) ||
        p.correo_proveedor.toLowerCase().includes(lowerTerm)
    );
    setFilteredProviders(filtered);
  };

  const handleSort = (sortType: 'alphabetical' | 'razon_social') => {
    const sorted = [...filteredProviders].sort((a, b) => {
      if (sortType === 'alphabetical') {
        return a.nombre_proveedor.localeCompare(b.nombre_proveedor);
      } else {
        // Assuming Razon Social maps to nombre_proveedor for now as it's the main company name
        return a.nombre_proveedor.localeCompare(b.nombre_proveedor);
      }
    });
    setFilteredProviders(sorted);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#0b1e4c]">
          Proveedores Registrados
        </h1>
        <p className="text-gray-500">
          Gestiona y monitorea la base de datos de proveedores activos.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        {error && (
          <div className="mb-4 p-4 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}
        <ProviderFilter onSearch={handleSearch} onSortChange={handleSort} />
        <ProviderTable providers={filteredProviders} isLoading={isLoading} />
      </div>
    </div>
  );
}
