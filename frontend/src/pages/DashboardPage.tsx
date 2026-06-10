/**
 * DashboardPage — Playful emission dashboard with tree growth, eco levels,
 * pastel charts, and gamified badges.
 */

import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';
import type { CarbonResult } from '../types/carbon';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../constants/emissionFactors';
import { useSession } from '../hooks/useSession';
import { useProgress } from '../hooks/useProgress';
import { TreeGrowth, EcoMascot, getEcoLevel, AnimatedCounter } from '../components/EcoIllustrations';

export default function DashboardPage() {
  const [result, setResult] = useState<CarbonResult | null>(null);
  const sessionId = useSession();
  const { badges } = useProgress(sessionId);

  useEffect(() => {
    const stored = sessionStorage.getItem('carbonResult');
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  if (!result) {
    return (
      <div className="container-main py-16 text-center animate-fade-in">
        <div className="card-static max-w-md mx-auto p-10">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-2xl font-black text-forest-900 mb-3">No Data Yet</h1>
          <p className="text-text-500 mb-6 font-medium">
            Calculate your carbon footprint first to see your personalized dashboard! 🌿
          </p>
          <Link to="/calculator" className="btn-primary no-underline">
            🧮 Go to Calculator
          </Link>
        </div>
      </div>
    );
  }

  const ecoLevel = getEcoLevel(result.score.score);
  const mascotExpression = result.score.score >= 70 ? 'happy' : result.score.score >= 40 ? 'neutral' : 'worried';

  const pieData = result.breakdown.map((cat) => ({
    name: CATEGORY_LABELS[cat.category] || cat.category,
    value: parseFloat(cat.annual_tonnes.toFixed(2)),
    color: CATEGORY_COLORS[cat.category] || '#a8d8a8',
  }));

  const barData = result.breakdown.map((cat) => ({
    name: CATEGORY_LABELS[cat.category] || cat.category,
    'kg CO₂/month': parseFloat(cat.monthly_kg.toFixed(1)),
    fill: CATEGORY_COLORS[cat.category] || '#a8d8a8',
  }));

  return (
    <div className="container-main py-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-forest-900 mb-2">
          Welcome back, <span className="gradient-text">eco warrior!</span> 🌱
        </h1>
        <p className="text-text-500 font-medium">
          Here's your sustainability snapshot. Keep growing! 🌿
        </p>
      </div>

      {/* Score + Tree + Level Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Tree & Score */}
        <div className="card-static p-6 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #e8f5e8, #f0f9f0)' }}>
          <TreeGrowth score={result.score.score} size={140} />
          <div className="mt-3 text-center">
            <div className="text-4xl font-black" style={{ color: result.score.score >= 70 ? '#4a7c59' : result.score.score >= 40 ? '#b8941e' : '#c44e4e' }}>
              <AnimatedCounter target={result.score.score} />
            </div>
            <div className="text-sm font-bold text-text-500">{result.score.label}</div>
          </div>
          {/* Level Bar */}
          <div className="level-bar mt-4 w-full max-w-xs">
            <span className="text-lg">{ecoLevel.emoji}</span>
            <div className="flex-1 bg-sage-200 rounded-full h-2 overflow-hidden">
              <div
                className="level-bar-fill"
                style={{ width: `${(result.score.score / ecoLevel.nextAt) * 100}%` }}
              />
            </div>
            <span className="text-xs font-extrabold text-forest-700">Lv.{ecoLevel.level}</span>
          </div>
          <div className="text-xs font-bold text-text-400 mt-1">{ecoLevel.name}</div>
        </div>

        {/* Key Metrics */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="card-static p-5 text-center" style={{ background: '#e8f4fb' }}>
            <div className="text-2xl font-black gradient-text">
              {result.annual_total_tonnes.toFixed(1)}
            </div>
            <div className="text-xs font-bold text-text-500 mt-1">tonnes CO₂/year</div>
          </div>
          <div className="card-static p-5 text-center" style={{ background: '#fff0b3' }}>
            <div className="text-2xl font-black text-forest-800">
              <AnimatedCounter target={Math.round(result.monthly_total_kg)} />
            </div>
            <div className="text-xs font-bold text-text-500 mt-1">kg CO₂/month</div>
          </div>
          <div className="card-static p-5 text-center" style={{ background: '#ffe8d8' }}>
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg">📈</span>
              <span className="text-lg font-black text-forest-800">
                {CATEGORY_LABELS[result.largest_contributor]}
              </span>
            </div>
            <div className="text-xs font-bold text-text-500 mt-1">Largest Contributor</div>
          </div>
          <div className="card-static p-5 text-center" style={{ background: '#e8f5e8' }}>
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg">📉</span>
              <span className="text-lg font-black text-forest-800">
                {CATEGORY_LABELS[result.smallest_contributor]}
              </span>
            </div>
            <div className="text-xs font-bold text-text-500 mt-1">Smallest Contributor</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="card-static p-6">
          <h3 className="text-lg font-extrabold text-forest-800 mb-4">
            🥧 Annual Emissions by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={((value: unknown) => [`${value} tonnes`, 'CO₂/year']) as never}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="card-static p-6">
          <h3 className="text-lg font-extrabold text-forest-800 mb-4">
            📊 Monthly Emissions Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis
                dataKey="name"
                tick={{ fill: '#5a7060', fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: '#c8e6c8' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#5a7060', fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: '#c8e6c8' }}
                tickLine={false}
                label={{
                  value: 'kg CO₂',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#8a9e90',
                  fontSize: 12,
                }}
              />
              <Tooltip />
              <Bar dataKey="kg CO₂/month" radius={[8, 8, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      {result.insights.length > 0 && (
        <div className="card-static p-6 mb-8">
          <h3 className="text-lg font-extrabold text-forest-800 mb-4 flex items-center gap-2">
            💡 Key Insights
          </h3>
          <div className="space-y-3">
            {result.insights.map((insight, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-sage-50"
              >
                <div className="w-7 h-7 rounded-full bg-sage-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-forest-700 text-xs font-black">{i + 1}</span>
                </div>
                <p className="text-text-600 text-sm m-0 font-medium">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      {badges.length > 0 && (
        <div className="card-static p-6">
          <h3 className="text-lg font-extrabold text-forest-800 mb-4 flex items-center gap-2">
            🏆 Sustainability Badges
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`eco-badge ${badge.earned ? 'eco-badge-earned' : 'eco-badge-locked'}`}
              >
                {badge.earned && <div className="eco-badge-shine" />}
                <span className="eco-badge-icon">{badge.icon}</span>
                <div className="text-sm font-extrabold text-forest-800">
                  {badge.name}
                </div>
                <div className="text-xs text-text-500 mt-1 font-medium">
                  {badge.description}
                </div>
                {badge.earned && (
                  <span className="badge badge-success mt-2">✨ Earned</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
        <EcoMascot expression={mascotExpression} size={50} />
        <Link to="/coach" className="btn-primary no-underline">
          🤖 Get AI Recommendations
        </Link>
        <Link to="/simulator" className="btn-secondary no-underline">
          🔮 Try Simulator
        </Link>
      </div>
    </div>
  );
}
