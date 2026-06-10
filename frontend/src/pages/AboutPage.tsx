/**
 * AboutPage — Story-driven, nature-illustrated about page.
 * Values, tech stack, and mission with playful pastel design.
 */

export default function AboutPage() {
  return (
    <div className="container-main py-8 animate-fade-in">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass mb-6">
          <span className="text-lg" aria-hidden="true">💚</span>
          <span className="text-sm font-bold text-forest-700">About CarbonWise AI</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-forest-900 mb-4">
          Making Sustainability
          <br />
          <span className="gradient-text">Personal & Actionable</span> 🌿
        </h1>
        <p className="text-lg text-text-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Most carbon calculators show you a number and leave you wondering what to do next.
          CarbonWise AI changes that by acting as your personal sustainability companion —
          helping you understand, reduce, and track your environmental impact! 🌍
        </p>
      </div>

      {/* Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div className="card-static p-8" style={{ background: '#ffe8d8' }}>
          <h2 className="text-xl font-black text-red-600 mb-4 flex items-center gap-2">
            😟 The Problem
          </h2>
          <ul className="list-none p-0 m-0 space-y-3">
            {[
              'Carbon calculators only show a number',
              'No personalized guidance or action plans',
              'No way to simulate lifestyle changes',
              'No progress tracking or goals',
              'Overwhelming and intimidating data',
            ].map((item) => (
              <li key={item} className="text-text-700 text-sm flex items-start gap-2 font-semibold">
                <span className="text-red-500 mt-0.5" aria-hidden="true">❌</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-static p-8" style={{ background: '#e8f5e8' }}>
          <h2 className="text-xl font-black text-forest-700 mb-4 flex items-center gap-2">
            🌱 Our Solution
          </h2>
          <ul className="list-none p-0 m-0 space-y-3">
            {[
              'Detailed breakdown with visual charts',
              'AI-powered personalized sustainability plans',
              'Interactive scenario simulator',
              'Progress tracking with goal setting',
              'Gamified challenges and badges',
            ].map((item) => (
              <li key={item} className="text-text-700 text-sm flex items-start gap-2 font-semibold">
                <span className="text-forest-600 mt-0.5" aria-hidden="true">✅</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Values */}
      <section aria-labelledby="values-heading" className="mb-16">
        <h2
          id="values-heading"
          className="text-2xl md:text-3xl font-black text-forest-900 text-center mb-8"
        >
          Our Values 💎
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { emoji: '🌍', title: 'Environmental Impact', desc: 'Technology should help solve climate challenges, not create them.', bg: '#e8f5e8' },
            { emoji: '🤖', title: 'AI for Good', desc: 'Using artificial intelligence to make sustainability accessible and personalized.', bg: '#e8d8f5' },
            { emoji: '🔒', title: 'Privacy First', desc: 'Your data stays local. No tracking, no ads, no data selling.', bg: '#e8f4fb' },
            { emoji: '♿', title: 'Inclusive Design', desc: 'Built with WCAG accessibility standards so everyone can participate.', bg: '#fff0b3' },
          ].map((value) => (
            <div key={value.title} className="card-static p-6 text-center" style={{ background: value.bg }}>
              <div className="text-4xl mb-3">{value.emoji}</div>
              <h3 className="text-sm font-extrabold text-forest-800 mb-2">
                {value.title}
              </h3>
              <p className="text-text-500 text-xs m-0 font-medium">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section aria-labelledby="tech-heading" className="mb-16">
        <h2
          id="tech-heading"
          className="text-2xl md:text-3xl font-black text-forest-900 text-center mb-8"
        >
          Built With Modern Tech 🛠️
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {[
            { name: 'React', desc: 'UI Library', emoji: '⚛️' },
            { name: 'TypeScript', desc: 'Type Safety', emoji: '📘' },
            { name: 'Tailwind CSS', desc: 'Styling', emoji: '🎨' },
            { name: 'Recharts', desc: 'Visualizations', emoji: '📊' },
            { name: 'FastAPI', desc: 'API Framework', emoji: '⚡' },
            { name: 'SQLite', desc: 'Database', emoji: '💾' },
            { name: 'Google Gemini', desc: 'AI Engine', emoji: '🤖' },
            { name: 'Pytest & Vitest', desc: 'Testing', emoji: '🧪' },
          ].map((tech) => (
            <div key={tech.name} className="card-static p-4 text-center">
              <div className="text-2xl mb-2">{tech.emoji}</div>
              <div className="text-sm font-extrabold text-forest-800">
                {tech.name}
              </div>
              <div className="text-xs font-medium text-text-500">{tech.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Emission Sources */}
      <section aria-labelledby="sources-heading" className="mb-16">
        <div className="card-static p-8 max-w-3xl mx-auto" style={{ background: '#f0f9f0' }}>
          <h2
            id="sources-heading"
            className="text-xl font-black text-forest-800 mb-4 flex items-center gap-2"
          >
            📋 Emission Factor Sources
          </h2>
          <p className="text-text-500 text-sm mb-4 font-medium">
            Our emission factors are based on published averages from reputable sources:
          </p>
          <ul className="list-none p-0 m-0 space-y-2 text-text-600 text-sm font-semibold">
            <li>🚗 Transport: EPA, DEFRA transport conversion factors</li>
            <li>⚡ Electricity: IEA global average grid emission intensity</li>
            <li>✈️ Flights: ICAO Carbon Emissions Calculator methodology</li>
            <li>🍽️ Food: Published lifecycle analysis studies</li>
            <li>🛍️ Shopping: Estimated consumer goods lifecycle data</li>
          </ul>
          <p className="text-text-400 text-xs mt-4 m-0 font-medium">
            Note: These are estimates for awareness purposes. Actual emissions vary by
            region, vehicle type, energy source, and other factors.
          </p>
        </div>
      </section>

      {/* Performance & Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <div className="card-static p-6" style={{ background: '#fff0b3' }}>
          <h3 className="text-lg font-extrabold text-forest-800 mb-3 flex items-center gap-2">
            ⚡ Performance
          </h3>
          <ul className="list-none p-0 m-0 space-y-2 text-text-600 text-sm font-semibold">
            <li>✅ Lazy-loaded routes and components</li>
            <li>✅ Memoized calculation hooks</li>
            <li>✅ Optimized chart rendering</li>
            <li>✅ Minimal bundle size</li>
          </ul>
        </div>
        <div className="card-static p-6" style={{ background: '#e8f4fb' }}>
          <h3 className="text-lg font-extrabold text-forest-800 mb-3 flex items-center gap-2">
            🔒 Security
          </h3>
          <ul className="list-none p-0 m-0 space-y-2 text-text-600 text-sm font-semibold">
            <li>✅ Input validation on all forms</li>
            <li>✅ API key in environment variables</li>
            <li>✅ CORS-restricted endpoints</li>
            <li>✅ DOMPurify XSS protection</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
