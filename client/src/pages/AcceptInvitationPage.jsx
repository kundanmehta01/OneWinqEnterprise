import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  LogIn,
  UserPlus
} from 'lucide-react';
import api from '../api/axios';
import { useAuthStore } from '../stores/authStore';

export const AcceptInvitationPage = () => {
  const { token: paramToken } = useParams();
  const [searchParams] = useSearchParams();
  const queryToken = searchParams.get('token');
  const token = paramToken || queryToken;

  const navigate = useNavigate();
  const { user, isAuthenticated, checkAuth, setUser, setMember, setRole, setPermissions, setIsSuperAdmin } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [inviteData, setInviteData] = useState(null);
  const [error, setError] = useState('');

  // Which sub-flow: 'new_user' | 'existing_login' | 'logged_in'
  const [flow, setFlow] = useState('new_user');

  // New user form
  const [form, setForm] = useState({ name: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Existing user login form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('No invitation token was provided. Please check the link sent to your email.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await api.get('/invitations/verify', { params: { token } });
        const data = res.data || res;
        setInviteData(data);

        // Only use the 1-click logged_in flow if the currently authenticated user's email matches the invitation email
        const isSameEmail = Boolean(
          isAuthenticated &&
          user?.email &&
          data?.email &&
          user.email.trim().toLowerCase() === data.email.trim().toLowerCase()
        );

        if (isSameEmail) {
          setFlow('logged_in');
        } else {
          setFlow('new_user');
        }

        if (data.name) {
          setForm((prev) => ({ ...prev, name: data.name }));
        }
        if (data.email) {
          setLoginForm((prev) => ({ ...prev, email: data.email }));
        }
      } catch (err) {
        console.error('Token verification error:', err);
        setError(err?.message || 'This invitation link is invalid, has expired, or has already been used.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, isAuthenticated, user]);

  // Handle new user registration + join
  const handleNewUserSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (form.password.length < 6) {
      setSubmitError('Password must be at least 6 characters long.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setSubmitError('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/invitations/accept', {
        token,
        password: form.password,
        name: form.name.trim() || inviteData?.name || inviteData?.email?.split('@')[0]
      });

      const responseData = res.data || res;
      _handleSuccessfulAcceptance(responseData);
    } catch (err) {
      console.error('Accept invitation error:', err);
      setSubmitError(err?.message || 'Failed to activate your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle existing user joining via their existing credentials
  const handleExistingUserLogin = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      // First authenticate the user
      const loginRes = await api.post('/auth/login', {
        email: loginForm.email,
        password: loginForm.password
      });
      const loginData = loginRes.data || loginRes;

      // Store the access token so subsequent calls are authenticated
      if (loginData.accessToken) {
        localStorage.setItem('onewinq_access_token', loginData.accessToken);
        if (loginData.refreshToken) {
          localStorage.setItem('onewinq_refresh_token', loginData.refreshToken);
        }
      }

      // Now accept the invitation — backend will detect existing user and add them to org
      const acceptRes = await api.post('/invitations/accept', {
        token
        // No password needed — backend detects existing user by invitation email
      });
      const acceptData = acceptRes.data || acceptRes;
      _handleSuccessfulAcceptance(acceptData);
    } catch (err) {
      console.error('Existing user accept error:', err);
      setSubmitError(err?.message || 'Login failed or invitation could not be accepted. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle already-logged-in user joining org
  const handleLoggedInUserJoin = async () => {
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const res = await api.post('/invitations/accept', { token });
      const responseData = res.data || res;
      _handleSuccessfulAcceptance(responseData);
    } catch (err) {
      console.error('Logged-in user accept error:', err);
      setSubmitError(err?.message || 'Failed to join the organization. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const _handleSuccessfulAcceptance = (responseData) => {
    if (responseData.accessToken) {
      localStorage.setItem('onewinq_access_token', responseData.accessToken);
      if (responseData.refreshToken) {
        localStorage.setItem('onewinq_refresh_token', responseData.refreshToken);
      }
    }
    // Refresh auth state from server
    checkAuth();
    setSubmitSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-900 flex flex-col justify-center items-center p-4 selection:bg-purple-100 selection:text-purple-900 antialiased">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[50%] -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-purple-200/50 via-purple-100/20 to-transparent rounded-full blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-purple-200 group-hover:scale-105 transition-transform">
              W
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              one<span className="text-purple-600">i</span>nq
            </span>
          </Link>
          <p className="text-xs text-slate-500 font-medium">Enterprise Employee Onboarding Portal</p>
        </div>

        {/* State 1: Loading */}
        {isLoading && (
          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-xl shadow-purple-500/5 text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">Verifying Your Invitation</h3>
              <p className="text-xs text-slate-400 mt-1">Connecting to organization directory...</p>
            </div>
          </div>
        )}

        {/* State 2: Error */}
        {!isLoading && error && (
          <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-xl shadow-rose-500/5 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Invitation Expired or Invalid</h3>
              <p className="text-xs text-slate-500">{error}</p>
            </div>
            <div className="pt-2">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm shadow-purple-200 transition-colors"
              >
                Go to Sign In <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* State 3: Success */}
        {!isLoading && submitSuccess && (
          <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl shadow-emerald-500/5 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">You've Joined Successfully!</h3>
              <p className="text-xs text-slate-500">
                Welcome to OneWinq. Your enterprise digital identity profile and credentials have been initialized.
              </p>
            </div>
            <div className="pt-2 space-y-2">
              <button
                onClick={() => navigate('/app/home')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all hover:scale-[1.01]"
              >
                <span>Enter Enterprise Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/"
                className="block text-xs font-semibold text-slate-500 hover:text-purple-600 py-1"
              >
                View Organization Public Identity Page
              </Link>
            </div>
          </div>
        )}

        {/* State 4: Valid invitation — show appropriate flow */}
        {!isLoading && !error && !submitSuccess && inviteData && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl shadow-purple-500/5 space-y-6">
            {/* Organization Invitation Badge */}
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-purple-200">
                  Official Invitation
                </span>
                <span className="text-[11px] text-slate-500 font-medium">OneWinq Enterprise</span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                  OW
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{inviteData.designation || 'Team Member'}</h4>
                  <p className="text-xs text-slate-500">
                    {inviteData.department || 'General'} &bull; Role: <span className="font-semibold text-purple-700">{inviteData.role || 'Member'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Error message */}
            {submitError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Flow A: Already logged in */}
            {flow === 'logged_in' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-indigo-800">You're already signed in</p>
                    <p className="text-indigo-600 mt-0.5">as <strong>{user?.email}</strong></p>
                  </div>
                </div>
                <p className="text-slate-500">
                  Click below to accept this invitation and join the organization with your existing account.
                </p>
                <button
                  onClick={handleLoggedInUserJoin}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Joining...</span></>
                  ) : (
                    <><Sparkles className="w-4 h-4" /><span>Accept & Join Organization</span></>
                  )}
                </button>
                <button
                  onClick={() => setFlow('existing_login')}
                  className="w-full text-center text-xs text-slate-400 hover:text-purple-600 font-medium py-1"
                >
                  Use a different account instead
                </button>
              </div>
            )}

            {/* Flow B: Existing user — login to accept */}
            {flow === 'existing_login' && (
              <form onSubmit={handleExistingUserLogin} className="space-y-4 text-xs">
                <div className="text-center">
                  <p className="font-semibold text-slate-700">Sign in to accept this invitation</p>
                  <p className="text-slate-400 mt-0.5 text-[11px]">Your account will be added to the organization after sign-in.</p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900 font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Your password"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900 font-medium transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing in & Joining...</span></>
                  ) : (
                    <><LogIn className="w-4 h-4" /><span>Sign In & Accept Invitation</span></>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setFlow('new_user')}
                  className="w-full text-center text-xs text-slate-400 hover:text-purple-600 font-medium py-1"
                >
                  I don't have an account — Register instead
                </button>
              </form>
            )}

            {/* Flow C: New user — registration */}
            {flow === 'new_user' && (
              <form onSubmit={handleNewUserSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corporate Email Address</label>
                  <input
                    type="email"
                    value={inviteData.email}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Wright"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900 font-medium transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Create Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="At least 6 characters"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900 font-medium transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter your password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900 font-medium transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Activating Account...</span></>
                  ) : (
                    <><UserPlus className="w-4 h-4" /><span>Create Account & Join</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setFlow('existing_login')}
                  className="w-full text-center text-xs text-slate-400 hover:text-purple-600 font-medium py-1"
                >
                  I already have an account — Sign in instead
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
