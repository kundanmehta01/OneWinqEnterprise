import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, ArrowLeft, ArrowRight, Users, ExternalLink, Loader2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { companyApi } from '../../../api/companyApi';

export const Screen4Team = ({ profile, onBack, onNavigate }) => {
  const [selectedDept, setSelectedDept] = useState('all');

  const { data: teamResponse, isLoading } = useQuery({
    queryKey: ['publicTeamMembers'],
    queryFn: companyApi.getPublicTeam,
  });

  const members = teamResponse?.data || teamResponse || [];

  // Extract unique departments dynamically
  const departments = ['all', ...new Set(members.map((m) => m.department).filter(Boolean))];

  const filteredMembers =
    selectedDept === 'all'
      ? members
      : members.filter((m) => m.department === selectedDept);

  const handleInquire = () => {
    if (onNavigate) {
      onNavigate(8);
    }
  };

  return (
    <div className="space-y-6 pb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">Team Directory</h3>
            <p className="text-xs text-slate-500">Verified Leadership, Executives & Specialists</p>
          </div>
        </div>
        <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
          {members.length} {members.length === 1 ? 'Member' : 'Members'}
        </span>
      </div>

      {/* Dynamic Department Filter Tabs */}
      {departments.length > 1 && (
        <div className="flex bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80 gap-1 overflow-x-auto">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`py-2 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDept === dept
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {dept === 'all' ? 'All Members' : dept}
            </button>
          ))}
        </div>
      )}

      {/* Team Members List / Grid */}
      {isLoading ? (
        <div className="clean-card p-12 bg-white border border-slate-100 rounded-3xl text-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600 mx-auto" />
          <p className="text-xs text-slate-500">Loading team directory...</p>
        </div>
      ) : filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member._id}
              className="clean-card clean-card-hover p-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between group shadow-2xs transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative shrink-0">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                      {member.name?.slice(0, 2).toUpperCase() || 'TM'}
                    </div>
                  )}
                  {member.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white p-0.5 rounded-full ring-2 ring-white">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                    {member.name}
                  </h4>
                  <p className="text-xs font-semibold text-slate-600 truncate">{member.designation}</p>
                  {member.department && (
                    <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {member.department}
                    </span>
                  )}
                  {member.bio && (
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{member.bio}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {member.slug ? (
                  <Link
                    to={`/p/${member.slug}`}
                    className="w-10 h-10 rounded-full bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-600 flex items-center justify-center transition-all shadow-2xs"
                    title="View Digital Profile"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    onClick={handleInquire}
                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-slate-600 flex items-center justify-center transition-all"
                    title="Send Inquiry"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="clean-card p-12 bg-white border border-slate-100 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-700">No team members found in this category.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Active verified team members from the organization database will appear here.
          </p>
        </div>
      )}

      {/* Action CTA */}
      <div className="pt-2">
        <button
          onClick={handleInquire}
          className="w-full py-3.5 px-6 rounded-full btn-outline-purple text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-2xs group"
        >
          <span>Get in Touch with our Team</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
