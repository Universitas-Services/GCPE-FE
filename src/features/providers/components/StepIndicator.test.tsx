import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StepIndicator } from './StepIndicator';

describe('StepIndicator Component', () => {
  it('debe rendear la cantidad exacta de pasos indicados', () => {
    render(<StepIndicator currentStep={1} totalSteps={4} />);

    // Debería renderizar los números 1, 2, 3 y 4
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('debe aplicar la clase activa al paso actual (currentStep)', () => {
    // Rendemos situando el paso "3" como el activo
    render(<StepIndicator currentStep={3} totalSteps={5} />);

    const step3 = screen.getByText('3');
    const step1 = screen.getByText('1');

    // Comprobamos la clase "font-bold" que se aplica en cn() cuando es currentStep
    expect(step3).toHaveClass('font-bold');

    // Otro paso no debe tenerla
    expect(step1).not.toHaveClass('font-bold');
  });

  it('debe rendear sin errores un totalSteps de 1', () => {
    render(<StepIndicator currentStep={1} totalSteps={1} />);

    expect(screen.getByText('1')).toBeInTheDocument();

    // Con `queryByText` verificamos elementos que NO deberían existir
    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  it('no debería crashear si totalSteps es 0 o negativo (casos de borde visual)', () => {
    const { container } = render(
      <StepIndicator currentStep={1} totalSteps={0} />
    );

    // El array desde Array.from({length: 0}) no genera elementos
    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(container.firstChild).toBeInTheDocument(); // Simplemente renderiza Pagination vacío
  });
});
