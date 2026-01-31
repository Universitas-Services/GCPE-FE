import { expect, test, describe, vi } from 'vitest';
import Home from './page';
import { redirect } from 'next/navigation';

// Mockeamos next/navigation para evitar que lance el error real y poder espiar la llamada
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('Home Page', () => {
  test('debe redirigir inmediatamente a /login', () => {
    // Al ser un componente que solo redirige, podemos probarlo invocándolo como función
    Home();

    // Verificamos que la función redirect haya sido llamada con '/login'
    expect(redirect).toHaveBeenCalledWith('/login');
  });
});
