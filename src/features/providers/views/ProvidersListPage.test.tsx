import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProvidersListPage from './ProvidersListPage';
import { getProviders } from '../services/providers.service';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

// Mock del servicio de fetch
vi.mock('../services/providers.service', () => ({
  getProviders: vi.fn(),
}));

const mockDataData = [
  { id: 1, rif_proveedor: 'J-123', nombre_proveedor: 'Zebra Corp' },
  { id: 2, rif_proveedor: 'J-456', nombre_proveedor: 'Alpha Inc' },
];

describe('ProvidersListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe rendear estado de carga y luego la tabla con datos', async () => {
    (getProviders as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      {
        items: mockDataData,
        total: 2,
      }
    );

    render(<ProvidersListPage />);

    expect(getProviders).toHaveBeenCalledWith({
      q: '',
      page: 1,
      page_size: 10,
    });

    // Esperar a que rendericen los datos mockeados en la tabla (Alpha Inc, Zebra Corp)
    await waitFor(() => {
      expect(screen.getByText('Zebra Corp')).toBeInTheDocument();
      expect(screen.getByText('Alpha Inc')).toBeInTheDocument();
    });
  });

  it('debe mostrar error si falla el servicio', async () => {
    (getProviders as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('API caída')
    );

    // Evitar ruido en consola de errores durante el test
    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    render(<ProvidersListPage />);

    await waitFor(() => {
      expect(
        screen.getByText(
          'No se pudieron cargar los proveedores. Intente nuevamente.'
        )
      ).toBeInTheDocument();
    });
  });

  it('debe ejecutar la busqueda disparando nuevamente getProviders con el searchTerm y reinicializar en la pagina 1', async () => {
    const user = userEvent.setup();
    (getProviders as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      items: [],
      total: 0,
    });

    render(<ProvidersListPage />);

    // Rellenamos el input de búsqueda del ProviderFilter
    const searchInput = screen.getByPlaceholderText(
      'Buscar por nombre, RIF o correo...'
    );

    await act(async () => {
      await user.type(searchInput, 'Zebra');
    });

    // El useEffect tiene un debounce de 500ms
    await waitFor(
      () => {
        // La segunda vez que llama incluye 'Zebra' (debouncedSearch)
        expect(getProviders).toHaveBeenCalledWith({
          q: 'Zebra',
          page: 1,
          page_size: 10,
        });
      },
      { timeout: 1000 }
    );
  });
});
