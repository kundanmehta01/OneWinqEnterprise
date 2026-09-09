import React from 'react';

export const SocialLogin = ({ onGoogle, onMicrosoft }) => {
  return (
    <div className="space-y-3 pt-2">
      <div className="relative flex items-center justify-center">
        <div className="border-t border-white/10 w-full" />
        <span className="bg-slate-900 px-3 text-[11px] text-white/40 uppercase tracking-widest absolute">
          or continue with
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={onGoogle}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
        >
          Google SSO
        </button>
        <button
          type="button"
          onClick={onMicrosoft}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
        >
          Microsoft 365
        </button>
      </div>
    </div>
  );
};
