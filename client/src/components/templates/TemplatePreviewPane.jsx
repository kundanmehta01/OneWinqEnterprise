import React from 'react';
import { Eye, Edit3, CheckCircle, MapPin, Mail, Phone, Building2, ChevronDown } from 'lucide-react';
import { Button } from '../common/Button';
import { formatDate } from '../../utils/formatDate';

export const TemplatePreviewPane = ({ template, onEdit, onFullPreview }) => {
  const t = template || {
    name: 'Executive Profile',
    category: 'Executive',
    type: 'Individual',
    createdOn: '2025-05-10',
    updatedAt: '2025-05-18',
    assignedTo: '24 members',
    status: 'active'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4">Template Preview &amp; Details</h3>

        {/* Digital Business Card Mockup */}
        <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm mb-6">
          {/* Card Banner */}
          <div className="h-28 bg-gradient-to-r from-indigo-800 via-indigo-600 to-violet-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
          </div>

          {/* Profile Details Container */}
          <div className="px-5 pb-5 pt-0 -mt-10 relative">
            <div className="flex items-end justify-between mb-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-white bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-md flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                  <span className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-600">
                    YN
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center border-2 border-white shadow-xs">
                  <CheckCircle className="w-3 h-3 fill-current" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-base font-extrabold text-slate-900">Your Name</h4>
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600 text-white" />
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Designation</p>
            </div>

            {/* Micro info icons */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Department
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Location
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" /> Contact
              </span>
            </div>

            {/* About placeholder */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                About
              </p>
              <div className="space-y-1.5">
                <div className="h-2 bg-slate-100 rounded-full w-full" />
                <div className="h-2 bg-slate-100 rounded-full w-4/5" />
              </div>
            </div>

            {/* Skills placeholder */}
            <div className="mt-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Skills
              </p>
              <div className="flex items-center gap-1.5">
                <span className="h-2 bg-indigo-600 rounded-full w-12" />
                <span className="h-2 bg-indigo-400 rounded-full w-16" />
                <span className="h-2 bg-indigo-200 rounded-full w-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Key-Value Details */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Template Name</span>
            <span className="font-semibold text-slate-800">{t.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Category</span>
            <span className="font-semibold text-slate-800">{t.category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Type</span>
            <span className="font-semibold text-slate-800">{t.type}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Created On</span>
            <span className="font-semibold text-slate-800">{formatDate(t.createdOn)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Last Updated</span>
            <span className="font-semibold text-slate-800">{formatDate(t.updatedAt)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Assigned To</span>
            <span className="font-semibold text-indigo-600">{t.assignedTo || '24 members'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
        <Button
          variant="outline"
          size="md"
          icon={Eye}
          onClick={() => onFullPreview?.(t)}
          className="flex-1"
        >
          Preview Template
        </Button>

        <Button
          variant="primary"
          size="md"
          icon={Edit3}
          onClick={() => onEdit?.(t)}
          className="flex-1 gap-2"
        >
          <span>Edit Template</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
