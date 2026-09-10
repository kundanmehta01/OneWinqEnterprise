import React from 'react';
import { Zap } from 'lucide-react';

export const AuthHeader = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-900/50 mb-4">
        <Zap className="w-7 h-7 text-white fill-white" />
      </div>
      <h1 className="text-2xl font-extrabold text-white tracking-tight">{title}</h1>
      {subtitle && <p className="text-xs text-white/50 mt-1 font-medium">{subtitle}</p>}
    </div>
  );
};
