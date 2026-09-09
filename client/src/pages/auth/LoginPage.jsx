import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, Zap, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const { user, isAdmin, loading: authLoading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect to the respective dashboard
  useEffect(() => {
    if (!authLoading && user) {
      const destination = isAdmin ? '/admin/dashboard' : '/user/dashboard';
      navigate(destination, { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fillAdminCredentials = () => {
    setEmail('superadmin@onewinq.com');
    setPassword('OneWinq@Admin2026!');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authResult = await login({ email, password });
      // Redirect accurately based on role / admin status from login result
      const destination = authResult?.redirectPath || (authResult?.isAdmin ? '/admin/dashboard' : '/user/dashboard');
      navigate(destination, { replace: true });
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

            {/* Forgot password link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition"
              >
                Forgot password?
              </Link>
            </div>

            {/* Dev Admin Quick Fill Box */}
            <div className="rounded-2xl bg-indigo-950/60 border border-indigo-500/30 p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[11px] font-bold text-white truncate">Seeded Super Admin</p>
                  <p className="text-[10px] text-indigo-200/70 font-mono truncate">superadmin@onewinq.com</p>
                </div>
              </div>
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[11px] font-bold text-white transition flex-shrink-0 cursor-pointer shadow-xs"
              >
                Auto Fill
              </button>
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
