import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChangePasswordForm } from './ChangePasswordForm';

// Dependencias
import { useAuth } from '@/features/auth/context/AuthContext';
import { changePasswordService } from '../services/change-password.service';
import Swal from 'sweetalert2';

// 1. Mocks
vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../services/change-password.service', () => ({
  changePasswordService: {
    changePassword: vi.fn(),
  },
}));

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe('ChangePasswordForm Integration', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      logout: mockLogout,
    });
  });

  it('debe rendear todos los campos vacíos', () => {
    render(<ChangePasswordForm />);
    expect(screen.getByLabelText(/Contraseña anterior/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Nueva contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar nueva contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cambiar contraseña/i })).toBeInTheDocument();
  });

  it('debe impedir envío en blanco o passwords que no matchean', async () => {
    const user = userEvent.setup();
    render(<ChangePasswordForm />);

    // Rellenamos solo la actual, para disparar las demas
    await user.type(screen.getByLabelText(/Contraseña anterior/i), 'actual123');
    // Rellenar las nuevas sin que coincidan
    await user.type(screen.getByLabelText(/^Nueva contraseña/i), 'nuevo12345');
    await user.type(screen.getByLabelText(/Confirmar nueva/i), 'diferente');

    const submitBtn = screen.getByRole('button', { name: /Cambiar contraseña/i });
    await user.click(submitBtn);

    // Assert custom Zod refinement (Las contraseñas no coinciden)
    expect(await screen.findByText('Las contraseñas no coinciden')).toBeInTheDocument();

    expect(changePasswordService.changePassword).not.toHaveBeenCalled();
    expect(Swal.fire).not.toHaveBeenCalled();
  });

  it('debe enviar data correcta al servicio, mostrar exito y desloguear', async () => {
    const user = userEvent.setup();
    render(<ChangePasswordForm />);

    await user.type(screen.getByLabelText(/Contraseña anterior/i), 'oldPass2025');
    await user.type(screen.getByLabelText(/^Nueva contraseña/i), 'newPass2025');
    await user.type(screen.getByLabelText(/Confirmar nueva/i), 'newPass2025');

    // Servicio simulato
    (changePasswordService.changePassword as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(true);

    const submitBtn = screen.getByRole('button', { name: /Cambiar contraseña/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(changePasswordService.changePassword).toHaveBeenCalledWith({
        currentPassword: 'oldPass2025',
        newPassword: 'newPass2025',
        confirmPassword: 'newPass2025',
      });
    });

    // Validar visual y mock
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '¡Éxito!',
        icon: 'success'
      })
    );

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('debe atrapar error del API y pintar pop-up Swal de error global', async () => {
    const user = userEvent.setup();
    render(<ChangePasswordForm />);

    await user.type(screen.getByLabelText(/Contraseña anterior/i), 'old');
    await user.type(screen.getByLabelText(/^Nueva contraseña/i), 'nuewowewewo');
    await user.type(screen.getByLabelText(/Confirmar nueva/i), 'nuewowewewo');

    // Simular caida API dictada en el backend
    (changePasswordService.changePassword as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('La contraseña vieja no es correcta')
    );

    const submitBtn = screen.getByRole('button', { name: /Cambiar contraseña/i });
    await user.click(submitBtn);

    // Verifica la llamada
    await waitFor(() => expect(changePasswordService.changePassword).toHaveBeenCalled());

    // Verifica que Swal disparó la alerta general
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Error',
        icon: 'error'
      })
    );

    // Verifica que el error provisto se pintó en el alert rojo
    expect(await screen.findByText(/La contraseña vieja no es correcta/i)).toBeInTheDocument();
  });
});
