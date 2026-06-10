/**
 * Tests for the Dashboard page component.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';

// Mock hooks
vi.mock('../hooks/useSession', () => ({
  useSession: () => 'test-session-id',
}));

vi.mock('../hooks/useProgress', () => ({
  useProgress: () => ({
    badges: [
      {
        id: 'eco_beginner',
        name: 'Eco Beginner',
        description: 'Calculate first footprint',
        icon: '🌱',
        earned: true,
      },
    ],
    progress: null,
    loading: false,
    error: null,
    refresh: vi.fn(),
    saveSnapshot: vi.fn(),
    setGoal: vi.fn(),
  }),
}));

// Mock recharts to avoid rendering issues in tests
vi.mock('recharts', () => ({
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  Cell: () => null,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Legend: () => null,
}));

function renderWithRouter(component: React.ReactElement) {
  return render(<BrowserRouter>{component}</BrowserRouter>);
}

describe('DashboardPage', () => {
  it('shows "no data" message when no result is available', () => {
    renderWithRouter(<DashboardPage />);
    expect(screen.getByText(/no data yet/i)).toBeInTheDocument();
  });

  it('shows link to calculator when no data', () => {
    renderWithRouter(<DashboardPage />);
    expect(screen.getByText(/go to calculator/i)).toBeInTheDocument();
  });

  it('renders dashboard when result is in sessionStorage', () => {
    const mockResult = {
      monthly_total_kg: 500,
      annual_total_kg: 6000,
      annual_total_tonnes: 6.0,
      breakdown: [
        { category: 'transport', monthly_kg: 200, annual_kg: 2400, annual_tonnes: 2.4, percentage: 40 },
        { category: 'electricity', monthly_kg: 150, annual_kg: 1800, annual_tonnes: 1.8, percentage: 30 },
        { category: 'flights', monthly_kg: 80, annual_kg: 960, annual_tonnes: 0.96, percentage: 16 },
        { category: 'food', monthly_kg: 50, annual_kg: 600, annual_tonnes: 0.6, percentage: 10 },
        { category: 'shopping', monthly_kg: 20, annual_kg: 240, annual_tonnes: 0.24, percentage: 4 },
      ],
      score: { score: 65, label: 'Moderate', color: '#F59E0B', description: 'Test desc' },
      largest_contributor: 'transport',
      smallest_contributor: 'shopping',
      insights: ['Transport contributes 40% of emissions.'],
    };

    sessionStorage.setItem('carbonResult', JSON.stringify(mockResult));
    renderWithRouter(<DashboardPage />);

    expect(screen.getByRole('heading', { name: /emission dashboard/i })).toBeInTheDocument();
    expect(screen.getByText('6.0')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  beforeEach(() => {
    sessionStorage.clear();
  });
});
