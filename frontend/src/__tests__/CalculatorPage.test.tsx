/**
 * Tests for the Calculator page component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CalculatorPage from '../pages/CalculatorPage';

// Mock the calculator service
vi.mock('../services/calculatorService', () => ({
  calculateFootprint: vi.fn().mockResolvedValue({
    monthly_total_kg: 500,
    annual_total_kg: 6000,
    annual_total_tonnes: 6.0,
    breakdown: [
      {
        category: 'transport',
        monthly_kg: 200,
        annual_kg: 2400,
        annual_tonnes: 2.4,
        percentage: 40,
      },
      {
        category: 'electricity',
        monthly_kg: 150,
        annual_kg: 1800,
        annual_tonnes: 1.8,
        percentage: 30,
      },
      {
        category: 'flights',
        monthly_kg: 80,
        annual_kg: 960,
        annual_tonnes: 0.96,
        percentage: 16,
      },
      {
        category: 'food',
        monthly_kg: 50,
        annual_kg: 600,
        annual_tonnes: 0.6,
        percentage: 10,
      },
      {
        category: 'shopping',
        monthly_kg: 20,
        annual_kg: 240,
        annual_tonnes: 0.24,
        percentage: 4,
      },
    ],
    score: {
      score: 65,
      label: 'Moderate',
      color: '#F59E0B',
      description: 'Room for improvement.',
    },
    largest_contributor: 'transport',
    smallest_contributor: 'shopping',
    insights: ['Transport contributes 40% of your emissions.'],
  }),
}));

function renderWithRouter(component: React.ReactElement) {
  return render(<BrowserRouter>{component}</BrowserRouter>);
}

describe('CalculatorPage', () => {
  it('renders the calculator heading', () => {
    renderWithRouter(<CalculatorPage />);
    expect(
      screen.getByRole('heading', { name: /carbon footprint/i })
    ).toBeInTheDocument();
  });

  it('shows transport step first', () => {
    renderWithRouter(<CalculatorPage />);
    expect(screen.getByLabelText(/car/i)).toBeInTheDocument();
  });

  it('navigates to next step on Next button click', () => {
    renderWithRouter(<CalculatorPage />);
    const nextButton = screen.getByRole('button', { name: /next step/i });
    fireEvent.click(nextButton);
    expect(screen.getByLabelText(/monthly electricity/i)).toBeInTheDocument();
  });

  it('shows step indicator', () => {
    renderWithRouter(<CalculatorPage />);
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
  });

  it('allows entering car km value', () => {
    renderWithRouter(<CalculatorPage />);
    const carInput = screen.getByLabelText(/car/i) as HTMLInputElement;
    fireEvent.change(carInput, { target: { value: '500' } });
    expect(carInput.value).toBe('500');
  });

  it('navigates back to previous step', () => {
    renderWithRouter(<CalculatorPage />);
    const nextButton = screen.getByRole('button', { name: /next step/i });
    fireEvent.click(nextButton); // go to step 2

    const backButton = screen.getByRole('button', { name: /previous step/i });
    fireEvent.click(backButton); // back to step 1
    expect(screen.getByLabelText(/car/i)).toBeInTheDocument();
  });

  it('disables back button on first step', () => {
    renderWithRouter(<CalculatorPage />);
    const backButton = screen.getByRole('button', { name: /previous step/i });
    expect(backButton).toBeDisabled();
  });
});
