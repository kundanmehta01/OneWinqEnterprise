import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CreditCard,
  AlertTriangle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { cardApi } from '../api/cardApi';

export const PublicCardTapPage = () => {
  const { cardUid } = useParams();
  const navigate = useNavigate();

  const { data: responseData, isLoading, error } = useQuery({
    queryKey: ['public-card-tap', cardUid],
    queryFn: () => cardApi.resolvePublicTap(cardUid),
    enabled: Boolean(cardUid),
    retry: 1
  });

  const tapData = responseData?.data || responseData;

  useEffect(() => {
    if (tapData?.status === 'active' && tapData?.redirectUrl) {
      navigate(tapData.redirectUrl, { replace: true });
    }
  }, [tapData, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
          <p className="text-xs font-semibold text-slate-400">Resolving NFC smart card...</p>
        </div>
      </div>
    );
  }

  if (error || !tapData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-rose-500/20 rounded-3xl p-8 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Card Not Found</h2>
            <p className="text-xs text-slate-400">
              Smart card <strong>{cardUid}</strong> is not recognized in the OneWinq system.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  // Active status will redirect automatically via useEffect.
  // If pending activation or available:
  const isPending = tapData.status === 'activation_pending';
  const isAvailable = tapData.status === 'available';
  const isSuspended = tapData.status === 'suspended';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
          <CreditCard className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${
              isPending
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : isSuspended
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}
          >
            {isPending ? 'Activation Pending' : isSuspended ? 'Temporarily Suspended' : 'Unassigned Card'}
          </span>

          <h2 className="text-xl font-bold text-white tracking-tight font-mono">{tapData.cardUid || cardUid}</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {tapData.message || 'This NFC card is registered in the OneWinq system.'}
          </p>
        </div>

        {isPending && tapData.assignedTo && (
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-left space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-400">Card Reserved For</p>
            <p className="font-semibold text-white text-sm">{tapData.assignedTo.name}</p>
            <p className="text-xs text-slate-400">{tapData.assignedTo.designation}</p>
          </div>
        )}

        <div className="pt-2">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 transition-all"
          >
            <span>Enterprise Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
