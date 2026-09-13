import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CreditCard,
  AlertTriangle,
  Loader2,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { cardApi } from '../api/cardApi';
import { useAuthStore } from '../stores/authStore';

export const PublicCardTapPage = () => {
  const { cardUid } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [isLinking, setIsLinking] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [linkSuccess, setLinkSuccess] = useState(false);

  // Resolve card by UID
  const { data: responseData, isLoading, error } = useQuery({
    queryKey: ['public-card-tap', cardUid],
    queryFn: () => cardApi.resolvePublicTap(cardUid),
    enabled: Boolean(cardUid),
    retry: 1
  });

  const tapData = responseData?.data || responseData;

  // If card is already active, redirect automatically to public profile
  useEffect(() => {
    if (tapData?.status === 'active' && tapData?.redirectUrl) {
      navigate(tapData.redirectUrl, { replace: true });
    }
  }, [tapData, navigate]);

  const handleLinkToProfile = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/c/${cardUid}`);
      return;
    }

    setIsLinking(true);
    setLinkError('');
    try {
      const res = await cardApi.claimCard(cardUid);
      setLinkSuccess(true);
      setTimeout(() => {
        const dest = res?.data?.redirectUrl || res?.redirectUrl || '/app/my-profile';
        navigate(dest, { replace: true });
      }, 1200);
    } catch (err) {
      setLinkError(err?.response?.data?.message || err?.message || 'Failed to link card to your profile.');
    } finally {
      setIsLinking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
          <p className="text-xs font-semibold text-slate-500">Checking card details...</p>
        </div>
      </div>
    );
  }

  if (error || !tapData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-xl space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-500">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-slate-900">Card Not Found</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Smart card <strong className="font-mono text-slate-800">{cardUid}</strong> is not recognized in the OneWinq system.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  // Active cards are redirected via useEffect above
  const isSuspended = tapData.status === 'suspended';
  const isDeactivated = tapData.status === 'deactivated';

  if (isSuspended || isDeactivated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-xl space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto text-amber-500">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-slate-900">
              {isSuspended ? 'Card Temporarily Suspended' : 'Card Deactivated'}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {tapData.message || 'This card is currently not active in the OneWinq system.'}
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-indigo-600 selection:text-white">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 text-center shadow-xl space-y-6 animate-in zoom-in-95">
        {/* Top Icon */}
        <div className="w-16 h-16 rounded-2xl bg-indigo-50/80 border border-indigo-100/80 flex items-center justify-center mx-auto text-indigo-600 shadow-2xs">
          <CreditCard className="w-8 h-8 stroke-[1.5]" />
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Activate Your Card</h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            This OneWinq smart business card has not been activated yet. Link it to your profile to start networking instantly.
          </p>
        </div>

        {/* Card Identifier Box */}
        <div className="bg-slate-50/90 border border-slate-100/90 rounded-2xl p-4 text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CARD IDENTIFIER</p>
          <p className="text-base font-bold text-indigo-600 font-mono mt-0.5">{cardUid}</p>
        </div>

        {/* Success or Error feedback */}
        {linkSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center gap-2 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Card linked successfully! Redirecting...</span>
          </div>
        ) : linkError ? (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold">
            {linkError}
          </div>
        ) : null}

        {/* User Session Info & Action Buttons */}
        <div className="space-y-3 pt-1">
          {isAuthenticated && user ? (
            <>
              <p className="text-xs text-slate-600">
                Logged in as <strong className="text-slate-900 font-bold">{userName}</strong> ({user.email})
              </p>
              <button
                type="button"
                onClick={handleLinkToProfile}
                disabled={isLinking || linkSuccess}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLinking && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Link to My Profile</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/app/home')}
                className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-2xl border border-slate-200/70 transition-all cursor-pointer"
              >
                Go to Dashboard
              </button>
            </>
          ) : (
            <>
              <p className="text-xs text-slate-500">
                Sign in to your OneWinq account to link this card to your profile.
              </p>
              <button
                type="button"
                onClick={() => navigate(`/login?redirect=/c/${cardUid}`)}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Sign In to Link Card</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate(`/login?mode=register&redirect=/c/${cardUid}`)}
                className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-2xl border border-slate-200/70 transition-all cursor-pointer"
              >
                Create Account
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
          <span>Powered by <strong className="text-slate-900 font-bold">OneWinq Digital</strong></span>
        </div>
      </div>
    </div>
  );
};

export default PublicCardTapPage;
