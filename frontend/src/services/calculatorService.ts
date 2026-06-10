/**
 * Calculator API service functions.
 */

import api from './api';
import type { CarbonInput, CarbonResult, ScenarioInput, ScenarioResult } from '../types/carbon';

export async function calculateFootprint(data: CarbonInput): Promise<CarbonResult> {
  const response = await api.post<CarbonResult>('/api/calculate', data);
  return response.data;
}

export async function simulateScenario(data: ScenarioInput): Promise<ScenarioResult> {
  const response = await api.post<ScenarioResult>('/api/simulate', data);
  return response.data;
}
