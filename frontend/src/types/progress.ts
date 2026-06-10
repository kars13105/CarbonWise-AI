/**
 * TypeScript interfaces for progress tracking.
 */

export interface ProgressSnapshot {
  id: number;
  session_id: string;
  timestamp: string;
  total_emissions: number;
  carbon_score: number;
  breakdown: Record<string, number>;
}

export interface GoalResponse {
  target_reduction_percent: number;
  current_reduction_percent: number;
  target_date: string | null;
  is_achieved: boolean;
}

export interface ProgressResponse {
  snapshots: ProgressSnapshot[];
  goal: GoalResponse | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}
