/**
 * TypeScript interfaces for AI coach.
 */

export interface AICoachRequest {
  total_annual_emissions: number;
  breakdown: Record<string, number>;
  carbon_score: number;
  food_type: string;
  shopping_level: string;
}

export interface AICoachResponse {
  plan: string;
  generated_at: string;
}
