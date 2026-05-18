import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { ProviderRegistrationWizard } from './ProviderRegistrationWizard';
import { ProviderFormProvider } from '../context/ProviderFormContext';
import { createProvider } from '../services/providers.service';
import { useRouter } from 'next/navigation';

// Evadir Radix UI Popovers fallando en JSDOM
beforeAll(() => {
  window.PointerEvent =
    class PointerEvent extends Event {} as unknown as typeof window.PointerEvent;
});

// Mock del cliente next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock del servicio
vi.mock('../services/providers.service', () => ({
  createProvider: vi.fn(),
}));

// Mock de modales para eludir portales de Radix y FocusGuards
vi.mock('./ProviderSuccessModal', () => ({
  ProviderSuccessModal: ({ isOpen }: Record<string, unknown>) =>
    isOpen ? <div>Registro Exitoso</div> : null,
}));

vi.mock('./ProviderErrorModal', () => ({
  ProviderErrorModal: ({ isOpen, errorMessage }: Record<string, unknown>) =>
    isOpen ? <div>{errorMessage as string}</div> : null,
}));

// Mock del esquema para que apruebe cualquier cosa instantáneamente y nos deje navegar libremente
vi.mock('../schemas/provider.schema', () => ({
  providerSchema: {
    pick: () => ({
      parse: vi.fn(), // Al no lanzar excepcion asume que Zod aprobó la validación
    }),
  },
}));

describe('ProviderRegistrationWizard', () => {
  let mockPush: unknown;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPush = vi.fn();
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
  });

  const renderWizard = () => {
    return render(
      <ProviderFormProvider>
        <ProviderRegistrationWizard />
      </ProviderFormProvider>
    );
  };

  it('debe rendear el wizard en el Paso 1 y navegar al 2 tras dar clic en Siguiente (al estar mockeado el schema Zod)', async () => {
    const user = userEvent.setup();
    renderWizard();

    // Verificamos Paso 1
    expect(
      screen.getByRole('heading', {
        name: 'Datos de identificación del proveedor',
      })
    ).toBeInTheDocument();

    // Verificamos de paso que renderiza StepIndicator
    expect(screen.getByText('1')).toBeInTheDocument();

    const btnNext = screen.getByRole('button', { name: /siguiente/i });

    await act(async () => {
      await user.click(btnNext);
    });

    // Validamos haber saltado al Paso 2
    expect(screen.getByText(/requisitos legales/i)).toBeInTheDocument();

    const btnPrev = screen.getByRole('button', { name: /anterior/i });

    await act(async () => {
      await user.click(btnPrev);
    });

    // Validamos haber vuelto al Paso 1
    expect(
      screen.getByRole('heading', {
        name: 'Datos de identificación del proveedor',
      })
    ).toBeInTheDocument();
  });

  it('debe llamar a createProvider en el flujo Finalizar (Paso 4) y mostrar Modal Exitoso', async () => {
    const user = userEvent.setup();
    (createProvider as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
    });

    renderWizard();

    const btnNext = screen.getByRole('button', {
      name: /siguiente|finalizar/i,
    });

    // Saltar al Paso 2
    await act(async () => await user.click(btnNext));
    // Saltar al Paso 3
    await act(
      async () =>
        await user.click(
          screen.getByRole('button', { name: /siguiente|finalizar/i })
        )
    );
    // Saltar al Paso 4
    await act(
      async () =>
        await user.click(
          screen.getByRole('button', { name: /siguiente|finalizar/i })
        )
    );

    expect(screen.getByText(/finalizar registro/i)).toBeInTheDocument();

    const btnFinish = screen.getByRole('button', { name: /finalizar/i });

    await act(async () => {
      await user.click(btnFinish);
    });

    // Se asegura de que se llamó al backend con los datos recolectados (en este test, datos limpios por default)
    expect(createProvider).toHaveBeenCalledTimes(1);

    // Dialog success (Asumiendo que ProviderSuccessModal expone esta palabra clave en pantalla)
    const successTitle = await screen.findByText('Registro Exitoso');
    expect(successTitle).toBeInTheDocument();
  });

  it('debe atrapar error de API en el formulario final (Paso 4), y abrir ProviderErrorModal detectando colisión especifica', async () => {
    const user = userEvent.setup();

    // Mockeamos la estructura específica del error de fecha futura que tiene el Wizard implementada en código
    const specificError = {
      detail: [
        {
          loc: ['fecha_estado_financiero'],
          msg: 'La fecha no puede ser futura',
        },
      ],
    };
    (createProvider as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      specificError
    );

    // Silenciamos logs
    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    renderWizard();

    // Hacemos Next 3 veces para llegar al Paso 4
    for (let i = 0; i < 3; i++) {
      const next = screen.getByRole('button', { name: /siguiente|finalizar/i });
      await act(async () => await user.click(next));
    }

    const btnFinish = screen.getByRole('button', { name: /finalizar/i });
    await act(async () => await user.click(btnFinish));

    // Validar mensaje de validación filtrado
    const errorText = await screen.findByText(
      'La fecha del estado financiero no puede ser futura.'
    );
    expect(errorText).toBeInTheDocument();
  });
});
