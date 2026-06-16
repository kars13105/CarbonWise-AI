/**
 * SimulatorPage — Interactive scenario simulator with playful design.
 * Side-by-side Earth mascot reactions and pastel comparison charts.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { CarbonInput } from '../types/carbon';
import {
  TRANSPORT_FACTORS,
  ELECTRICITY_FACTOR,
  FLIGHT_FACTORS,
  FOOD_FACTORS,
  SHOPPING_FACTORS,
  CATEGORY_LABELS,
  MONTHS_PER_YEAR,
} from '../constants/emissionFactors';
import { EcoMascot } from '../components/EcoIllustrations';

function calculateLocalTotal(input: CarbonInput) {
  const transport =
    input.transport.car_km * TRANSPORT_FACTORS.car +
    input.transport.bike_km * TRANSPORT_FACTORS.bike +
    input.transport.bus_km * TRANSPORT_FACTORS.bus +
    input.transport.train_km * TRANSPORT_FACTORS.train;
  const electricity = input.electricity_kwh * ELECTRICITY_FACTOR;
  const flights =
    (input.flights.domestic * FLIGHT_FACTORS.domestic +
      input.flights.international * FLIGHT_FACTORS.international) /
    MONTHS_PER_YEAR;
  const food = FOOD_FACTORS[input.food_type] ?? FOOD_FACTORS['non-vegetarian'];
  const shopping = SHOPPING_FACTORS[input.shopping_level] ?? SHOPPING_FACTORS['medium'];

  return {
    transport,
    electricity,
    flights,
    food,
    shopping,
    total: transport + electricity + flights + food + shopping,
  };
}

export default function SimulatorPage() {
  const [currentInput] = useState<CarbonInput | null>(() => {
    const stored = sessionStorage.getItem('carbonInput');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch { /* ignore */ }
    }
    return null;
  });
  const [projected, setProjected] = useState<CarbonInput | null>(() => {
    const stored = sessionStorage.getItem('carbonInput');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          transport: { ...parsed.transport },
          electricity_kwh: parsed.electricity_kwh,
          flights: { ...parsed.flights },
          food_type: parsed.food_type,
          shopping_level: parsed.shopping_level,
        };
      } catch { /* ignore */ }
    }
    return null;
  });

  if (!currentInput || !projected) {
    return (
      <div className="container-main py-16 text-center animate-fade-in">
        <div className="card-static max-w-md mx-auto p-10">
          <div className="text-6xl mb-4">🔮</div>
          <h1 className="text-2xl font-black text-forest-900 mb-3">
            Scenario Simulator
          </h1>
          <p className="text-text-500 mb-6 font-medium">
            Calculate your carbon footprint first to simulate lifestyle changes! 🌿
          </p>
          <Link to="/calculator" className="btn-primary no-underline">
            🧮 Go to Calculator
          </Link>
        </div>
      </div>
    );
  }

  const currentCalc = calculateLocalTotal(currentInput);
  const projectedCalc = calculateLocalTotal(projected);

  const currentAnnualTonnes = (currentCalc.total * 12) / 1000;
  const projectedAnnualTonnes = (projectedCalc.total * 12) / 1000;
  const reductionTonnes = currentAnnualTonnes - projectedAnnualTonnes;
  const reductionPercent =
    currentAnnualTonnes > 0
      ? (reductionTonnes / currentAnnualTonnes) * 100
      : 0;

  const comparisonData = Object.keys(CATEGORY_LABELS).map((cat) => ({
    name: CATEGORY_LABELS[cat],
    Current: parseFloat((((currentCalc as Record<string, number>)[cat] ?? 0) * 12 / 1000).toFixed(2)),
    Projected: parseFloat((((projectedCalc as Record<string, number>)[cat] ?? 0) * 12 / 1000).toFixed(2)),
  }));

  const mascotExpression = reductionPercent > 10 ? 'happy' : reductionPercent < -5 ? 'worried' : 'neutral';

  return (
    <div className="container-main py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-forest-900 mb-3">
          Scenario <span className="gradient-text">Simulator</span> 🔮
        </h1>
        <p className="text-text-500 max-w-lg mx-auto font-medium">
          Adjust the sliders to explore how lifestyle changes impact your carbon footprint!
        </p>
      </div>

      {/* Summary Cards with Mascot */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="card-static p-5 text-center" style={{ background: '#ffe8d8' }}>
          <div className="text-sm font-bold text-text-500 mb-1">Current</div>
          <div className="text-2xl font-black text-forest-800">
            {currentAnnualTonnes.toFixed(2)}
          </div>
          <div className="text-xs font-bold text-text-400">tonnes/year</div>
        </div>
        <div className="card-static p-5 text-center" style={{ background: '#e8f5e8' }}>
          <div className="text-sm font-bold text-text-500 mb-1">Projected</div>
          <div className="text-2xl font-black gradient-text">
            {projectedAnnualTonnes.toFixed(2)}
          </div>
          <div className="text-xs font-bold text-text-400">tonnes/year</div>
        </div>
        <div className="card-static p-5 text-center" style={{ background: reductionPercent > 0 ? '#e8f5e8' : '#ffe8d8' }}>
          <div className="text-sm font-bold text-text-500 mb-1">Reduction</div>
          <div className={`text-2xl font-black flex items-center justify-center gap-1 ${
            reductionPercent > 0 ? 'text-forest-700' : reductionPercent < 0 ? 'text-red-500' : 'text-forest-800'
          }`}>
            {reductionPercent > 0 ? '📉' : reductionPercent < 0 ? '📈' : ''}
            {Math.abs(reductionPercent).toFixed(1)}%
          </div>
          <div className="text-xs font-bold text-text-400">
            {reductionTonnes.toFixed(2)} tonnes
          </div>
        </div>
        <div className="card-static p-5 flex items-center justify-center">
          <EcoMascot expression={mascotExpression} size={70} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sliders */}
        <div className="card-static p-6">
          <h2 className="text-lg font-extrabold text-forest-800 mb-6 flex items-center gap-2">
            🎚️ Adjust Your Lifestyle
          </h2>

          <div className="space-y-6">
            <SliderControl
              label="🚗 Car (km/month)"
              value={projected.transport.car_km}
              max={Math.max(currentInput.transport.car_km * 2, 2000)}
              current={currentInput.transport.car_km}
              onChange={(v) =>
                setProjected((p) =>
                  p ? { ...p, transport: { ...p.transport, car_km: v } } : p
                )
              }
            />
            <SliderControl
              label="🚌 Bus (km/month)"
              value={projected.transport.bus_km}
              max={Math.max(currentInput.transport.bus_km * 2, 2000)}
              current={currentInput.transport.bus_km}
              onChange={(v) =>
                setProjected((p) =>
                  p ? { ...p, transport: { ...p.transport, bus_km: v } } : p
                )
              }
            />
            <SliderControl
              label="🚆 Train (km/month)"
              value={projected.transport.train_km}
              max={Math.max(currentInput.transport.train_km * 2, 2000)}
              current={currentInput.transport.train_km}
              onChange={(v) =>
                setProjected((p) =>
                  p ? { ...p, transport: { ...p.transport, train_km: v } } : p
                )
              }
            />
            <SliderControl
              label="⚡ Electricity (kWh/month)"
              value={projected.electricity_kwh}
              max={Math.max(currentInput.electricity_kwh * 2, 1000)}
              current={currentInput.electricity_kwh}
              onChange={(v) =>
                setProjected((p) => (p ? { ...p, electricity_kwh: v } : p))
              }
            />

            {/* Food */}
            <div>
              <label className="input-label">🍽️ Diet</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { type: 'vegan', label: '🌱 Vegan', bg: '#e8f5e8' },
                  { type: 'vegetarian', label: '🥚 Vegetarian', bg: '#fff0b3' },
                  { type: 'non-vegetarian', label: '🍖 Non-Veg', bg: '#ffe8d8' },
                ].map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() =>
                      setProjected((p) => (p ? { ...p, food_type: opt.type } : p))
                    }
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer border-2 ${
                      projected.food_type === opt.type
                        ? 'border-sage-500 shadow-md'
                        : 'border-transparent hover:border-sage-300'
                    }`}
                    style={{ background: opt.bg }}
                    aria-pressed={projected.food_type === opt.type}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shopping */}
            <div>
              <label className="input-label">🛍️ Shopping</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { level: 'low', label: '♻️ Low', bg: '#e8f5e8' },
                  { level: 'medium', label: '🛍️ Medium', bg: '#e8f4fb' },
                  { level: 'high', label: '🛒 High', bg: '#ffe8d8' },
                ].map((opt) => (
                  <button
                    key={opt.level}
                    onClick={() =>
                      setProjected((p) =>
                        p ? { ...p, shopping_level: opt.level } : p
                      )
                    }
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer border-2 ${
                      projected.shopping_level === opt.level
                        ? 'border-sage-500 shadow-md'
                        : 'border-transparent hover:border-sage-300'
                    }`}
                    style={{ background: opt.bg }}
                    aria-pressed={projected.shopping_level === opt.level}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="card-static p-6">
          <h2 className="text-lg font-extrabold text-forest-800 mb-6 flex items-center gap-2">
            📊 Before & After Comparison
          </h2>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={comparisonData} barGap={4}>
              <XAxis
                dataKey="name"
                tick={{ fill: '#5a7060', fontSize: 11, fontWeight: 600 }}
                axisLine={{ stroke: '#c8e6c8' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#5a7060', fontSize: 11, fontWeight: 600 }}
                axisLine={{ stroke: '#c8e6c8' }}
                tickLine={false}
                label={{
                  value: 'tonnes CO₂/yr',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#8a9e90',
                  fontSize: 11,
                }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="Current" fill="#c8d4cc" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Projected" fill="#6db06b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ─── Slider Control ────────────────────────────────────────────────────────── */

function SliderControl({
  label,
  value,
  max,
  current,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  current: number;
  onChange: (v: number) => void;
}) {
  const diff = current > 0 ? ((value - current) / current) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="input-label m-0">{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-forest-800">{value}</span>
          {current > 0 && Math.abs(diff) > 0.5 && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                diff < 0 ? 'text-forest-700 bg-sage-100' : 'text-red-600 bg-red-50'
              }`}
            >
              {diff > 0 ? '+' : ''}
              {diff.toFixed(0)}%
            </span>
          )}
        </div>
      </div>
      <input
        type="range"
        className="range-slider"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  );
}
