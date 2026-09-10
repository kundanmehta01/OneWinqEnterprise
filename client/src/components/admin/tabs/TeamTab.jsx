import React from 'react';
import { Users, ShieldCheck, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCompanyProfileStore } from '../../../stores/companyProfileStore';

export const TeamTab = () => {
  const { draft } = useCompanyProfileStore();
  if (!draft) return null;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Leadership & Team Showcase (Screen 4)</h3>
          <p className="text-xs text-slate-500">Team members are dynamically synchronized from the Team Directory.</p>
        </div>
        <Link
          to="/admin/team"
          className="btn-blue px-3.5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
        >
          <Users className="w-4 h-4" />
          Manage Team Directory
        </Link>
      </div>

      <div className="clean-card p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Active Executive & Core Team</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Screen 4 in the Company Identity Flow displays verified executive leaders (e.g. CEO Rajat Chaturvedi, CTO Himanshu Jain), Core Engineers, and Advisors.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Want to add new employees or update designations?</span>
          <Link to="/admin/team" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
            Open Team Directory <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
