import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

/**
 * RegisterPage — Invite-Only Onboarding Notice
 *
 * OneWinq Enterprise does NOT have open self-registration.
 * Users join by invitation only:
 *   1. Admin sends an email invitation via /admin/invitations
 *   2. Invitee clicks the link in their email → /accept-invitation?token=...
 *   3. Invitee sets their password and activates their account
 *
 * This page explains the flow and directs visitors appropriately.
 */
export const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background radial pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366F1_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-900/50 mb-6">
            <Zap className="w-7 h-7 text-white fill-white" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Invite-Only Platform
          </h1>
          <p className="text-xs text-white/50 mt-2 leading-relaxed max-w-xs mx-auto">
            OneWinq Enterprise is an invite-only workspace. New members join via an email invitation from their organization&apos;s administrator.
          </p>

          {/* Steps */}
          <div className="mt-8 space-y-3 text-left">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center flex-shrink-0 text-[11px] font-extrabold text-indigo-300">
                1
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Admin Sends Invitation</h4>
                <p className="text-[11px] text-white/40 mt-0.5">Your organization admin invites you via the OneWinq dashboard</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center flex-shrink-0 text-[11px] font-extrabold text-indigo-300">
                2
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-indigo-300" />
                  <h4 className="text-xs font-bold text-white">Check Your Email</h4>
                </div>
                <p className="text-[11px] text-white/40 mt-0.5">Click the secure link in the invitation email you received</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center flex-shrink-0 text-[11px] font-extrabold text-indigo-300">
                3
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-indigo-300" />
                  <h4 className="text-xs font-bold text-white">Activate Your Account</h4>
                </div>
                <p className="text-[11px] text-white/40 mt-0.5">Set your password and start building your digital profile</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 space-y-3">
            <p className="text-[11px] text-white/40">
              Received an invitation email?
            </p>
            <a
              href="/accept-invitation"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-3 transition shadow-lg shadow-indigo-900/40"
            >
              <span>Enter My Invitation Token</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-white/40">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-white/20 mt-4">
          OneWinq Enterprise © 2026 · Secure Identity Infrastructure
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
