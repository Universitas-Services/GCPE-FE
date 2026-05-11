import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from './LoginForm';
import { useAuth } from '../context/AuthContext';

// Mock del contexto de autenticación
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('LoginForm UI & Integration', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      login: mockLogin,
    });
  });

  it('should render all form fields correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar sesión/i })).toBeInTheDocument();
  });

  it('should display validation errors if fields are empty on submit', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    const submitBtn = screen.getByRole('button', { name: /Iniciar sesión/i });
    await user.click(submitBtn);

    // Zod validation messages
    expect(await screen.findByText('El correo electrónico es requerido')).toBeInTheDocument();
    expect(await screen.findByText('La contraseña es requerida')).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should call login from useAuth when valid data is submitted', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    await user.type(screen.getByLabelText(/Correo electrónico/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Contraseña/i), 'password123');
    
    // Configurar login para que se resuelva exitosamente
    mockLogin.mockResolvedValueOnce(undefined);
    
    const submitBtn = screen.getByRole('button', { name: /Iniciar sesión/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('should display global error message if login throws an error', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    await user.type(screen.getByLabelText(/Correo electrónico/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Contraseña/i), 'wrong');
    
    mockLogin.mockRejectedValueOnce(new Error('Credenciales inválidas dictadas por API'));
    
    const submitBtn = screen.getByRole('button', { name: /Iniciar sesión/i });
    await user.click(submitBtn);

    expect(await screen.findByText(/Credenciales inválidas dictadas por API/i)).toBeInTheDocument();
  });
});
