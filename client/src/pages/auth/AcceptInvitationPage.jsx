import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { invitationService } from '../../services/invitationService';
import { storage } from '../../utils/storage';
import { useAuth } from '../../hooks/useAuth';
import {
  Zap,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Briefcase,
  Mail,
  RefreshCw,
  KeyRound,
  ClipboardPaste
} from 'lucide-react';

export const AcceptInvitationPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlToken = searchParams.get('token') || searchParams.get('inviteToken') || '';
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [activeToken, setActiveToken] = useState(urlToken);
  const [invitation, setInvitation] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(Boolean(urlToken));
  const [verifyError, setVerifyError] = useState('');
  const [showManualInput, setShowManualInput] = useState(!urlToken);
  const [manualInput, setManualInput] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Extract raw hex token from pasted URL or raw token
  const extractToken = (input) => {
    if (!input) return '';
    const trimmed = input.trim();
    if (trimmed.includes('token=')) {
      try {
        const url = new URL(trimmed.startsWith('http') ? trimmed : `http://localhost/${trimmed}`);
        return url.searchParams.get('token') || trimmed;
      } catch {
        const match = trimmed.match(/token=([a-f0-9]+)/i);
        if (match) return match[1];
      }
    }
    return trimmed;
  };

  // Verify token via API
  const handleVerify = useCallback(async (tokenToVerify) => {
    if (!tokenToVerify) {
      setVerifyError('Please provide a valid invitation token.');
      setVerifyLoading(false);
      setShowManualInput(true);
      return;
    }

    setVerifyLoading(true);
    setVerifyError('');
    setShowManualInput(false);

    try {
      const inv = await invitationService.verifyToken(tokenToVerify);
      setInvitation(inv);
      setActiveToken(tokenToVerify);
      if (inv?.name) setFullName(inv.name);
      setSearchParams({ token: tokenToVerify }, { replace: true });
    } catch (err) {
      setVerifyError(err.message || 'This invitation link is invalid or has already expired.');
      setShowManualInput(true);
      setInvitation(null);
    } finally {
      setVerifyLoading(false);
    }
  }, [setSearchParams]);

  // Auto-verify on mount if token is in URL
  useEffect(() => {
    if (urlToken) {
      handleVerify(urlToken);
    } else {
      setVerifyLoading(false);
      setShowManualInput(true);
    }
  }, [urlToken, handleVerify]);

  // Handle manual paste or submit
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const extracted = extractToken(manualInput);
    handleVerify(extracted);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setManualInput(text);
        const extracted = extractToken(text);
        handleVerify(extracted);
      }
    } catch {
      // Clipboard access denied or unsupported; user can type manually
    }
  };

  // Submit password & activate account
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (password.length < 8) {
      setSubmitError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirm) {
      setSubmitError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // Clear any previous session completely before storing new credentials
      storage.clearAuth();

      const result = await invitationService.acceptInvitation({
        token: activeToken,
        password,
        name: fullName && fullName.trim().length >= 2 ? fullName.trim() : undefined
      });

      // Store tokens and user in local storage immediately
      if (result?.accessToken) {
        storage.setAccessToken(result.accessToken);
      }
      if (result?.refreshToken) {
        storage.setRefreshToken(result.refreshToken);
      }
      if (result?.user) {
        storage.setUser(result.user);
      }

      // Refresh auth context to fetch full permissions and role
      let meData = null;
      try {
        meData = await refreshUser?.();
      } catch (_) {
        // Fallback
      }

      setSuccessData(result);

      // Determine accurate destination: Admin / Super Admin vs Employee
      const adminRoleList = ['Super Admin', 'Admin', 'HR Admin', 'Content Admin'];
      const roleName = meData?.role || (typeof result?.member?.roleId === 'object' ? result.member.roleId?.name : null);
      const isUserAdmin = Boolean(meData?.isAdmin) || (roleName && adminRoleList.includes(roleName));
      const targetDestination = isUserAdmin ? '/admin/dashboard' : '/user/dashboard';

      setTimeout(() => {
        navigate(targetDestination, { replace: true });
      }, 1500);
    } catch (err) {
      setSubmitError(err.message || 'Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366F1_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-900/50 mb-4">
              <Zap className="w-7 h-7 text-white fill-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Join OneWinq</h1>
            <p className="text-xs text-white/50 mt-1 font-medium">Enterprise Employee Identity Platform</p>
          </div>

          {/* ── State 1: Verifying Token ── */}
          {verifyLoading && (
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-xs text-white/60 font-medium">Verifying your invitation link...</p>
            </div>
          )}

          {/* ── State 2: Successful Registration Confirmation ── */}
          {successData && (
            <div className="text-center space-y-4 py-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Account Created Successfully!</h3>
                <p className="text-xs text-white/60 mt-1">
                  Welcome to OneWinq. Setting up your workspace and redirecting to your dashboard...
                </p>
              </div>
              <div className="pt-2 flex justify-center">
                <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
              </div>
            </div>
          )}

          {/* ── State 3: Manual Token Input (when no token in URL or token expired) ── */}
          {!verifyLoading && !successData && showManualInput && (
            <div className="space-y-4">
              {verifyError && (
                <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-rose-200">
                    <p className="font-semibold text-rose-300">Invitation Verification Failed</p>
                    <p className="mt-0.5 text-white/60">{verifyError}</p>
                  </div>
                </div>
              )}

              <div className="text-center pb-1">
                <p className="text-xs text-white/70">
                  Paste your invitation link or invitation token from your email to proceed.
                </p>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Paste link or token here..."
                    className="w-full rounded-xl bg-white/10 border border-white/10 pl-4 pr-24 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono transition"
                  />
                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white/80 transition flex items-center gap-1 cursor-pointer"
                  >
                    <ClipboardPaste className="w-3 h-3" /> Paste
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!manualInput.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-3.5 transition shadow-lg shadow-indigo-900/50 disabled:opacity-50 cursor-pointer"
                >
                  <span>Verify Invitation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center pt-3 border-t border-white/10">
                <Link
                  to="/login"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
          )}

          {/* ── State 4: Token Verified — Set Password & Complete Profile ── */}
          {!verifyLoading && !successData && !showManualInput && invitation && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Recipient Details Card */}
              <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-4 space-y-2 text-xs text-white/80">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Verified Invitation
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">
                    {invitation.role || 'Member'}
                  </span>
                </div>

                <div className="border-t border-white/10 pt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-white/50 flex-shrink-0" />
                    <span className="font-bold text-white text-xs truncate">{invitation.email}</span>
                  </div>
                  {(invitation.designation || invitation.department) && (
                    <div className="flex items-center gap-2 text-[11px] text-white/60">
                      {invitation.designation && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-white/40" /> {invitation.designation}
                        </span>
                      )}
                      {invitation.department && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-white/40" /> {invitation.department}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  required
                  className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPwd ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    minLength={8}
                    className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition cursor-pointer"
                  >
                    {showConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Banner */}
              {submitError && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs text-rose-300 font-medium">
                  {submitError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-3.5 transition shadow-lg shadow-indigo-900/50 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Accept &amp; Create Account</span>
                  </>
                )}
              </button>

              {/* Switch code button */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualInput(true)}
                  className="text-[11px] text-white/40 hover:text-white/70 transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Enter a different invitation code
                </button>
              </div>
            </form>
          )}

          {/* Footer Watermark */}
          <p className="text-center text-[11px] text-white/20 mt-6">
            OneWinq Enterprise © 2026 · Secure Identity Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
};
