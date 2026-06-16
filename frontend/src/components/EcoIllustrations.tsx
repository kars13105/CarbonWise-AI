/**
 * EcoIllustrations — Pure SVG/CSS nature illustration components.
 * No external images needed. Used throughout the redesigned UI.
 */

import { useEffect, useState } from 'react';

/* ─── Tree Growth ──────────────────────────────────────────────────────────── */
/** Renders a tree that visually grows based on the score (0-100). */
export function TreeGrowth({ score, size = 160 }: { score: number; size?: number }) {
  const stage = score >= 90 ? 4 : score >= 70 ? 3 : score >= 50 ? 2 : score >= 25 ? 1 : 0;
  const trunkH = [15, 25, 35, 40, 45][stage];
  const crownR = [0, 12, 20, 28, 35][stage];
  const leafColors = ['#c8e6c8', '#a8d8a8', '#82c080', '#6db06b', '#4a7c59'];

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label={`Tree growth: score ${score}`}>
      {/* Ground */}
      <ellipse cx="50" cy="88" rx="30" ry="6" fill="#c8e6c8" />
      {/* Trunk */}
      <rect
        x="47"
        y={88 - trunkH}
        width="6"
        height={trunkH}
        rx="3"
        fill="#8B6F47"
        style={{ transformOrigin: 'bottom', animation: 'grow-tree 1.2s ease-out' }}
      />
      {/* Crown layers */}
      {stage >= 1 && (
        <>
          <circle cx="50" cy={88 - trunkH - crownR * 0.5} r={crownR} fill={leafColors[stage]} opacity="0.7" />
          <circle cx="50" cy={88 - trunkH - crownR * 0.8} r={crownR * 0.8} fill={leafColors[Math.min(stage + 1, 4)]} opacity="0.85" />
          {stage >= 3 && (
            <>
              <circle cx={50 - crownR * 0.5} cy={88 - trunkH - crownR * 0.3} r={crownR * 0.6} fill={leafColors[stage]} opacity="0.6" />
              <circle cx={50 + crownR * 0.5} cy={88 - trunkH - crownR * 0.3} r={crownR * 0.6} fill={leafColors[stage]} opacity="0.6" />
            </>
          )}
          {/* Fruits for excellent scores */}
          {stage >= 4 && (
            <>
              <circle cx="42" cy={88 - trunkH - crownR * 0.2} r="3" fill="#ffb5a7" />
              <circle cx="56" cy={88 - trunkH - crownR * 0.6} r="3" fill="#ffd93d" />
              <circle cx="48" cy={88 - trunkH - crownR * 1.1} r="2.5" fill="#ffcba4" />
            </>
          )}
        </>
      )}
      {/* Seedling for very low scores */}
      {stage === 0 && (
        <>
          <line x1="50" y1="84" x2="50" y2="78" stroke="#6db06b" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="47" cy="78" rx="4" ry="3" fill="#a8d8a8" transform="rotate(-30 47 78)" />
          <ellipse cx="53" cy="80" rx="3.5" ry="2.5" fill="#a8d8a8" transform="rotate(25 53 80)" />
        </>
      )}
    </svg>
  );
}

