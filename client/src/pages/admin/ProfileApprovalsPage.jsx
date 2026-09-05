import React, { useState } from 'react';
import { useApprovals } from '../../hooks/useApprovals';
import { ReviewModal } from '../../components/profile-approvals/ReviewModal';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { CheckCircle2, Clock, Eye, AlertCircle } from 'lucide-react';
import { formatDate, formatRelativeTime } from '../../utils/formatDate';

export const ProfileApprovalsPage = () => {
  const {
    approvals,
    pagination,
    params,
    loading,
    updateFilters,
    changePage,
    refetch
  } = useApprovals();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);

  const handleOpenReview = (approval) => {
    setSelectedApproval(approval);
    setReviewModalOpen(true);
  };

  const getStatusBadge = (status = '') => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge variant="green" dot>Approved</Badge>;
      case 'rejected':
        return <Badge variant="red" dot>Rejected</Badge>;
      case 'changes_requested':
        return <Badge variant="amber" dot>Changes Requested</Badge>;
      default:
        return <Badge variant="blue" dot>Pending Review</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Profile Approvals</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review and approve pending employee profile updates before publishing.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          {['', 'pending', 'approved', 'rejected', 'changes_requested'].map((s) => (
            <button
              key={s}
              onClick={() => updateFilters({ status: s })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                params.status === s
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s === '' ? 'All Requests' : s === 'changes_requested' ? 'Changes Requested' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-24">
          <LoadingSpinner message="Loading profile approval requests..." />
        </div>
      ) : approvals.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No approval requests found"
          description="There are currently no profile submissions in this review state."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Employee</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Submitted On</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {approvals.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {app.memberId?.name?.charAt(0) || 'E'}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{app.memberId?.name || 'Employee'}</h4>
                          <p className="text-[11px] text-slate-400">{app.submittedBy?.email || '-'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium">{app.memberId?.designation || '-'}</td>
                    <td className="py-3.5 px-4 text-slate-500">{app.memberId?.departmentId?.name || 'General'}</td>
                    <td className="py-3.5 px-4 text-slate-500">{formatRelativeTime(app.submittedAt)}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(app.status)}</td>
                    <td className="py-3.5 px-5 text-right">
                      <Button
                        size="sm"
                        variant={app.status === 'pending' ? 'primary' : 'outline'}
                        icon={Eye}
                        onClick={() => handleOpenReview(app)}
                      >
                        {app.status === 'pending' ? 'Review' : 'View Diff'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={changePage}
            label="requests"
          />
        </div>
      )}

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        approval={selectedApproval}
        onSuccess={refetch}
      />
    </div>
  );
};
