import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ManualForm } from './ManualForm';
import * as manualService from '../services/manualService';
import { toast } from 'sonner';

// Mock servicios y librerías externas
vi.mock('../services/manualService', () => ({
  createManual: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock del icono Loader para que Vitest no se trabe en lucide-react (opcional pero bueno)
vi.mock('lucide-react', () => ({
  Loader2: () => <div data-testid="loader" />,
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
}));

// En un entorno JSDOM, los ResizeObserver fallan, por lo que a veces los Dialogs crashean,
// pero radil/ui y shadcn usan implementaciones robustas. Si hiciese falta se mockea aquí.
class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
global.ResizeObserver = ResizeObserver;

describe('ManualForm Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe rendear todos los campos del formulario', () => {
    render(<ManualForm />);
    expect(
      screen.getByLabelText(/1\. Indique correo electrónico/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/2\. Indique el Nombre de la Institución/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/3\. Indique el Acrónimo y\/o siglas/i)
    ).toBeInTheDocument();
  });

  it('debe validar cuando los campos se envían vacíos', async () => {
    const user = userEvent.setup();
    render(<ManualForm />);

    // Tratamos de enviar el formulario vacío
    const submitBtn = screen.getByRole('button', { name: /Elaborar manual/i });
    await user.click(submitBtn);

    // Zod disparará mensajes de error para cada campo vacío requerido
    expect(
      await screen.findByText('El correo electrónico es requerido')
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        'El nombre de la Institución/Ente/Órgano es requerido'
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText('El acrónimo o siglas son requeridos')
    ).toBeInTheDocument();

    expect(manualService.createManual).not.toHaveBeenCalled();
  });

  it('debe enviar la data válida, invocar el servicio y mostrar el toast de éxito', async () => {
    const user = userEvent.setup();
    render(<ManualForm />);

    // Rellenamos el form
    await user.type(
      screen.getByLabelText(/Correo electrónico/i),
      'prueba@example.com'
    );
    await user.type(
      screen.getByLabelText(/Nombre de la Institución/i),
      'Ministerio X'
    );
    await user.type(screen.getByLabelText(/Acrónimo/i), 'MX');
    await user.type(
      screen.getByLabelText(/Administrativa y Financiera/i),
      'Directorado'
    );
    await user.type(
      screen.getByLabelText(/Sistema y Tecnología/i),
      'Sistemas Dir'
    );

    // Configuramos resolucion satisfactoria
    (
      manualService.createManual as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(true);

    const submitBtn = screen.getByRole('button', { name: /Elaborar manual/i });
    await user.click(submitBtn);

    // Valida Toast Informativo antes de acabar request
    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(Object)
      );
    });

    // Validar el payload
    expect(manualService.createManual).toHaveBeenCalledWith({
      correo_electronico_manual: 'prueba@example.com',
      nombre_institucion_ente: 'Ministerio X',
      siglas_institucion_ente: 'MX',
      nombre_unidad_admin_financiera: 'Directorado',
      nombre_unidad_sistemas_tecnologia: 'Sistemas Dir',
    });

    // Valida Toast de exito final
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(Object)
      );
    });
  });

  it('debe disparar el dialogo de Dialog/Alert (Fallo) si falla el servicio', async () => {
    const user = userEvent.setup();
    render(<ManualForm />);

    // Fill required
    await user.type(
      screen.getByLabelText(/Correo electrónico/i),
      'error@example.com'
    );
    await user.type(
      screen.getByLabelText(/Nombre de la Institución/i),
      'Ministerio Y'
    );
    await user.type(screen.getByLabelText(/Acrónimo/i), 'MY');
    await user.type(screen.getByLabelText(/Administrativa y Financiera/i), 'A');
    await user.type(screen.getByLabelText(/Sistema y Tecnología/i), 'B');

    // Mockeamos la caída del servicio
    (
      manualService.createManual as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error('Network error'));

    const submitBtn = screen.getByRole('button', { name: /Elaborar manual/i });
    await user.click(submitBtn);

    // Assert de UI del modal - Dependiendo de ManualAlertDialog, debe exponer el mensaje de dialogo
    expect(
      await screen.findByText(/Fallo en el envío del correo electrónico/i)
    ).toBeInTheDocument();
  });
});
