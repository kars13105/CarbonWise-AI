/**
 * TypeScript interfaces for carbon footprint data.
 */

export interface TransportInput {
  car_km: number;
  bike_km: number;
  bus_km: number;
  train_km: number;
}

export interface FlightsInput {
  domestic: number;
  international: number;
}

export interface CarbonInput {
  transport: TransportInput;
  electricity_kwh: number;
  flights: FlightsInput;
  food_type: string;
  shopping_level: string;
}

export interface CategoryBreakdown {
  category: string;
  monthly_kg: number;
  annual_kg: number;
  annual_tonnes: number;
  percentage: number;
}

export interface ScoreInfo {
  score: number;
  label: string;
  color: string;
  description: string;
}

export interface CarbonResult {
  monthly_total_kg: number;
  annual_total_kg: number;
  annual_total_tonnes: number;
  breakdown: CategoryBreakdown[];
  score: ScoreInfo;
  largest_contributor: string;
  smallest_contributor: string;
  insights: string[];
}

export interface ScenarioInput {
  current: CarbonInput;
  projected: CarbonInput;
}

export interface ScenarioResult {
  current: CarbonResult;
  projected: CarbonResult;
  reduction_kg: number;
  reduction_percent: number;
}

export const DEFAULT_CARBON_INPUT: CarbonInput = {
  transport: { car_km: 0, bike_km: 0, bus_km: 0, train_km: 0 },
  electricity_kwh: 0,
  flights: { domestic: 0, international: 0 },
  food_type: 'non-vegetarian',
  shopping_level: 'medium',
};
