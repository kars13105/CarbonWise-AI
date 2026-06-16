/**
 * CalculatorPage — Playful multi-step carbon footprint calculator.
 * Nature-themed steps with emoji illustrations, pastel cards,
 * and a tree-growth results view.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { useCalculator } from '../hooks/useCalculator';
import { TreeGrowth, EcoMascot, AnimatedCounter } from '../components/EcoIllustrations';
import type { CarbonResult } from '../types/carbon';
import { CATEGORY_COLORS, CATEGORY_LABELS, getEcoLevel } from '../constants/emissionFactors';

const STEPS = [
  { label: 'Transport', emoji: '🚗' },
  { label: 'Electricity', emoji: '⚡' },
  { label: 'Flights', emoji: '✈️' },
  { label: 'Food', emoji: '🍽️' },
  { label: 'Shopping', emoji: '🛍️' },
];

export default function CalculatorPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const {
    input,
    result,
    loading,
    error,
    updateTransport,
    updateInput,
    updateFlights,
    submit,
    reset,
  } = useCalculator();

  const isLastStep = step === STEPS.length - 1;
  const hasResult = result !== null;

  const handleNext = async () => {
    if (isLastStep) {
      await submit();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleReset = () => {
    reset();
    setStep(0);
  };

  const handleViewDashboard = () => {
    if (result) {
      sessionStorage.setItem('carbonResult', JSON.stringify(result));
      sessionStorage.setItem('carbonInput', JSON.stringify(input));
      navigate('/dashboard');
    }
  };

  return (
    <div className="container-main py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-forest-900 mb-3">
          Carbon Footprint <span className="gradient-text">Calculator</span> 🧮
        </h1>
        <p className="text-text-500 max-w-lg mx-auto font-medium">
          Answer a few fun questions about your lifestyle to estimate your carbon emissions!
        </p>
      </div>

      {!hasResult ? (
        <>
          {/* Step Indicator */}
          <div className="step-indicator mb-10" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step].label}`}>
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center">
                <button
                  className={`step-dot ${
                    i === step
                      ? 'step-dot-active'
                      : i < step
                        ? 'step-dot-completed'
                        : 'step-dot-inactive'
                  }`}
                  onClick={() => i <= step && setStep(i)}
                  aria-label={`Step ${i + 1}: ${s.label}`}
                  title={s.label}
                >
                  {i < step ? (
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">{s.emoji}</span>
                  )}
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`step-line ${
                      i < step ? 'step-line-active' : 'step-line-inactive'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="max-w-2xl mx-auto">
            <div className="card-static p-8 animate-scale-in" key={step}>
              <h2 className="text-xl font-extrabold text-forest-800 mb-6 flex items-center gap-3">
                <span className="text-3xl">{STEPS[step].emoji}</span>
                {STEPS[step].label}
              </h2>

              {/* Step 0: Transport */}
              {step === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { id: 'car-km', emoji: '🚗', label: 'Car (km/month)', key: 'car_km' as const },
                    { id: 'bike-km', emoji: '🏍️', label: 'Motorbike (km/month)', key: 'bike_km' as const },
                    { id: 'bus-km', emoji: '🚌', label: 'Bus (km/month)', key: 'bus_km' as const },
                    { id: 'train-km', emoji: '🚆', label: 'Train (km/month)', key: 'train_km' as const },
                  ].map((field) => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="input-label flex items-center gap-1.5">
                        <span aria-hidden="true">{field.emoji}</span> {field.label}
                      </label>
                      <input
                        id={field.id}
                        type="number"
                        className="input"
                        min="0"
                        max="50000"
                        value={input.transport[field.key] === 0 ? 0 : input.transport[field.key] || ''}
                        onChange={(e) => updateTransport({ [field.key]: e.target.value === '' ? 0 : Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Step 1: Electricity */}
              {step === 1 && (
                <div>
                  <label htmlFor="electricity" className="input-label flex items-center gap-1.5">
                    <span aria-hidden="true">⚡</span> Monthly Electricity Consumption (kWh)
                  </label>
                  <input
                    id="electricity"
                    type="number"
                    className="input"
                    min="0"
                    max="10000"
                    value={input.electricity_kwh === 0 ? 0 : input.electricity_kwh || ''}
                    onChange={(e) => updateInput({ electricity_kwh: e.target.value === '' ? 0 : Number(e.target.value) })}
                    placeholder="e.g., 300"
                  />
                  <p className="text-text-400 text-xs mt-2 font-semibold">
                    💡 Average household uses 250-400 kWh/month. Check your electricity bill!
                  </p>
                </div>
              )}

              {/* Step 2: Flights */}
              {step === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="domestic-flights" className="input-label">
                      🏠 Domestic Flights (per year)
                    </label>
                    <input
                      id="domestic-flights"
                      type="number"
                      className="input"
                      min="0"
                      max="100"
                      value={input.flights.domestic === 0 ? 0 : input.flights.domestic || ''}
                      onChange={(e) => updateFlights({ domestic: e.target.value === '' ? 0 : Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="intl-flights" className="input-label">
                      🌍 International Flights (per year)
                    </label>
                    <input
                      id="intl-flights"
                      type="number"
                      className="input"
                      min="0"
                      max="100"
                      value={input.flights.international === 0 ? 0 : input.flights.international || ''}
                      onChange={(e) => updateFlights({ international: e.target.value === '' ? 0 : Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Food */}
              {step === 3 && (
                <div>
                  <label className="input-label">What best describes your diet?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                    {[
                      { value: 'vegan', label: '🌱 Vegan', desc: 'Plant-based only', bg: '#e8f5e8' },
                      { value: 'vegetarian', label: '🥚 Vegetarian', desc: 'No meat', bg: '#fff0b3' },
                      { value: 'non-vegetarian', label: '🍖 Non-Veg', desc: 'Includes meat', bg: '#ffe8d8' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateInput({ food_type: opt.value })}
                        className={`p-5 rounded-2xl text-left transition-all cursor-pointer border-2 font-semibold ${
                          input.food_type === opt.value
                            ? 'border-sage-500 shadow-md'
                            : 'border-transparent hover:border-sage-300'
                        }`}
                        style={{ background: opt.bg }}
                        aria-pressed={input.food_type === opt.value}
                      >
                        <div className="text-xl mb-1">{opt.label}</div>
                        <div className="text-xs text-text-500">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Shopping */}
              {step === 4 && (
                <div>
                  <label className="input-label">How would you describe your shopping habits?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                    {[
                      { value: 'low', label: '♻️ Minimal', desc: 'Buy only essentials', bg: '#e8f5e8' },
                      { value: 'medium', label: '🛍️ Average', desc: 'Regular consumer', bg: '#e8f4fb' },
                      { value: 'high', label: '🛒 Frequent', desc: 'Love shopping', bg: '#ffe8d8' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateInput({ shopping_level: opt.value })}
                        className={`p-5 rounded-2xl text-left transition-all cursor-pointer border-2 font-semibold ${
                          input.shopping_level === opt.value
                            ? 'border-sage-500 shadow-md'
                            : 'border-transparent hover:border-sage-300'
                        }`}
                        style={{ background: opt.bg }}
                        aria-pressed={input.shopping_level === opt.value}
                      >
                        <div className="text-xl mb-1">{opt.label}</div>
                        <div className="text-xs text-text-500">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-4 p-4 rounded-2xl bg-coral-400/10 border-2 border-coral-400/30 text-red-700 text-sm font-semibold" role="alert" aria-live="assertive">
                  ⚠️ {error}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <button
                  className="btn-secondary"
                  onClick={handleBack}
                  disabled={step === 0}
                  aria-label="Previous step"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  Back
                </button>
                <span className="text-text-400 text-sm font-bold">
                  Step {step + 1} of {STEPS.length}
                </span>
                <button
                  className="btn-primary"
                  onClick={handleNext}
                  disabled={loading}
                  aria-label={isLastStep ? 'Calculate footprint' : 'Next step'}
                >
                  {loading ? (
                    <>
                      <span className="spinner w-4 h-4" aria-hidden="true" /> Calculating...
                    </>
                  ) : isLastStep ? (
                    <>
                      Calculate 🌿
                    </>
                  ) : (
                    <>
                      Next <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <ResultsView
          result={result}
          onReset={handleReset}
          onViewDashboard={handleViewDashboard}
        />
      )}
    </div>
  );
}

/* ─── Results Sub-Component ─────────────────────────────────────────────────── */

function ResultsView({
  result,
  onReset,
  onViewDashboard,
}: {
  result: CarbonResult;
  onReset: () => void;
  onViewDashboard: () => void;
}) {
  const ecoLevel = getEcoLevel(result.score.score);
  const mascotExpression = result.score.score >= 70 ? 'happy' : result.score.score >= 40 ? 'neutral' : 'worried';

  return (
    <div className="max-w-4xl mx-auto animate-scale-in">
      {/* Score Card with Tree */}
      <div className="card-static text-center p-8 mb-6">
        <h2 className="text-xl font-extrabold text-forest-800 mb-6">
          Your Carbon Health Score 🌿
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-6">
          {/* Tree */}
          <TreeGrowth score={result.score.score} size={160} />
          {/* Mascot + Score */}
          <div className="flex flex-col items-center">
            <EcoMascot expression={mascotExpression} size={80} />
            <div className="mt-3">
              <div className="text-5xl font-black" style={{ color: result.score.score >= 70 ? '#4a7c59' : result.score.score >= 40 ? '#f5c542' : '#c44e4e' }}>
                <AnimatedCounter target={result.score.score} />
              </div>
              <div className="text-sm font-bold text-text-500">{result.score.label}</div>
            </div>
          </div>
        </div>

        {/* Eco Level */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sage-100 border border-sage-200">
          <span className="text-2xl">{ecoLevel.emoji}</span>
          <span className="font-extrabold text-forest-700">Level {ecoLevel.level}: {ecoLevel.name}</span>
        </div>

        <p className="text-text-500 text-sm max-w-md mx-auto mt-4 font-medium">
          {result.score.description}
        </p>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card-static text-center p-6" style={{ background: '#e8f5e8' }}>
          <div className="text-3xl font-black text-forest-800 mb-1">
            <AnimatedCounter target={Math.round(result.monthly_total_kg)} />
          </div>
          <div className="text-sm font-bold text-text-500">kg CO₂/month</div>
        </div>
        <div className="card-static text-center p-6" style={{ background: '#e8f4fb' }}>
          <div className="text-3xl font-black gradient-text mb-1">
            {result.annual_total_tonnes.toFixed(1)}
          </div>
          <div className="text-sm font-bold text-text-500">tonnes CO₂/year</div>
        </div>
        <div className="card-static text-center p-6" style={{ background: '#fff0b3' }}>
          <div className="text-3xl font-black text-forest-800 mb-1">
            <AnimatedCounter target={Math.round(result.annual_total_kg)} />
          </div>
          <div className="text-sm font-bold text-text-500">kg CO₂/year</div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="card-static p-6 mb-6">
        <h3 className="text-lg font-extrabold text-forest-800 mb-4">
          📊 Emission Breakdown
        </h3>
        <div className="space-y-3">
          {result.breakdown.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-forest-700">
                  {CATEGORY_LABELS[cat.category] || cat.category}
                </span>
                <span className="text-sm font-semibold text-text-500">
                  {cat.percentage.toFixed(1)}% — {cat.annual_tonnes.toFixed(2)}t/year
                </span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${cat.percentage}%`,
                    background: CATEGORY_COLORS[cat.category] || '#a8d8a8',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      {result.insights.length > 0 && (
        <div className="card-static p-6 mb-6">
          <h3 className="text-lg font-extrabold text-forest-800 mb-3">
            💡 Key Insights
          </h3>
          <ul className="list-none p-0 m-0 space-y-2">
            {result.insights.map((insight, i) => (
              <li
                key={i}
                className="text-text-600 text-sm flex items-start gap-3 p-3 rounded-xl bg-sage-50 font-medium"
              >
                <span className="text-lg flex-shrink-0" aria-hidden="true">🌱</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button className="btn-primary" onClick={onViewDashboard}>
          📊 View Dashboard
        </button>
        <button className="btn-secondary" onClick={onReset}>
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Calculate Again
        </button>
      </div>
    </div>
  );
}
