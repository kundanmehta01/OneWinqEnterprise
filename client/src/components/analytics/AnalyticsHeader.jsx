import React from 'react';
import { Calendar, Download, ChevronDown } from 'lucide-react';
import { Button } from '../common/Button';

export const AnalyticsHeader = ({ onExport }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Analytics</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Track and analyze your organization&apos;s profile performance and engagement.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>May 18 – May 24, 2025</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <Button
          variant="outline"
          size="md"
          icon={Download}
          onClick={onExport}
        >
          Export Report
        </Button>
      </div>
    </div>
  );
};
