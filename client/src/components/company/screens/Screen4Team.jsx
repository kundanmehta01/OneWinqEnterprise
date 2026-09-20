import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Users,
  ExternalLink,
  Loader2,
  Mail,
  Eye,
  EyeOff,
  Globe,
  Settings2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { companyApi } from '../../../api/companyApi';
import { teamApi } from '../../../api/teamApi';

export const Screen4Team = ({ profile, onBack, onNavigate, isEditable = false }) => {
  const queryClient = useQueryClient();
  const [selectedDept, setSelectedDept] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all'); // 'all' | 'visible' | 'hidden'

  // When editing in studio, fetch all organization members so hidden ones can be managed
  const { data: adminTeamResponse, isLoading: isAdminLoading } = useQuery({
    queryKey: ['adminAllTeamMembers'],
    queryFn: () => teamApi.getAll({ limit: 100 }),
    enabled: !!isEditable,
  });

  // When viewing publicly, fetch only visible members
  const { data: publicTeamResponse, isLoading: isPublicLoading } = useQuery({
    queryKey: ['publicTeamMembers'],
    queryFn: companyApi.getPublicTeam,
    enabled: !isEditable,
  });

  const isLoading = isEditable ? isAdminLoading : isPublicLoading;

  // Normalize members list based on mode
  const rawAdminList = Array.isArray(adminTeamResponse?.data)
    ? adminTeamResponse.data
    : Array.isArray(adminTeamResponse?.members)
    ? adminTeamResponse.members
    : Array.isArray(adminTeamResponse?.data?.members)
    ? adminTeamResponse.data.members
    : Array.isArray(adminTeamResponse)
    ? adminTeamResponse
    : [];

  const rawPublicList = Array.isArray(publicTeamResponse?.data)
    ? publicTeamResponse.data
    : Array.isArray(publicTeamResponse)
    ? publicTeamResponse
    : [];

  const members = isEditable
    ? rawAdminList.map((m) => ({
        _id: m._id,
        name: m.name,
        designation: m.designation,
        department: m.departmentId?.name || (typeof m.departmentId === 'string' ? m.departmentId : '') || 'General',
        avatarUrl: m.avatarUrl,
        slug: m.profileId?.slug || '',
        isVerified: m.isVerified,
        showOnCompanyProfile: m.showOnCompanyProfile !== false,
      }))
    : rawPublicList;

  // Toggle visibility mutation for admins in studio
  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, showOnCompanyProfile }) => {
      return await teamApi.toggleCompanyProfileVisibility(id, showOnCompanyProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAllTeamMembers'] });
      queryClient.invalidateQueries({ queryKey: ['publicTeamMembers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
    },
    onError: (err) => {
      alert(err?.message || 'Failed to update visibility.');
    }
  });

  // Extract unique departments dynamically
  const departments = ['all', ...new Set(members.map((m) => m.department).filter(Boolean))];

  // Filter members based on department and visibility
  const filteredMembers = members.filter((m) => {
    const matchesDept = selectedDept === 'all' || m.department === selectedDept;
    if (!matchesDept) return false;

    if (isEditable) {
      const isVisible = m.showOnCompanyProfile !== false;
      if (visibilityFilter === 'visible') return isVisible;
      if (visibilityFilter === 'hidden') return !isVisible;
    }
    return true;
  });

  const visibleCount = members.filter((m) => m.showOnCompanyProfile !== false).length;
  const hiddenCount = members.filter((m) => m.showOnCompanyProfile === false).length;

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
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">Team Directory</h3>
            <p className="text-xs text-slate-500">Verified Leadership, Executives & Specialists</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditable ? (
            <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
              {visibleCount} Active on Profile
            </span>
          ) : (
            <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
              {members.length} {members.length === 1 ? 'Member' : 'Members'}
            </span>
          )}
        </div>
      </div>

      {/* Admin Studio Management Banner */}
      {isEditable && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/80 to-indigo-50/80 border border-purple-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
              <Globe className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Company Profile Visibility Manager</span>
            </div>
            <Link
              to="/admin/team"
              className="inline-flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-900 font-bold hover:underline cursor-pointer"
            >
              <span>Manage in Users Table</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-[11px] text-purple-800/80 leading-relaxed">
            Choose which organization members appear on the public company profile. Use the toggle buttons below to show or hide members instantly.
          </p>

          {/* Visibility Filter Tabs */}
          <div className="flex items-center gap-1.5 pt-1 flex-wrap">
            <button
              type="button"
              onClick={() => setVisibilityFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                visibilityFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-purple-100/60 border border-purple-200/60'
              }`}
            >
              All ({members.length})
            </button>
            <button
              type="button"
              onClick={() => setVisibilityFilter('visible')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                visibilityFilter === 'visible'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <Eye className="w-3 h-3" /> Shown ({visibleCount})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setVisibilityFilter('hidden')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                visibilityFilter === 'hidden'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <EyeOff className="w-3 h-3" /> Hidden ({hiddenCount})
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Department Filter Tabs */}
      {departments.length > 1 && (
        <div className="flex bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80 gap-1 overflow-x-auto">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`py-2 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedDept === dept
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {dept === 'all' ? 'All Departments' : dept}
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
          {filteredMembers.map((member) => {
            const isVisible = member.showOnCompanyProfile !== false;

            return (
              <div
                key={member._id}
                className={`clean-card clean-card-hover p-5 bg-white border rounded-3xl flex items-center justify-between group shadow-2xs transition-all ${
                  isEditable && !isVisible
                    ? 'border-dashed border-slate-300 bg-slate-50/60 opacity-80'
                    : 'border-slate-100'
                }`}
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
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                        {member.name}
                      </h4>
                      {isEditable && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isVisible
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          {isVisible ? 'Shown' : 'Hidden'}
                        </span>
                      )}
                    </div>
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

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {/* Admin Direct Toggle Button */}
                  {isEditable && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibilityMutation.mutate({
                          id: member._id,
                          showOnCompanyProfile: !isVisible
                        });
                      }}
                      disabled={toggleVisibilityMutation.isPending}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                        isVisible
                          ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                      title={isVisible ? 'Click to hide from company profile' : 'Click to show on company profile'}
                    >
                      {isVisible ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Hide</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Show</span>
                        </>
                      )}
                    </button>
                  )}

                  {member.slug ? (
                    <Link
                      to={`/p/${member.slug}`}
                      className="w-10 h-10 rounded-full bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-600 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                      title="View Digital Profile"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      onClick={handleInquire}
                      className="w-10 h-10 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                      title="Send Inquiry"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="clean-card p-12 bg-white border border-slate-100 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-700">No team members found in this category.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isEditable
              ? 'No team members match the selected filter. Add members or adjust filters to view directory.'
              : 'Active verified team members from the organization database will appear here.'}
          </p>
        </div>
      )}

      {/* Action CTA */}
      <div className="pt-2">
        <button
          onClick={handleInquire}
          className="w-full py-3.5 px-6 rounded-full btn-outline-purple text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-2xs group cursor-pointer"
        >
          <span>Get in Touch with our Team</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
