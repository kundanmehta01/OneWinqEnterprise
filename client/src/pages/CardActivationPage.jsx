import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  User,
  Building2,
  Loader2,
  LogOut,
  LogIn,
  Check
} from 'lucide-react';
import { cardApi } from '../api/cardApi';
import { useAuthStore } from '../stores/authStore';

export const CardActivationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, member, logout } = useAuthStore();
  const [activationSuccess, setActivationSuccess] = useState(false);
  const [activatedCardData, setActivatedCardData] = useState(null);

  // 1. Fetch activation token verification & assigned card details
  const {
    data: responseData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['card-activation-details', token],
    queryFn: () => cardApi.getActivationDetails(token),
    enabled: Boolean(token),
    retry: 1
  });

  const cardDetails = responseData?.data || responseData;

  // 2. Activation mutation
  const activateMutation = useMutation({
    mutationFn: () => cardApi.activate(token),
    onSuccess: (res) => {
      setActivationSuccess(true);
      setActivatedCardData(res?.data || res?.card || cardDetails);
    }
  });

  // Check if authenticated user matches assigned member
  const assignedMember = cardDetails?.assignedTo;
  const isUserMatching =
    Boolean(assignedMember && (
      (member?._id && String(member._id) === String(assignedMember.memberId)) ||
      (user?._id && assignedMember.userId && String(user._id) === String(assignedMember.userId)) ||
      (user?.email && assignedMember.email && user.email.toLowerCase() === assignedMember.email.toLowerCase()) ||
      // Fallback name match if local development identity
      (user?.name && assignedMember.name && user.name.toLowerCase() === assignedMember.name.toLowerCase())
    ));

  const getCardMaterialLabel = (type) => {
    switch (type) {
      case 'metal_black':
        return 'Matte Black Metal';
      case 'metal_gold':
        return '24K Gold Metal';
      case 'metal_silver':
        return 'Brushed Silver Metal';
      case 'pvc_matte':
        return 'Matte PVC';
      case 'bamboo_wood':
        return 'Eco Bamboo Wood';
      default:
        return 'NFC Smart Card';
    }
  };

  const getCardMaterialGradient = (type) => {
    switch (type) {
      case 'metal_gold':
        return 'from-amber-700 via-amber-600 to-yellow-800 text-amber-50';
      case 'metal_silver':
        return 'from-slate-700 via-slate-600 to-zinc-800 text-slate-100';
      case 'bamboo_wood':
        return 'from-amber-900 via-amber-800 to-stone-900 text-amber-100';
      case 'metal_black':
      default:
        return 'from-slate-950 via-slate-900 to-purple-950 text-white';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-300">Verifying secure activation token...</p>
        </div>
      </div>
    );
  }

  if (error || !cardDetails) {
    const errorMessage =
      error?.response?.data?.message ||
      'This activation link is invalid, expired, or has already been used.';

    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-rose-500/20 rounded-3xl p-8 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Invalid Activation Link</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{errorMessage}</p>
          </div>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-purple-950/40 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2.5 text-center">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 font-black text-sm">
            1W
          </div>
          <span className="text-lg font-bold tracking-tight text-white">OneWinq Enterprise</span>
        </div>

        {/* 1. SUCCESS STATE */}
        {activationSuccess ? (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 text-center shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Activation Complete
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">Card Activated Successfully!</h2>
              <p className="text-xs text-slate-400">
                Your NFC smart card is now live, linked to your enterprise digital profile, and ready to share contacts.
              </p>
            </div>

            {/* Active Card Badge */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-xs">
                  NFC
                </div>
                <div>
                  <p className="text-xs font-bold text-white font-mono">{cardDetails.cardUid}</p>
                  <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Active & Linked
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">{getCardMaterialLabel(cardDetails.cardType)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/app/my-profile"
                className="py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all"
              >
                <span>View My Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/app/home"
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* 2. CARD ACTIVATION FLOW */
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl font-bold text-white tracking-tight">Activate Your Card</h1>
              <p className="text-xs text-slate-400">
                Claim and bind your official physical NFC smart card to your professional identity.
              </p>
            </div>

            {/* Physical Card Visual Card Preview */}
            <div
              className={`w-full aspect-[1.586] rounded-2xl bg-gradient-to-br ${getCardMaterialGradient(
                cardDetails.cardType
              )} p-5 flex flex-col justify-between shadow-xl border border-white/10 relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center font-black text-[10px] text-white">
                    1W
                  </div>
                  <span className="text-[11px] font-bold tracking-wider uppercase opacity-80">
                    {cardDetails.organization || 'OneWinq Enterprise'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-xs text-[10px] font-mono tracking-wider">
                  <span>NFC</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Card ID</p>
                <p className="text-lg font-bold font-mono tracking-wider text-white">{cardDetails.cardUid}</p>
                <p className="text-[10px] opacity-75 font-mono">{cardDetails.serialNumber}</p>
              </div>

              <div className="flex items-end justify-between pt-2 border-t border-white/10 text-xs">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400">Cardholder</p>
                  <p className="font-semibold text-white text-xs">{assignedMember?.name || 'Assigned Member'}</p>
                </div>
                <p className="text-[10px] opacity-60">{getCardMaterialLabel(cardDetails.cardType)}</p>
              </div>
            </div>

            {/* Assigned Member Card info box */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Assigned Team Member
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold flex items-center justify-center text-sm">
                    {assignedMember?.name ? assignedMember.name.substring(0, 1).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{assignedMember?.name}</p>
                    <p className="text-xs text-slate-400">
                      {assignedMember?.designation || 'Team Member'}{' '}
                      {assignedMember?.department ? `• ${assignedMember.department}` : ''}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Pending Activation
                </span>
              </div>
            </div>

            {/* Dynamic Authenticated / Unauthenticated Action Section */}
            {!isAuthenticated ? (
              /* NOT LOGGED IN STATE */
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
                  <span>
                    You must sign in with your enterprise account (<strong>{assignedMember?.name}</strong>) to activate this card.
                  </span>
                </div>

                <button
                  onClick={() =>
                    navigate('/login', {
                      state: { from: `/card/activate/${token}` }
                    })
                  }
                  className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Log In to Activate</span>
                </button>
              </div>
            ) : !isUserMatching ? (
              /* LOGGED IN AS DIFFERENT USER STATE */
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-amber-400">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Account Mismatch</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-200/80">
                    This card is assigned to <strong>{assignedMember?.name}</strong>. You are currently signed in as{' '}
                    <strong>{user?.name || user?.email}</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => logout()}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Switch Account</span>
                  </button>
                  <button
                    onClick={() =>
                      activateMutation.mutate()
                    }
                    className="py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                  >
                    Try Activate
                  </button>
                </div>
              </div>
            ) : (
              /* LOGGED IN AS ASSIGNED USER (MATCHED!) */
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>
                    Authenticated as <strong>{user?.name || assignedMember?.name}</strong>. Ready to activate.
                  </span>
                </div>

                {activateMutation.isError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>
                      {activateMutation.error?.response?.data?.message || 'Failed to activate card.'}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => activateMutation.mutate()}
                  disabled={activateMutation.isPending}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {activateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Activating Card...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Activate Card</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Security Footer Notice */}
        <p className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Single-use secure token verification • OneWinq Hardware Engine
        </p>
      </div>
    </div>
  );
};
