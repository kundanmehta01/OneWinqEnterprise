import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { storage } from '../../utils/storage';
import {
  Eye, EyeOff, Zap, ArrowRight, Loader2, ShieldCheck,
  User, RotateCcw, CheckCircle2, LogOut, ExternalLink
} from 'lucide-react';

export const LoginPage = () => {
  const { user, loading: authLoading, login, logout, redirectPath } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clearedNotice, setClearedNotice] = useState(
    searchParams.get('cleared') === 'true' || searchParams.get('clear') === 'true'
  );

  // If URL has ?clear=true or ?reset=true, wipe storage and cookies automatically
  useEffect(() => {
    if (searchParams.get('clear') === 'true' || searchParams.get('reset') === 'true') {
      storage.clearAuth();
      logout?.();
      setClearedNotice(true);
    }
  }, [searchParams, logout]);

  const handleClearSession = async () => {
    storage.clearAuth();
    if (logout) await logout();
    setEmail('');
    setPassword('');
    setError('');
    setClearedNotice(true);
  };

  const fillAdminCredentials = () => {
    setEmail('superadmin@onewinq.com');
    setPassword('OneWinq@Admin2026!');
    setError('');
  };

  const fillEmployeeCredentials = () => {
    setEmail('neha.singh@onewinq.in');
    setPassword('Employee@2026!');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authResult = await login({ email, password });
      // Redirect accurately according to role returned from login
      const targetDestination = authResult?.redirectPath || '/dashboard';
      navigate(targetDestination, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366F1_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative w-full max-w-md">
        {/* Glass Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* Logo & Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-900/50 mb-4">
              <Zap className="w-7 h-7 text-white fill-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">OneWinq</h1>
            <p className="text-xs text-white/50 mt-1 font-medium">Enterprise Identity Platform</p>
          </div>

          {/* Cleared notification banner */}
          {clearedNotice && (
            <div className="mb-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-3.5 flex items-center justify-between gap-3 text-emerald-200 animate-in fade-in">
              <div className="flex items-center gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Browser session &amp; cookies cleared! Sign in below.</span>
              </div>
              <button
                type="button"
                onClick={() => setClearedNotice(false)}
                className="text-[11px] text-emerald-300 hover:text-white transition cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Active Session Warning / Switch User Box */}
          {user && !clearedNotice && (
            <div className="mb-5 rounded-2xl bg-indigo-950/70 border border-indigo-400/30 p-3.5 space-y-2.5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">
                  Active Session Detected
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-[10px] font-bold text-white">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-white font-medium">
                Signed in as <span className="font-bold text-indigo-200">{user.name || user.email}</span>
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => navigate(redirectPath || '/dashboard')}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleClearSession}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear &amp; Switch</span>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                autoComplete="email"
                className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs text-rose-300 font-medium">
                {error}
              </div>
            )}

            {/* Forgot password & Clear session links */}
            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleClearSession}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-300 transition cursor-pointer font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear session &amp; cookies</span>
              </button>
              <Link
                to="/forgot-password"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition"
              >
                Forgot password?
              </Link>
            </div>

            {/* Quick Fill Credentials (Development testing helpers) */}
            <div className="space-y-2">
              <div className="rounded-2xl bg-indigo-950/60 border border-indigo-500/30 p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-[11px] font-bold text-white truncate">Super Admin Account</p>
                    <p className="text-[10px] text-indigo-200/70 font-mono truncate">superadmin@onewinq.com</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white transition flex-shrink-0 cursor-pointer shadow-xs"
                >
                  Fill Admin
                </button>
              </div>

              <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-[11px] font-bold text-white truncate">Employee Account</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">neha.singh@onewinq.in</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={fillEmployeeCredentials}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-white transition flex-shrink-0 cursor-pointer border border-white/10"
                >
                  Fill Employee
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-3.5 transition shadow-lg shadow-indigo-900/50 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign up & Invitation links */}
          <div className="mt-6 pt-5 border-t border-white/10 space-y-2 text-center">
            <p className="text-xs text-white/60">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition">
                Create Account
              </Link>
            </p>
            <p className="text-[11px] text-white/40">
              Received a team invite?{' '}
              <Link to="/accept-invitation" className="text-white/60 hover:text-white font-medium underline transition">
                Accept Invitation
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-[11px] text-white/30 mt-5">
            By signing in, you agree to OneWinq&apos;s{' '}
            <a href="#" className="text-indigo-400 hover:text-indigo-300">
              Terms of Service
            </a>{' '}
            &amp;{' '}
            <a href="#" className="text-indigo-400 hover:text-indigo-300">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Watermark */}
        <p className="text-center text-[11px] text-white/20 mt-4">
          OneWinq Enterprise © 2026 · Secure Identity Infrastructure
        </p>
      </div>
    </div>
  );
};
