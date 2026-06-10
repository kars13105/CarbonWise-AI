/**
 * Calculator hook — manages calculator form state and submission.
 */

import { useState, useCallback } from 'react';
import type { CarbonInput, CarbonResult } from '../types/carbon';
import { DEFAULT_CARBON_INPUT } from '../types/carbon';
import { calculateFootprint } from '../services/calculatorService';

interface UseCalculatorReturn {
  input: CarbonInput;
  result: CarbonResult | null;
  loading: boolean;
  error: string | null;
  updateInput: (updates: Partial<CarbonInput>) => void;
  updateTransport: (updates: Partial<CarbonInput['transport']>) => void;
  updateFlights: (updates: Partial<CarbonInput['flights']>) => void;
  submit: () => Promise<void>;
  reset: () => void;
}

export function useCalculator(): UseCalculatorReturn {
  const [input, setInput] = useState<CarbonInput>(DEFAULT_CARBON_INPUT);
  const [result, setResult] = useState<CarbonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateInput = useCallback((updates: Partial<CarbonInput>) => {
    setInput((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateTransport = useCallback(
    (updates: Partial<CarbonInput['transport']>) => {
      setInput((prev) => ({
        ...prev,
        transport: { ...prev.transport, ...updates },
      }));
    },
    []
  );

  const updateFlights = useCallback(
    (updates: Partial<CarbonInput['flights']>) => {
      setInput((prev) => ({
        ...prev,
        flights: { ...prev.flights, ...updates },
      }));
    },
    []
  );

  const submit = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await calculateFootprint(input);
      setResult(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to calculate footprint';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [input]);

  const reset = useCallback(() => {
    setInput(DEFAULT_CARBON_INPUT);
    setResult(null);
    setError(null);
  }, []);

  return {
    input,
    result,
    loading,
    error,
    updateInput,
    updateTransport,
    updateFlights,
    submit,
    reset,
  };
}
