/**
 * HomePage — Playful, nature-inspired landing page.
 * Features hero with mountain scene, animated illustrations,
 * feature cards, how-it-works, and motivational CTA.
 */

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { MountainScene, FloatingLeaves, TreeGrowth, AnimatedCounter } from '../components/EcoIllustrations';

const FEATURES = [
  {
    emoji: '🧮',
    title: 'Carbon Calculator',
    description: 'Calculate your footprint across transport, energy, flights, food, and shopping.',
    color: '#e8f5e8',
    borderColor: '#a8d8a8',
    link: '/calculator',
  },
  {
    emoji: '📊',
    title: 'Visual Dashboard',
    description: 'See your emissions beautifully visualized with colorful charts and insights.',
    color: '#e8f4fb',
    borderColor: '#a8d4eb',
    link: '/dashboard',
  },
  {
    emoji: '🤖',
    title: 'AI Sustainability Coach',
    description: 'Get personalized action plans from Google Gemini AI, tailored to your data.',
    color: '#e8d8f5',
    borderColor: '#c4a7e7',
    link: '/coach',
  },
  {
    emoji: '🔮',
    title: 'Scenario Simulator',
    description: 'What if you biked more? Ate less meat? See the projected impact instantly.',
    color: '#fff0b3',
    borderColor: '#ffd93d',
    link: '/simulator',
  },
  {
    emoji: '📈',
    title: 'Progress Tracker',
    description: 'Save snapshots, set goals, and watch your sustainability journey unfold.',
    color: '#ffe8d8',
    borderColor: '#ffcba4',
    link: '/tracker',
  },
  {
    emoji: '🏆',
    title: 'Badges & Achievements',
    description: 'Earn eco badges and level up from Seedling to Mighty Oak as you improve!',
    color: '#ffd93d20',
    borderColor: '#ffd93d',
    link: '/dashboard',
  },
];

const IMPACT_STATS = [
  { value: 4.7, suffix: 't', label: 'Global Avg CO₂/year' },
  { value: 5, suffix: '+', label: 'Emission Categories' },
  { value: 100, suffix: '%', label: 'Free & Open Source' },
];

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-20 md:py-28"
        aria-labelledby="hero-heading"
      >
        <MountainScene />
        <FloatingLeaves count={5} />

        <div className="container-main relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass mb-8 animate-slide-down">
            <span className="text-lg" aria-hidden="true">🌱</span>
            <span className="text-sm font-bold text-forest-700">
              Your AI Sustainability Companion
            </span>
          </div>

          <h1
            id="hero-heading"
            className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 text-forest-900"
          >
            Your Journey to a
            <br />
            <span className="gradient-text">Greener Planet</span>
            <br />
            Starts Here 🌍
          </h1>

          <p className="text-lg md:text-xl text-text-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            CarbonWise AI is your friendly sustainability coach. Calculate your carbon footprint,
            get personalized AI tips, simulate changes, and grow your eco tree! 🌳
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/calculator"
              className="btn-primary text-lg px-8 py-4 no-underline"
              id="hero-cta-primary"
            >
              Calculate My Footprint
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <Link
              to="/about"
              className="btn-secondary text-lg px-8 py-4 no-underline"
              id="hero-cta-secondary"
            >
              Learn More
            </Link>
          </div>

          {/* Impact Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {IMPACT_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-2xl" aria-hidden="true"></span>
                  <span className="text-2xl md:text-3xl font-black text-forest-800">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </span>
                </div>
                <span className="text-xs font-bold text-text-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}

      <section
        className="py-32 container-main"
        aria-labelledby="features-heading"
      >
        <div className="text-center mb-14">
          <h2
            id="features-heading"
            className="text-3xl md:text-4xl font-black text-forest-900 mb-4"
          >
            Everything You Need to
            <span className="gradient-text"> Go Green</span>
          </h2>
          <p className="text-text-500 text-lg max-w-xl mx-auto font-medium">
            A comprehensive, fun toolkit to measure and reduce your environmental impact.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <Link
              to={feature.link}
              key={feature.title}
              className="group cursor-pointer no-underline rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
              style={{
                background: feature.color,
                border: `2px solid ${feature.borderColor}40`,
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:animate-wiggle inline-block">
                {feature.emoji}
              </div>
              <h3 className="text-lg font-extrabold text-forest-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-text-500 text-sm leading-relaxed m-0 font-medium">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 container-main" aria-labelledby="how-heading">
        <div className="text-center mb-14">
          <h2
            id="how-heading"
            className="text-3xl md:text-4xl font-black text-forest-900 mb-4"
          >
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              emoji: '🔍',
              title: 'Calculate',
              desc: 'Enter your lifestyle data — transport, energy, flights, food, and shopping habits.',
              color: '#e8f5e8',
            },
            {
              step: '02',
              emoji: '🧠',
              title: 'Understand',
              desc: 'Get a detailed breakdown with charts, scores, and personalized AI insights.',
              color: '#e8f4fb',
            },
            {
              step: '03',
              emoji: '🌳',
              title: 'Improve',
              desc: 'Follow your sustainability plan, track progress, and watch your eco tree grow!',
              color: '#fff0b3',
            },
          ].map((item, i) => (
            <div
              key={item.step}
              className="card-static text-center py-8 px-6"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="text-5xl mb-4">{item.emoji}</div>
              <div className="text-4xl font-black gradient-text mb-3 opacity-40">
                {item.step}
              </div>
              <h3 className="text-xl font-extrabold text-forest-800 mb-2">
                {item.title}
              </h3>
              <p className="text-text-500 text-sm m-0 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Grow Your Tree CTA */}
      <section className="py-16 container-main">
        <div className="nature-card text-center py-14 px-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <TreeGrowth score={85} size={120} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-forest-900 mb-4">
              Ready to Grow Your Eco Tree?
            </h2>
            <p className="text-text-500 text-lg mb-8 max-w-xl mx-auto font-medium">
              Start your sustainability journey today. It takes less than 2 minutes
              to calculate your carbon footprint and plant your first digital seed!
            </p>
            <Link
              to="/calculator"
              className="btn-primary text-lg px-8 py-4 no-underline"
              id="bottom-cta"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div >
  );
}
