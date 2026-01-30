import { expect, test, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home Page', () => {
  test('debe mostrar el título principal', () => {
    render(<Home />);
    // Busca un encabezado (h1-h6) que contenga el texto específico de tu página
    const heading = screen.getByRole('heading', {
      name: /To get started, edit the page.tsx file./i,
    });

    // Verifica que el elemento exista en el DOM
    expect(heading).toBeInTheDocument();
  });

  test('debe tener un enlace a "Deploy Now" con la URL correcta', () => {
    render(<Home />);
    // Busca el enlace por su texto
    const deployLink = screen.getByRole('link', { name: /Deploy Now/i });

    // Verifica que sea visible y tenga el href correcto
    expect(deployLink).toBeVisible();
    expect(deployLink).toHaveAttribute(
      'href',
      'https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
    );
  });

  test('debe mostrar el logo de Next.js', () => {
    render(<Home />);
    // Busca la imagen por su texto alternativo (alt)
    const logo = screen.getByAltText('Next.js logo');

    expect(logo).toBeInTheDocument();
  });
});
