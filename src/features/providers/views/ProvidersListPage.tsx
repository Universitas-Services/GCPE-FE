'use client';

import { useEffect, useState, useCallback } from 'react';
import { getProviders } from '../services/providers.service';
import { ProviderListResponse } from '../types/provider.types';
import { ProviderTable } from '../components/ProviderTable';
import { ProviderFilter } from '../components/ProviderFilter';

export default function ProvidersListPage() {
  const [providers, setProviders] = useState<ProviderListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProviders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProviders({
        q: debouncedSearch,
        page,
        page_size: pageSize,
      });

      // Determine items correctly depending on backend format
      const items = Array.isArray(data)
        ? data
        : data.items || data.results || data.data || [];
      const totalItems = data.total ?? data.count ?? items.length;

      setProviders(items);
      setTotal(totalItems);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los proveedores. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, page, pageSize]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1); // Reset pagination on new search
  };

  const handleSort = (sortType: 'alphabetical' | 'razon_social') => {
    const sorted = [...providers].sort((a, b) => {
      if (sortType === 'alphabetical') {
        return a.nombre_proveedor.localeCompare(b.nombre_proveedor);
      } else {
        return a.nombre_proveedor.localeCompare(b.nombre_proveedor);
      }
    });
    setProviders(sorted);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6 md:p-8 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col">
        <h1 className="app-title">Proveedores Registrados</h1>
        <p className="text-gray-500 mt-[22.5px]">
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
        <ProviderTable providers={providers} isLoading={isLoading} />

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando{' '}
                  <span className="font-medium">
                    {(page - 1) * pageSize + 1}
                  </span>{' '}
                  a{' '}
                  <span className="font-medium">
                    {Math.min(page * pageSize, total)}
                  </span>{' '}
                  de <span className="font-medium">{total}</span> resultados
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Anterior</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    // Simple logic to show current page surroundings if totalPages > 5
                    let pageNum = i + 1;
                    if (totalPages > 5 && page > 3) {
                      pageNum = page - 2 + i;
                      if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === pageNum ? 'z-10 bg-[#005282] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005282]' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'} focus:z-20 focus:outline-offset-0`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Siguiente</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
