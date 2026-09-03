import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { invitationService } from '../../services/invitationService';
import { Zap, Eye, EyeOff, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';

export const AcceptInvitationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [invitation, setInvitation] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(true);
  const [verifyError, setVerifyError] = useState('');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerifyError('Invalid invitation link. No token found.');
        setVerifyLoading(false);
        return;
      }
      try {
        const inv = await invitationService.verifyToken(token);
        setInvitation(inv);
      } catch (err) {
        setVerifyError(err.message || 'This invitation link is invalid or has already expired.');
      } finally {
        setVerifyLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await invitationService.acceptInvitation({
        token,
        password,
        name: invitation?.name
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to accept invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366F1_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-900/50 mb-4">
              <Zap className="w-7 h-7 text-white fill-white" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">You&apos;re Invited!</h1>
            <p className="text-xs text-white/50 mt-1">
              Join your team on OneWinq Enterprise
            </p>
          </div>

          {/* Loading */}
          {verifyLoading && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              <p className="text-xs text-white/50">Verifying your invitation...</p>
            </div>
          )}

          {/* Verify Error */}
          {!verifyLoading && verifyError && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Invitation Invalid</h3>
                <p className="text-xs text-white/50 mt-2">{verifyError}</p>
              </div>
              <Link to="/login" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                Go to Sign In
              </Link>
            </div>
          )}

          {/* Success */}
          {!verifyLoading && !verifyError && success && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Account Created!</h3>
                <p className="text-xs text-white/50 mt-2">
                  Your account has been set up. Redirecting to sign in...
                </p>
              </div>
            </div>
          )}

          {/* Main Form */}
          {!verifyLoading && !verifyError && !success && invitation && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Invitation Info */}
              <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-4 space-y-1 text-xs text-white/70 mb-2">
                <p className="font-bold text-white text-sm">{invitation.name}</p>
                <p>{invitation.email}</p>
                {invitation.designation && <p className="text-white/50">{invitation.designation}</p>}
                {invitation.departmentId?.name && (
                  <p className="text-white/50">Department: {invitation.departmentId.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                  Set Password
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition cursor-pointer"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs text-rose-300 font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-3.5 transition shadow-lg disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Accept &amp; Create Account'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
