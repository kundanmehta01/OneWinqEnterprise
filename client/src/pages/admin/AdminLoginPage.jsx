import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('superadmin@onewinq.com');
  const [password, setPassword] = useState('OneWinq@Admin2026!');
  const [formError, setFormError] = useState('');

  const determineRedirect = (res) => {
    const isSuperAdminAccount = res?.user?.email === 'superadmin@onewinq.com' || (!res?.member && res?.user?.isSuperAdmin);
    return isSuperAdminAccount ? '/admin/company-profile' : '/app/home';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const res = await login(email, password);
      const defaultDest = determineRedirect(res);
      const dest = location.state?.from?.pathname || defaultDest;
      navigate(dest, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Invalid credentials');
    }
  };

  const handleQuickLogin = async (quickEmail, quickPassword) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
    setFormError('');
    try {
      const res = await login(quickEmail, quickPassword);
      const defaultDest = determineRedirect(res);
      navigate(defaultDest, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-purple-600 selection:text-white">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-purple-500/25">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">OneWinq Enterprise</h1>
            <p className="text-xs text-slate-500 mt-1">Single Sign-On Workspace & Administration</p>
          </div>
        </div>

        {/* Error Notification */}
        {(formError || error) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{formError || error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-600" />
              Corporate Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@company.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-600" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl btn-purple text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-500/25 transition-all cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>Sign In to OneWinq</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            One-Click Quick Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('superadmin@onewinq.com', 'OneWinq@Admin2026!')}
              className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200/80 text-left transition-all group"
            >
              <p className="text-xs font-bold text-purple-900 group-hover:text-purple-700">Super Admin</p>
              <p className="text-[10px] text-purple-600 truncate">Admin Console</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('priya.sharma@onewinq.com', 'Member@2026!')}
              className="p-2.5 rounded-xl bg-indigo-50/70 hover:bg-indigo-100 border border-indigo-200/80 text-left transition-all group"
            >
              <p className="text-xs font-bold text-indigo-900 group-hover:text-indigo-700">Team Member</p>
              <p className="text-[10px] text-indigo-600 truncate">Employee Portal</p>
            </button>
          </div>
        </div>

        {/* Return to Public Preview */}
        <div className="text-center pt-1">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-blue-600 hover:underline font-semibold transition-colors"
          >
            ← Return to Public Company Identity Flow
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
