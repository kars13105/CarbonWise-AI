/**
 * Centralized emission factors and constants for CarbonWise AI frontend.
 * Mirror of backend constants for client-side calculations (simulator).
 */

// Transport emission factors (kg CO2 per km)
export const TRANSPORT_FACTORS = {
  car: 0.19,
  bus: 0.08,
  train: 0.04,
  bike: 0.10,
} as const;

// Electricity emission factor (kg CO2 per kWh)
export const ELECTRICITY_FACTOR = 0.82;

// Flight emission factors (kg CO2 per flight)
export const FLIGHT_FACTORS = {
  domestic: 255.0,
  international: 1100.0,
} as const;

// Food emission factors (kg CO2 per month)
export const FOOD_FACTORS: Record<string, number> = {
  vegan: 50.0,
  vegetarian: 100.0,
  'non-vegetarian': 200.0,
};

// Shopping emission factors (kg CO2 per month)
export const SHOPPING_FACTORS: Record<string, number> = {
  low: 30.0,
  medium: 100.0,
  high: 200.0,
};

// Score interpretation
export const SCORE_LABELS = {
  excellent: { min: 90, max: 100, label: 'Excellent', color: '#4a7c59' },
  good: { min: 70, max: 89, label: 'Good', color: '#6db06b' },
  moderate: { min: 50, max: 69, label: 'Moderate', color: '#f5c542' },
  needs_improvement: { min: 0, max: 49, label: 'Needs Improvement', color: '#c44e4e' },
} as const;

// Chart colors for categories
export const CATEGORY_COLORS: Record<string, string> = {
  transport: '#7eb8da',
  electricity: '#ffd93d',
  flights: '#c4a7e7',
  food: '#a8d8a8',
  shopping: '#ffb5a7',
};

// Category display names
export const CATEGORY_LABELS: Record<string, string> = {
  transport: 'Transport',
  electricity: 'Electricity',
  flights: 'Flights',
  food: 'Food',
  shopping: 'Shopping',
};

// Global averages for context (tonnes CO2/year per capita)
export const GLOBAL_AVERAGES: Record<string, number> = {
  world: 4.7,
  usa: 14.7,
  eu: 6.1,
  india: 1.9,
  china: 7.7,
};

export const MONTHS_PER_YEAR = 12;
