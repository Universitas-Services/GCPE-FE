import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { ProviderFilter } from './ProviderFilter';

// Mock UI Popover para evitar los problemas de foco y portales de Radix en JSDOM
vi.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PopoverContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

beforeAll(() => {
  window.PointerEvent =
    class PointerEvent extends Event {} as unknown as typeof window.PointerEvent;
});

describe('ProviderFilter', () => {
  const onSearchMock = vi.fn();
  const onSortChangeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input and button correctly', () => {
    render(
      <ProviderFilter onSearch={onSearchMock} onSortChange={onSortChangeMock} />
    );

    expect(
      screen.getByPlaceholderText('Buscar por nombre, RIF o correo...')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /filtros/i })
    ).toBeInTheDocument();
  });

  it('calls onSearch when typing in the input field', async () => {
    const user = userEvent.setup();
    render(
      <ProviderFilter onSearch={onSearchMock} onSortChange={onSortChangeMock} />
    );

    const input = screen.getByPlaceholderText(
      'Buscar por nombre, RIF o correo...'
    );

    await user.type(input, 'J-1234');

    expect(onSearchMock).toHaveBeenCalledTimes(6); // Se llama por cada tecla
    expect(onSearchMock).toHaveBeenLastCalledWith('J-1234');
  });

  it('opens filter popover and triggers onSortChange when options are clicked', async () => {
    const user = userEvent.setup();
    render(
      <ProviderFilter onSearch={onSearchMock} onSortChange={onSortChangeMock} />
    );

    // Al estar mockeado el Popover, el contenido siempre estará en el DOM
    const btnAlpha = screen.getByRole('button', { name: /orden alfabético/i });
    const btnRazon = screen.getByRole('button', { name: /razón social/i });

    expect(btnAlpha).toBeInTheDocument();
    expect(btnRazon).toBeInTheDocument();

    await user.click(btnAlpha);
    expect(onSortChangeMock).toHaveBeenCalledWith('alphabetical');

    await user.click(btnRazon);
    expect(onSortChangeMock).toHaveBeenCalledWith('razon_social');
  });
});
