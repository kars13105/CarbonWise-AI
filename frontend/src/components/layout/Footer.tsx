/**
 * Footer — Warm, nature-themed footer with grass decoration.
 */

import { Link } from 'react-router-dom';
import { GrassDecoration } from '../EcoIllustrations';

export default function Footer() {
  return (
    <footer role="contentinfo" className="mt-20">
      {/* Grass divider */}
      <GrassDecoration color="#c8e6c8" opacity={0.4} />

      <div className="bg-sage-50/50">
        <div className="container-main py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl" aria-hidden="true">🌿</span>
                <span className="font-extrabold gradient-text text-lg">CarbonWise AI</span>
              </div>
              <p className="text-text-500 text-sm leading-relaxed">
                Your personal AI-powered sustainability companion. Calculate, understand,
                and reduce your carbon footprint — one step at a time. 🌍
              </p>
            </div>

            {/* Quick Links */}
            <nav aria-label="Footer navigation">
              <h3 className="text-sm font-extrabold text-forest-700 uppercase tracking-wider mb-3">
                Quick Links
              </h3>
              <ul className="list-none p-0 m-0 flex flex-col gap-2">
                {[
                  { path: '/calculator', label: '🧮 Calculator' },
                  { path: '/dashboard', label: '📊 Dashboard' },
                  { path: '/coach', label: '🤖 AI Coach' },
                  { path: '/simulator', label: '🔮 Simulator' },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-text-500 hover:text-forest-700 text-sm font-semibold no-underline transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-extrabold text-forest-700 uppercase tracking-wider mb-3">
                Resources
              </h3>
              <ul className="list-none p-0 m-0 flex flex-col gap-2">
                <li>
                  <Link
                    to="/about"
                    className="text-text-500 hover:text-forest-700 text-sm font-semibold no-underline transition-colors"
                  >
                    💚 About Us
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/kars13105/CarbonWise-AI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-500 hover:text-forest-700 text-sm font-semibold no-underline transition-colors inline-flex items-center gap-1"
                  >
                    🔗 Source Code
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-sage-200 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-400 text-xs m-0 font-semibold">
              © {new Date().getFullYear()} CarbonWise AI. All rights reserved.
            </p>
            <p className="text-text-400 text-xs m-0 flex items-center gap-1 font-semibold">
              Made with 💚 by Kartik for the planet 🌍
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
