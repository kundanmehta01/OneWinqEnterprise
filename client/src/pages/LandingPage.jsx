import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  ArrowRight,
  Shield,
  Zap,
  Users,
  CreditCard,
} from 'lucide-react';

/**
 * LandingPage — shown at "/" for unauthenticated and anonymous visitors.
 * Keeps the existing OneWinq design language (purple/slate palette, rounded cards).
 * The Login button routes to the existing /admin/login flow.
 */
export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-purple-600 selection:text-white">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center focus:outline-none">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              onew<span className="text-purple-600">i</span>nq
            </span>
          </Link>

          {/* Nav actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/company"
              className="hidden sm:inline-flex text-xs font-semibold text-slate-600 hover:text-purple-600 transition-colors px-3 py-2"
            >
              Company Profile
            </Link>
            <Link
              to="/admin/login"
              id="landing-login-btn"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all hover:scale-[1.02]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Log in</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <main>
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-24 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Enterprise Digital Identity</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
            One tap. Every detail.{' '}
            <span className="text-purple-600">Instantly.</span>
          </h1>

          {/* Sub-headline */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-500 leading-relaxed">
            OneWinq powers enterprise digital identity — smart NFC cards, verified employee
            profiles, and seamless credential sharing for modern organizations.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/admin/login"
              id="landing-hero-login-btn"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-lg shadow-purple-500/30 transition-all hover:scale-[1.02]"
            >
              <span>Get Started — Log in</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/company"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 text-sm font-bold transition-all hover:scale-[1.02]"
            >
              <span>View Company Profile</span>
            </Link>
          </div>
        </section>

        {/* ── Feature Cards ── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: CreditCard,
                title: 'Smart NFC Cards',
                desc: 'Physical + digital cards that share your full profile with a single tap.',
              },
              {
                icon: Shield,
                title: 'Verified Profiles',
                desc: 'Admin-approved employee profiles with multi-level permission control.',
              },
              {
                icon: Zap,
                title: 'Instant Sharing',
                desc: 'No app required — your profile opens instantly on any device.',
              },
              {
                icon: Users,
                title: 'Team Directory',
                desc: 'Centralized team management, departments, and role-based access.',
              },
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 py-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span className="font-black text-slate-700 text-base">
            onew<span className="text-purple-600">i</span>nq
          </span>
          <p>© 2026 OneWinq Technologies. All rights reserved.</p>
          <Link
            to="/admin/login"
            className="text-purple-600 hover:underline font-semibold"
          >
            Admin Login →
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
