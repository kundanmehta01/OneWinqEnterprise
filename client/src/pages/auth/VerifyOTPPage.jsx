import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Mail, ArrowLeft } from 'lucide-react';

/**
 * VerifyOTPPage
 *
 * OneWinq does NOT use email OTP verification for self-registration.
 * The platform is invite-only. If a user lands here, redirect them
 * to the correct invitation acceptance flow.
 */
export const VerifyOTPPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366F1_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-900/50 mb-6">
            <Zap className="w-7 h-7 text-white fill-white" />
          </div>

          <div className="w-14 h-14 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-indigo-300" />
          </div>

          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Looking for Your Invitation?
          </h1>
          <p className="text-xs text-white/50 mt-2 leading-relaxed max-w-xs mx-auto">
            OneWinq uses secure invitation links — not OTP codes. Check your email for an invitation link from your organization administrator.
          </p>

          <div className="mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-left space-y-1.5">
            <p className="text-xs text-white/70 font-semibold">What to look for:</p>
            <ul className="text-[11px] text-white/50 space-y-1 list-disc list-inside">
              <li>Subject: <span className="text-white/70 font-medium">"You&apos;re invited to join [Company] on OneWinq"</span></li>
              <li>A button or link labeled <span className="text-white/70 font-medium">"Accept Invitation"</span></li>
              <li>Check your spam/junk folder if you don&apos;t see it</li>
            </ul>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              to="/accept-invitation"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-3 transition shadow-lg shadow-indigo-900/40"
            >
              <span>Enter My Invitation Token Manually</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 font-medium transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
          </div>
        </div>

        <p className="text-center text-[11px] text-white/20 mt-4">
          OneWinq Enterprise © 2026 · Secure Identity Infrastructure
        </p>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
