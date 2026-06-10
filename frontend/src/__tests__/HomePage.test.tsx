/**
 * Tests for the Home page component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';

function renderWithRouter(component: React.ReactElement) {
  return render(<BrowserRouter>{component}</BrowserRouter>);
}

describe('HomePage', () => {
  it('renders the hero heading', () => {
    renderWithRouter(<HomePage />);
    expect(
      screen.getByRole('heading', { name: /understand your/i })
    ).toBeInTheDocument();
  });

  it('renders CTA button linking to calculator', () => {
    renderWithRouter(<HomePage />);
    const ctaLinks = screen.getAllByRole('link', { name: /calculate/i });
    const ctaLink = ctaLinks[0];
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', '/calculator');
  });

  it('renders all feature cards', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Carbon Calculator')).toBeInTheDocument();
    expect(screen.getByText('Emission Dashboard')).toBeInTheDocument();
    expect(screen.getByText('AI Sustainability Coach')).toBeInTheDocument();
    expect(screen.getByText('Scenario Simulator')).toBeInTheDocument();
    expect(screen.getByText('Progress Tracker')).toBeInTheDocument();
    expect(screen.getByText('Sustainability Challenges')).toBeInTheDocument();
  });

  it('renders how it works section', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Calculate')).toBeInTheDocument();
    expect(screen.getByText('Understand')).toBeInTheDocument();
    expect(screen.getByText('Improve')).toBeInTheDocument();
  });

  it('has proper accessibility landmark', () => {
    renderWithRouter(<HomePage />);
    const heroSection = screen.getByRole('heading', { name: /understand your/i });
    expect(heroSection).toBeInTheDocument();
  });
});
