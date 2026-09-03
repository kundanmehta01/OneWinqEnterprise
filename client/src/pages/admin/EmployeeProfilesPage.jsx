import React, { useState } from 'react';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import {
  UserCheck,
  Search,
  ExternalLink,
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileEdit,
  Eye,
  Building2,
  QrCode,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmployeeProfilesPage = () => {
  const { members, loading, pagination, params, updateFilters, changePage } = useTeamMembers();
  const [searchTerm, setSearchTerm] = useState(params.search || '');
  const [selectedStatus, setSelectedStatus] = useState(params.status || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchTerm });
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    updateFilters({ status });
  };

  const totalMembers = pagination.totalItems || members.length;
  const approvedCount = members.filter((m) => m.profileId?.approvalStatus === 'approved').length;
  const pendingCount = members.filter((m) => m.profileId?.approvalStatus === 'pending').length;
  const draftCount = members.filter((m) => !m.profileId || m.profileId?.approvalStatus === 'draft').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Employee Profiles
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Monitor and manage enterprise digital business cards and employee profiles
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/profile-approvals">
            <Button variant="outline" size="sm" icon={Clock}>
              Pending Approvals ({pendingCount})
            </Button>
          </Link>
          <Link to="/admin/team-members">
            <Button variant="primary" size="sm" icon={UserCheck}>
              Team Directory
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Profiles</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">{totalMembers}</h3>
          <p className="text-[11px] text-slate-400 mt-1">Enterprise team members</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Live &amp; Approved</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-emerald-700 mt-2">{approvedCount}</h3>
          <p className="text-[11px] text-slate-400 mt-1">Public digital business cards</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Under Review</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-amber-700 mt-2">{pendingCount}</h3>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting admin review</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Draft / Incomplete</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <FileEdit className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-700 mt-2">{draftCount}</h3>
          <p className="text-[11px] text-slate-400 mt-1">Not yet submitted</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by member name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </form>

        <div className="flex items-center gap-2">
          {['', 'active', 'inactive', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
                selectedStatus === status
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status || 'All Members'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Employee Profiles */}
      {loading ? (
        <div className="py-24">
          <LoadingSpinner message="Loading employee profiles..." />
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-card">
          <EmptyState
            icon={UserCheck}
            title="No employee profiles found"
            description="Invite team members or adjust search filters to view profiles."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((member) => {
            const profile = member.profileId || {};
            const approvalStatus = profile.approvalStatus || 'draft';
            const completion = profile.completionPercentage ?? 20;
            const slug = profile.slug || member._id;

            return (
              <div
                key={member._id}
                className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5">
                  {/* Top Bar: Department & Status */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {member.departmentId?.name || 'General'}
                    </span>

                    <Badge
                      variant={
                        approvalStatus === 'approved'
                          ? 'green'
                          : approvalStatus === 'pending'
                          ? 'amber'
                          : 'default'
                      }
                      dot
                    >
                      {approvalStatus === 'approved'
                        ? 'Live'
                        : approvalStatus === 'pending'
                        ? 'Pending'
                        : 'Draft'}
                    </Badge>
                  </div>

                  {/* Member Info */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 text-white font-black text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-full h-full rounded-2xl object-cover"
                        />
                      ) : (
                        member.name?.charAt(0) || 'M'
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">
                        {member.designation || 'Team Member'}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  {/* Profile Completion Bar */}
                  <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-600">Completeness</span>
                      <span className="font-bold text-indigo-600">{completion}%</span>
                    </div>
                    <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Action Links */}
                <div className="border-t border-slate-100 px-5 py-3.5 bg-slate-50/40 flex items-center justify-between text-xs">
                  {approvalStatus === 'approved' ? (
                    <a
                      href={`/p/${slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-bold transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Card
                    </a>
                  ) : approvalStatus === 'pending' ? (
                    <Link
                      to="/admin/profile-approvals"
                      className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-700 font-bold transition"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Review Now
                    </Link>
                  ) : (
                    <span className="text-slate-400 font-medium">Unpublished</span>
                  )}

                  <Link
                    to="/admin/team-members"
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold transition"
                  >
                    <span>Manage Member</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-end">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={changePage}
          />
        </div>
      )}
    </div>
  );
};
