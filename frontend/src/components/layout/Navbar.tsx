/**
 * Navbar — Warm, friendly navigation with nature-inspired design.
 * Light cream background, rounded pill links, leaf logo.
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { path: '/', label: 'Home', emoji: '🏠' },
  { path: '/calculator', label: 'Calculator', emoji: '🧮' },
  { path: '/dashboard', label: 'Dashboard', emoji: '📊' },
  { path: '/coach', label: 'AI Coach', emoji: '🤖' },
  { path: '/simulator', label: 'Simulator', emoji: '🔮' },
  { path: '/tracker', label: 'Tracker', emoji: '📈' },
  { path: '/about', label: 'About', emoji: '💚' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-main flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-extrabold no-underline"
          aria-label="CarbonWise AI Home"
        >
          <span className="text-2xl" aria-hidden="true">🌿</span>
          <span className="gradient-text">CarbonWise</span>
          <span className="text-text-400 font-semibold text-sm">AI</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`px-3 py-2 rounded-full text-sm font-bold no-underline transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'text-forest-800 bg-sage-100'
                    : 'text-text-600 hover:text-forest-700 hover:bg-sage-50'
                }`}
                aria-current={location.pathname === link.path ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-text-600 hover:text-forest-700 bg-transparent border-none cursor-pointer rounded-xl hover:bg-sage-50 transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden glass-strong border-t border-sage-200 animate-slide-down"
          role="menu"
        >
          <ul className="list-none m-0 p-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.path} role="none">
                <Link
                  to={link.path}
                  role="menuitem"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold no-underline transition-all ${
                    location.pathname === link.path
                      ? 'text-forest-800 bg-sage-100'
                      : 'text-text-600 hover:text-forest-700 hover:bg-sage-50'
                  }`}
                  aria-current={location.pathname === link.path ? 'page' : undefined}
                >
                  <span aria-hidden="true">{link.emoji}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
