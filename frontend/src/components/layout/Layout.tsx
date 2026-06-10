/**
 * Layout — Main layout wrapper with navbar, footer, and decorative background.
 */

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 focus:z-50 btn-primary"
      >
        Skip to main content
      </a>
      <main id="main-content" className="flex-1 pt-20 pb-8" role="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
