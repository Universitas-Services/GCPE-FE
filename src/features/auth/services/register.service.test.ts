import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { registerService, RegisterCredentials } from './register.service';

describe('Register Service', () => {
  const mockApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    const mockData: RegisterCredentials = {
      email: 'newuser@example.com',
      password: 'mypassword123',
      confirm_password: 'mypassword123',
      first_name: 'John',
      last_name: 'Doe',
      telefono: '1234567890',
    };

    it('should complete registration successfully', async () => {
      const mockResponse = {
        message: 'Usuario creado exitosamente',
        user: {
          id: 10,
          email: 'newuser@example.com',
          first_name: 'John',
          last_name: 'Doe',
        },
      };

      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as unknown as Response);

      const result = await registerService.register(mockData);

      expect(fetchSpy).toHaveBeenCalledWith(`${mockApiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockData),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error with specific "detail" provided by API', async () => {
      const errorData = { detail: 'El usuario ya existe con este correo' };

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        json: async () => errorData,
      } as unknown as Response);

      await expect(registerService.register(mockData)).rejects.toThrow('El usuario ya existe con este correo');
    });

    it('should parse field validations errors array to a readable string', async () => {
      const errorData = {
        email: ['Este campo debe ser un correo válido'],
        password: 'Contraseña muy débil',
      };

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        json: async () => errorData,
      } as unknown as Response);

      await expect(registerService.register(mockData)).rejects.toThrow('email: Este campo debe ser un correo válido, password: Contraseña muy débil');
    });

    it('should throw fallback error if server status fails without json detail', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => { throw new Error('Bad Gateway'); },
      } as unknown as Response);

      await expect(registerService.register(mockData)).rejects.toThrow('Error 502: No se pudo completar el registro');
    });
  });
});
