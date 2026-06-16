/**
 * CoachPage — AI Sustainability Coach with friendly Earth mascot.
 * Playful loading states, pastel design, DOMPurify-secured markdown output.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useAICoach } from '../hooks/useAICoach';
import type { CarbonResult } from '../types/carbon';
import { EcoMascot } from '../components/EcoIllustrations';

export default function CoachPage() {
  const [result] = useState<CarbonResult | null>(() => {
    const stored = sessionStorage.getItem('carbonResult');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch { /* ignore */ }
    }
    return null;
  });
  const [inputData] = useState<{ food_type: string; shopping_level: string } | null>(() => {
    const storedInput = sessionStorage.getItem('carbonInput');
    if (storedInput) {
      try {
        return JSON.parse(storedInput);
      } catch { /* ignore */ }
    }
    return null;
  });
  const { plan, loading, error, generate, reset } = useAICoach();

  const handleGenerate = () => {
    if (!result) return;

    const breakdown: Record<string, number> = {};
    result.breakdown.forEach((cat) => {
      breakdown[cat.category] = cat.monthly_kg;
    });

    generate({
      total_annual_emissions: result.annual_total_tonnes,
      breakdown,
      carbon_score: result.score.score,
      food_type: inputData?.food_type || 'non-vegetarian',
      shopping_level: inputData?.shopping_level || 'medium',
    });
  };

  if (!result) {
    return (
      <div className="container-main py-16 text-center animate-fade-in">
        <div className="card-static max-w-md mx-auto p-10">
          <EcoMascot expression="neutral" size={100} />
          <h1 className="text-2xl font-black text-forest-900 mb-3 mt-4">
            AI Sustainability Coach 🤖
          </h1>
          <p className="text-text-500 mb-6 font-medium">
            Calculate your carbon footprint first to get personalized AI-powered recommendations! 🌿
          </p>
          <Link to="/calculator" className="btn-primary no-underline">
            🧮 Go to Calculator
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-forest-900 mb-3">
          AI Sustainability <span className="gradient-text">Coach</span> 🤖
        </h1>
        <p className="text-text-500 max-w-lg mx-auto font-medium">
          Get a personalized sustainability plan powered by Google Gemini AI,
          tailored to your carbon footprint data! ✨
        </p>
      </div>

      {/* Summary Card */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="card-static p-6" style={{ background: 'linear-gradient(135deg, #e8f5e8, #e8f4fb)' }}>
          <h2 className="text-sm font-extrabold text-forest-700 uppercase tracking-wider mb-3">
            📋 Your Data Summary
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-black gradient-text">
                {result.annual_total_tonnes.toFixed(1)}
              </div>
              <div className="text-xs font-bold text-text-500">tonnes CO₂/year</div>
            </div>
            <div>
              <div
                className="text-2xl font-black"
                style={{ color: result.score.score >= 70 ? '#4a7c59' : result.score.score >= 40 ? '#b8941e' : '#c44e4e' }}
              >
                {result.score.score}
              </div>
              <div className="text-xs font-bold text-text-500">Carbon Score</div>
            </div>
            <div>
              <div className="text-2xl font-black text-forest-800">
                {result.largest_contributor}
              </div>
              <div className="text-xs font-bold text-text-500">Top Source</div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button / Loading / Result */}
      <div className="max-w-3xl mx-auto">
        {!plan && !loading && !error && (
          <div className="text-center">
            <div className="mb-4">
              <EcoMascot expression="happy" size={80} />
            </div>
            <button
              className="btn-primary text-lg px-8 py-4"
              onClick={handleGenerate}
              id="generate-plan-btn"
            >
              ✨ Generate My Sustainability Plan
            </button>
            <p className="text-text-400 text-sm mt-3 font-medium">
              Our AI will analyze your data and create a personalized plan!
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="card-static p-8 text-center" role="status" aria-label="Generating sustainability plan">
            <div className="inline-block animate-bounce-in mb-4">
              <EcoMascot expression="happy" size={80} />
            </div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="spinner" aria-hidden="true" />
              <div className="text-left">
                <div className="text-forest-800 font-extrabold">
                  Generating your personalized plan... 🌿
                </div>
                <div className="text-text-500 text-sm font-medium">
                  Our AI is analyzing your carbon footprint data!
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {['85%', '92%', '75%', '88%', '70%', '80%'].map((width, i) => (
                <div
                  key={i}
                  className="skeleton h-4"
                  style={{ width }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="card-static p-6 border-2 border-coral-400/30" role="alert">
            <div className="flex items-start gap-3">
              <EcoMascot expression="worried" size={60} />
              <div>
                <h3 className="text-lg font-extrabold text-red-600 mb-1">
                  Generation Failed 😔
                </h3>
                <p className="text-text-500 text-sm mb-4 font-medium">{error}</p>
                <button className="btn-secondary" onClick={handleGenerate}>
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Plan Result */}
        {plan && (
          <div className="animate-scale-in">
            <div className="card-static p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <h2 className="text-lg font-extrabold text-forest-800 m-0">
                    Your Sustainability Plan
                  </h2>
                </div>
                <span className="text-xs font-bold text-text-400">
                  Generated {new Date(plan.generated_at).toLocaleDateString()}
                </span>
              </div>
              <div
                className="markdown-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(formatMarkdown(plan.plan)),
                }}
              />
            </div>
            <div className="text-center">
              <button
                className="btn-secondary"
                onClick={() => {
                  reset();
                  handleGenerate();
                }}
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Regenerate Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Simple markdown-to-HTML converter for AI output.
 */
function formatMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
    .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/(<\/ul>)<br>/g, '$1')
    .replace(/(<\/h[1-3]>)<br>/g, '$1');
}
