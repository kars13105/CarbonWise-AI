/**
 * CarbonWise AI — Main Application with React Router.
 * Uses lazy loading for page-level code splitting.
 */

import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CoachPage = lazy(() => import('./pages/CoachPage'));
const SimulatorPage = lazy(() => import('./pages/SimulatorPage'));
const TrackerPage = lazy(() => import('./pages/TrackerPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]" role="status">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce-in">🌿</div>
        <div className="spinner mx-auto mb-4" aria-hidden="true" />
        <p className="text-text-500 text-sm font-bold">Loading your eco experience...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/coach" element={<CoachPage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/tracker" element={<TrackerPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
