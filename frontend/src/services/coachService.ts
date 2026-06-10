/**
 * AI Coach API service functions.
 */

import api from './api';
import type { AICoachRequest, AICoachResponse } from '../types/coach';

export async function generatePlan(data: AICoachRequest): Promise<AICoachResponse> {
  const response = await api.post<AICoachResponse>('/api/ai-coach', data);
  return response.data;
}
