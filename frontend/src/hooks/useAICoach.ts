/**
 * AI Coach hook — manages AI sustainability plan generation lifecycle.
 */

import { useState, useCallback } from 'react';
import { isAxiosError } from 'axios';
import type { AICoachResponse } from '../types/coach';
import { generatePlan } from '../services/coachService';

interface UseAICoachReturn {
  plan: AICoachResponse | null;
  loading: boolean;
  error: string | null;
  generate: (data: {
    total_annual_emissions: number;
    breakdown: Record<string, number>;
    carbon_score: number;
    food_type: string;
    shopping_level: string;
  }) => Promise<void>;
  reset: () => void;
}

export function useAICoach(): UseAICoachReturn {
  const [plan, setPlan] = useState<AICoachResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (data: {
      total_annual_emissions: number;
      breakdown: Record<string, number>;
      carbon_score: number;
      food_type: string;
      shopping_level: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await generatePlan(data);
        setPlan(result);
      } catch (err: unknown) {
        let message = 'Failed to generate sustainability plan. Please try again.';
        if (isAxiosError(err) && err.response?.data?.detail) {
          message = err.response.data.detail;
          // Handle quota limits gracefully
          if (err.response.status === 429 || message.includes('429')) {
            message = 'You have exceeded your AI generation quota. Please try again later or verify your API key.';
          }
        } else if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setPlan(null);
    setError(null);
  }, []);

  return { plan, loading, error, generate, reset };
}
