/**
 * TrackerPage — Sustainability journey tracker with nature-themed visuals.
 * Timeline milestones, pastel charts, and forest-path goal visualization.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
  LineChart,
  Line,
} from 'recharts';
import { CheckCircle2, Save, Target } from 'lucide-react';
import { useSession } from '../hooks/useSession';
import { useProgress } from '../hooks/useProgress';
import type { CarbonResult } from '../types/carbon';
import { TreeGrowth, getEcoLevel } from '../components/EcoIllustrations';

export default function TrackerPage() {
  const sessionId = useSession();
  const { progress, saveSnapshot, setGoal } = useProgress(sessionId);
  const [result, setResult] = useState<CarbonResult | null>(null);
  const [goalPercent, setGoalPercent] = useState(15);
  const [saved, setSaved] = useState(false);
  const [goalSaved, setGoalSaved] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('carbonResult');
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, []);

  const handleSaveSnapshot = async () => {
    if (!result) return;
    const breakdown: Record<string, number> = {};
    result.breakdown.forEach((cat) => {
      breakdown[cat.category] = cat.monthly_kg;
    });
    await saveSnapshot({
      total_emissions: result.annual_total_tonnes,
      carbon_score: result.score.score,
      breakdown,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSetGoal = async () => {
    await setGoal(goalPercent);
    setGoalSaved(true);
    setTimeout(() => setGoalSaved(false), 3000);
  };

  const snapshots = progress?.snapshots ?? [];
  const goal = progress?.goal ?? null;

  const trendData = snapshots.map((s, i) => ({
    label: `#${i + 1}`,
    date: new Date(s.timestamp).toLocaleDateString(),
    emissions: s.total_emissions,
    score: s.carbon_score,
  }));

  let improvementPercent = 0;
  if (snapshots.length >= 2) {
    const first = snapshots[0].total_emissions;
    const latest = snapshots[snapshots.length - 1].total_emissions;
    if (first > 0) improvementPercent = ((first - latest) / first) * 100;
  }

  return (
    <div className="container-main py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-forest-900 mb-3">
          Progress <span className="gradient-text">Tracker</span> 📈
        </h1>
        <p className="text-text-500 max-w-lg mx-auto font-medium">
          Save snapshots of your carbon footprint over time and watch your sustainability journey! 🌿
        </p>
      </div>

      {/* Journey Milestones */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          {['🫘', '🌱', '🌿', '🌲', '🌳'].map((emoji, i) => {
            const latestScore = snapshots.length > 0 ? snapshots[snapshots.length - 1].carbon_score : (result?.score.score ?? 0);
            const level = getEcoLevel(latestScore);
            const isReached = level.level > i;
            return (
              <div key={i} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                  isReached ? 'bg-sage-100 border-2 border-sage-400 scale-110' : 'bg-white/50 border-2 border-sage-200 opacity-40'
                }`}>
                  {emoji}
                </div>
                {i < 4 && (
                  <div className={`w-8 h-1 rounded-full mx-1 ${isReached ? 'bg-sage-400' : 'bg-sage-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Snapshot */}
      {result && (
        <div className="max-w-3xl mx-auto mb-8">
          <div className="card-static p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: 'linear-gradient(135deg, #e8f5e8, #f0f9f0)' }}>
            <div>
              <h2 className="text-lg font-extrabold text-forest-800 mb-1">
                📸 Current Footprint
              </h2>
              <p className="text-text-500 text-sm m-0 font-semibold">
                {result.annual_total_tonnes.toFixed(1)} tonnes CO₂/year • Score: {result.score.score}/100
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={handleSaveSnapshot}
              disabled={saved}
              id="save-snapshot-btn"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> ✅ Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" aria-hidden="true" /> Save Snapshot
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {!result && (
        <div className="max-w-md mx-auto mb-8">
          <div className="card-static p-8 text-center">
            <div className="text-5xl mb-3">🧮</div>
            <p className="text-text-500 mb-4 font-medium">
              Calculate your footprint first to save progress snapshots!
            </p>
            <Link to="/calculator" className="btn-primary no-underline">
              Go to Calculator
            </Link>
          </div>
        </div>
      )}

      {/* Stats Row */}
      {snapshots.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
          <div className="card-static p-5 text-center" style={{ background: '#e8f4fb' }}>
            <div className="text-2xl font-black text-forest-800">
              {snapshots.length}
            </div>
            <div className="text-xs font-bold text-text-500">📸 Snapshots Saved</div>
          </div>
          <div className="card-static p-5 text-center" style={{ background: improvementPercent > 0 ? '#e8f5e8' : '#ffe8d8' }}>
            <div className={`text-2xl font-black ${
              improvementPercent > 0 ? 'text-forest-700' : 'text-forest-800'
            }`}>
              {improvementPercent > 0 ? '📈 +' : ''}{improvementPercent.toFixed(1)}%
            </div>
            <div className="text-xs font-bold text-text-500">Improvement</div>
          </div>
          <div className="card-static p-5 text-center" style={{ background: '#fff0b3' }}>
            <div className="text-2xl font-black text-forest-800">
              {snapshots[snapshots.length - 1].carbon_score}
            </div>
            <div className="text-xs font-bold text-text-500">⭐ Latest Score</div>
          </div>
        </div>
      )}

      {/* Charts */}
      {trendData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
          {/* Emissions Trend */}
          <div className="card-static p-6">
            <h3 className="text-lg font-extrabold text-forest-800 mb-4 flex items-center gap-2">
              📉 Emissions Over Time
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="emGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6db06b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6db06b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#c8e6c8" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#5a7060', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#c8e6c8' }}
                />
                <YAxis
                  tick={{ fill: '#5a7060', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#c8e6c8' }}
                  label={{
                    value: 't CO₂/yr',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#8a9e90',
                    fontSize: 11,
                  }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="emissions"
                  stroke="#6db06b"
                  fill="url(#emGrad)"
                  strokeWidth={3}
                  dot={{ fill: '#6db06b', r: 5, stroke: 'white', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Score Trend */}
          <div className="card-static p-6">
            <h3 className="text-lg font-extrabold text-forest-800 mb-4 flex items-center gap-2">
              ⭐ Score Over Time
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#c8e6c8" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#5a7060', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#c8e6c8' }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#5a7060', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#c8e6c8' }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#f5c542"
                  strokeWidth={3}
                  dot={{ fill: '#f5c542', r: 5, stroke: 'white', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Goal Setting */}
      <div className="max-w-3xl mx-auto">
        <div className="card-static p-6">
          <h3 className="text-lg font-extrabold text-forest-800 mb-4 flex items-center gap-2">
            🎯 Reduction Goal
          </h3>

          {goal && (
            <div className="mb-6 p-4 rounded-2xl bg-sage-50 border-2 border-sage-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-text-600">
                  Target: {goal.target_reduction_percent}% reduction
                </span>
                <span
                  className={`badge ${
                    goal.is_achieved ? 'badge-success' : 'badge-warning'
                  }`}
                >
                  {goal.is_achieved ? '🎉 Achieved!' : '🔥 In Progress'}
                </span>
              </div>
              <div className="progress-bar-track mb-2">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.min(
                      100,
                      (goal.current_reduction_percent /
                        goal.target_reduction_percent) *
                        100
                    )}%`,
                    background: goal.is_achieved
                      ? 'linear-gradient(90deg, #a8d8a8, #4a7c59)'
                      : 'linear-gradient(90deg, #ffd93d, #f5c542)',
                  }}
                />
              </div>
              <div className="text-xs font-bold text-text-400">
                {goal.current_reduction_percent.toFixed(1)}% of{' '}
                {goal.target_reduction_percent}% target achieved
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label htmlFor="goal-percent" className="input-label">
                🎯 Set Reduction Target (%)
              </label>
              <input
                id="goal-percent"
                type="number"
                className="input"
                min="1"
                max="100"
                value={goalPercent}
                onChange={(e) => setGoalPercent(Number(e.target.value) || 1)}
              />
            </div>
            <button
              className="btn-primary whitespace-nowrap"
              onClick={handleSetGoal}
              disabled={goalSaved}
            >
              {goalSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> ✅ Saved!
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" aria-hidden="true" /> Set Goal
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
