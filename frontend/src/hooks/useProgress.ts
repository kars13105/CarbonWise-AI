/**
 * Progress tracking hook — manages snapshots, goals, and history.
 */

import { useState, useEffect, useCallback } from 'react';
import type { ProgressResponse, Badge } from '../types/progress';
import {
  getProgress,
  saveSnapshot as apiSaveSnapshot,
  setGoal as apiSetGoal,
  getChallenges,
} from '../services/progressService';

interface UseProgressReturn {
  progress: ProgressResponse | null;
  badges: Badge[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  saveSnapshot: (data: {
    total_emissions: number;
    carbon_score: number;
    breakdown: Record<string, number>;
  }) => Promise<void>;
  setGoal: (targetPercent: number, targetDate?: string) => Promise<void>;
}

export function useProgress(sessionId: string): UseProgressReturn {
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const [progressData, badgeData] = await Promise.all([
        getProgress(sessionId),
        getChallenges(sessionId),
      ]);
      setProgress(progressData);
      setBadges(badgeData);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load progress';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      refresh();
    }
  }, [sessionId, refresh]);

  const saveSnapshot = useCallback(
    async (data: {
      total_emissions: number;
      carbon_score: number;
      breakdown: Record<string, number>;
    }) => {
      if (!sessionId) return;
      try {
        await apiSaveSnapshot({ session_id: sessionId, ...data });
        await refresh();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to save snapshot';
        setError(message);
      }
    },
    [sessionId, refresh]
  );

  const setGoal = useCallback(
    async (targetPercent: number, targetDate?: string) => {
      if (!sessionId) return;
      try {
        await apiSetGoal({
          session_id: sessionId,
          target_reduction_percent: targetPercent,
          target_date: targetDate,
        });
        await refresh();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to set goal';
        setError(message);
      }
    },
    [sessionId, refresh]
  );

  return { progress, badges, loading, error, refresh, saveSnapshot, setGoal };
}
