/**
 * Progress tracking API service functions.
 */

import api from './api';
import type { ProgressSnapshot, ProgressResponse, GoalResponse, Badge } from '../types/progress';

export async function saveSnapshot(data: {
  session_id: string;
  total_emissions: number;
  carbon_score: number;
  breakdown: Record<string, number>;
}): Promise<ProgressSnapshot> {
  const response = await api.post<ProgressSnapshot>('/api/progress', data);
  return response.data;
}

export async function getProgress(sessionId: string): Promise<ProgressResponse> {
  const response = await api.get<ProgressResponse>(`/api/progress/${sessionId}`);
  return response.data;
}

export async function setGoal(data: {
  session_id: string;
  target_reduction_percent: number;
  target_date?: string;
}): Promise<GoalResponse> {
  const response = await api.post<GoalResponse>('/api/progress/goal', data);
  return response.data;
}

export async function getChallenges(sessionId: string): Promise<Badge[]> {
  const response = await api.get<Badge[]>(`/api/challenges/${sessionId}`);
  return response.data;
}