/* ─── Eco Mascot (Earth) ───────────────────────────────────────────────────── */
/** A cute Earth face. expression: 'happy' | 'neutral' | 'worried' */
export function EcoMascot({
  expression = 'happy',
  size = 80,
}: {
  expression?: 'happy' | 'neutral' | 'worried';
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label={`Earth mascot: ${expression}`}>
      {/* Body */}
      <circle cx="40" cy="40" r="35" fill="#7eb8da" />
      <ellipse cx="30" cy="35" rx="12" ry="10" fill="#6db06b" transform="rotate(-15 30 35)" />
      <ellipse cx="55" cy="45" rx="10" ry="8" fill="#6db06b" transform="rotate(20 55 45)" />
      <ellipse cx="40" cy="55" rx="8" ry="6" fill="#82c080" />
      {/* Blush */}
      <ellipse cx="25" cy="45" rx="5" ry="3" fill="#ffcba4" opacity="0.5" />
      <ellipse cx="55" cy="45" rx="5" ry="3" fill="#ffcba4" opacity="0.5" />
      {/* Eyes */}
      <circle cx="30" cy="38" r="4" fill="white" />
      <circle cx="50" cy="38" r="4" fill="white" />
      <circle cx={expression === 'worried' ? 31 : 31} cy={expression === 'worried' ? 39 : 38} r="2.5" fill="#2a3a2e" />
      <circle cx={expression === 'worried' ? 51 : 51} cy={expression === 'worried' ? 39 : 38} r="2.5" fill="#2a3a2e" />
      {/* Eye shine */}
      <circle cx="32" cy="37" r="1" fill="white" />
      <circle cx="52" cy="37" r="1" fill="white" />
      {/* Mouth */}
      {expression === 'happy' && (
        <path d="M 33 48 Q 40 55 47 48" stroke="#2a3a2e" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {expression === 'neutral' && (
        <line x1="34" y1="50" x2="46" y2="50" stroke="#2a3a2e" strokeWidth="2" strokeLinecap="round" />
      )}
      {expression === 'worried' && (
        <path d="M 33 52 Q 40 46 47 52" stroke="#2a3a2e" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {/* Tiny leaf on top */}
      <g transform="translate(52, 10) rotate(15)">
        <path d="M 0 0 Q 5 -8 0 -14 Q -5 -8 0 0" fill="#6db06b" />
        <line x1="0" y1="0" x2="0" y2="-12" stroke="#4a7c59" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

function getPseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/* ─── Floating Leaves ──────────────────────────────────────────────────────── */
/** Animated falling leaves for decorative backgrounds */
export function FloatingLeaves({ count = 6 }: { count?: number }) {
  const leaves = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${10 + (i * 80) / count + getPseudoRandom(i + 1) * 10}%`,
    delay: `${i * 1.5 + getPseudoRandom(i + 2) * 2}s`,
    duration: `${8 + getPseudoRandom(i + 3) * 6}s`,
    size: 12 + getPseudoRandom(i + 4) * 10,
    color: ['#a8d8a8', '#82c080', '#6db06b', '#c8e6c8', '#73d4a0', '#4a7c59'][i % 6],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {leaves.map((leaf) => (
        <svg
          key={leaf.id}
          className="leaf-float absolute"
          style={{
            left: leaf.left,
            top: '-20px',
            animationDelay: leaf.delay,
            animationDuration: leaf.duration,
          }}
          width={leaf.size}
          height={leaf.size}
          viewBox="0 0 20 20"
        >
          <path
            d="M 10 2 Q 16 6 14 12 Q 12 16 10 18 Q 8 16 6 12 Q 4 6 10 2"
            fill={leaf.color}
            opacity="0.6"
          />
          <line x1="10" y1="4" x2="10" y2="16" stroke={leaf.color} strokeWidth="0.5" opacity="0.8" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Mountain Scene ───────────────────────────────────────────────────────── */
/** Decorative mountain + clouds background for hero sections */
export function MountainScene() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg className="absolute bottom-0 w-full" viewBox="0 0 1200 300" preserveAspectRatio="none" style={{ height: '40%' }}>
        {/* Far mountains */}
        <path d="M0,300 L0,200 Q150,100 300,180 Q450,80 600,160 Q750,60 900,150 Q1050,90 1200,170 L1200,300 Z" fill="#c8e6c8" opacity="0.3" />
        {/* Near mountains */}
        <path d="M0,300 L0,220 Q200,140 400,210 Q600,130 800,200 Q1000,150 1200,220 L1200,300 Z" fill="#a8d8a8" opacity="0.3" />
        {/* Ground */}
        <path d="M0,300 L0,260 Q300,240 600,250 Q900,235 1200,255 L1200,300 Z" fill="#e8f5e8" opacity="0.5" />
      </svg>
      {/* Clouds */}
      <svg className="absolute top-[10%] left-[10%] cloud-float" width="120" height="50" viewBox="0 0 120 50" style={{ animationDelay: '0s' }}>
        <ellipse cx="60" cy="30" rx="50" ry="18" fill="white" opacity="0.5" />
        <ellipse cx="40" cy="25" rx="30" ry="15" fill="white" opacity="0.4" />
        <ellipse cx="80" cy="28" rx="25" ry="12" fill="white" opacity="0.4" />
      </svg>
      <svg className="absolute top-[5%] right-[15%] cloud-float" width="100" height="40" viewBox="0 0 100 40" style={{ animationDelay: '3s', animationDuration: '10s' }}>
        <ellipse cx="50" cy="25" rx="40" ry="14" fill="white" opacity="0.4" />
        <ellipse cx="35" cy="20" rx="25" ry="12" fill="white" opacity="0.35" />
      </svg>
      {/* Sun */}
      <div className="absolute top-[8%] right-[8%] w-16 h-16 rounded-full bg-[#ffd93d] opacity-20 blur-sm animate-pulse-soft" />
    </div>
  );
}

/* ─── Grass Decoration ─────────────────────────────────────────────────────── */
/** Wavy grass SVG for section dividers or footer decoration */
export function GrassDecoration({ color = '#e8f5e8', opacity = 0.5 }: { color?: string; opacity?: number }) {
  return (
    <svg className="w-full" viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ height: '40px' }} aria-hidden="true">
      <path
        d="M0,60 L0,30 Q100,10 200,25 Q300,40 400,20 Q500,5 600,22 Q700,38 800,15 Q900,0 1000,20 Q1100,35 1200,18 L1200,60 Z"
        fill={color}
        opacity={opacity}
      />
    </svg>
  );
}

// (Eco Level helper has been moved to emissionFactors.ts to comply with fast refresh rules)

/* ─── Animated Counter ─────────────────────────────────────────────────────── */
/** Counts up from 0 to target with easing animation */
export function AnimatedCounter({ target, duration = 1500, suffix = '' }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <span>{count}{suffix}</span>;
}
