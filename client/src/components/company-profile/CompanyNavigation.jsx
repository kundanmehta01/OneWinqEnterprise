import React from 'react';
import { Compass } from 'lucide-react';

export const CompanyNavigation = ({ navLinks = [], onChange }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
        <Compass className="w-4 h-4 text-indigo-600" />
        Portal Navigation Bar
      </h3>
      <p className="text-xs text-slate-400">
        Public header menu items for external visitors viewing your company portal.
      </p>
    </div>
  );
};
