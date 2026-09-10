import React, { useState } from 'react';
import { useInvitations } from '../../hooks/useInvitations';
import { useDepartments } from '../../hooks/useDepartments';
import { useRoles } from '../../hooks/useRoles';
import { InviteMemberModal } from '../../components/team-members/InviteMemberModal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Send, RefreshCw, XCircle, MailCheck, UserPlus } from 'lucide-react';
import { invitationService } from '../../services/invitationService';
import { useNotification } from '../../hooks/useNotification';
import { formatDate } from '../../utils/formatDate';

export const InvitationsPage = () => {
  const {
    invitations,
    pagination,
    params,
    loading,
    updateFilters,
    changePage,
    refetch
  } = useInvitations();

  const { departments } = useDepartments();
  const { roles } = useRoles();
  const { success, error: notifyError } = useNotification();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const handleResend = async (id) => {
    try {
      await invitationService.resend(id);
      success('Invitation email resent successfully');
      refetch();
    } catch (err) {
      notifyError(err.message || 'Failed to resend invitation');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this pending invitation?')) return;
    try {
      await invitationService.cancel(id);
      success('Invitation cancelled');
      refetch();
    } catch (err) {
      notifyError(err.message || 'Failed to cancel invitation');
    }
  };

  const getStatusBadge = (status = '') => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return <Badge variant="green" dot>Accepted</Badge>;
      case 'expired':
        return <Badge variant="red" dot>Expired</Badge>;
      case 'cancelled':
        return <Badge variant="default" dot>Cancelled</Badge>;
      default:
        return <Badge variant="amber" dot>Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Invitations</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track and dispatch invitations for onboarding new team members.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            icon={UserPlus}
            onClick={() => setInviteModalOpen(true)}
          >
            Invite Member
          </Button>
        </div>
      </div>

      {/* Filter tab buttons */}
      <div className="flex items-center gap-2">
        {['', 'pending', 'accepted', 'expired'].map((s) => (
          <button
            key={s}
            onClick={() => updateFilters({ status: s })}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              params.status === s
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s === '' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-24">
          <LoadingSpinner message="Loading invitation logs..." />
        </div>
      ) : invitations.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No invitations found"
          description="Send an invitation to bring new employees onto the platform."
          actionLabel="Send Invitation"
          onAction={() => setInviteModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Recipient</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Expires</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {invitations.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <div>
                        <h4 className="font-bold text-slate-900">{inv.name || 'Invited User'}</h4>
                        <p className="text-[11px] text-slate-400">{inv.email}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium">{inv.designation || '-'}</td>
                    <td className="py-3.5 px-4 text-slate-500">{inv.departmentId?.name || 'General'}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="purple">{inv.roleId?.name || 'Member'}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{formatDate(inv.expiresAt)}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(inv.status)}</td>
                    <td className="py-3.5 px-5 text-right">
                      {inv.status === 'pending' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleResend(inv._id)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Resend email"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCancel(inv._id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Cancel invitation"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
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
            label="invitations"
          />
        </div>
      )}

      <InviteMemberModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        departments={departments}
        roles={roles}
        onSuccess={refetch}
      />
    </div>
  );
};
