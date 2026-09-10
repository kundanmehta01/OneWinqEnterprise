import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { invitationService } from '../../services/invitationService';
import { useNotification } from '../../hooks/useNotification';

export const InviteMemberModal = ({
  isOpen,
  onClose,
  departments = [],
  roles = [],
  onSuccess
}) => {
  const { success, error: notifyError } = useNotification();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    designation: 'Team Member',
    departmentId: '',
    roleId: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [inviteResult, setInviteResult] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!formData.roleId) {
      setErrors({ roleId: 'Please select a role' });
      return;
    }

    setLoading(true);
    try {
      const result = await invitationService.create({
        email: formData.email,
        name: formData.name,
        designation: formData.designation,
        roleId: formData.roleId,
        departmentId: formData.departmentId || undefined
      });
      setInviteResult(result || null);
      success('Invitation created for ' + formData.email);
      onSuccess?.();
    } catch (err) {
      notifyError(err.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const token = inviteResult?.token || inviteResult?.invitationToken || inviteResult?.data?.token;
  const returnedLink = inviteResult?.inviteUrl || inviteResult?.invitationUrl || inviteResult?.link || inviteResult?.url || inviteResult?.data?.inviteUrl;
  const invitationLink = returnedLink || (token ? `${window.location.origin}/accept-invitation?token=${encodeURIComponent(token)}` : '');
  const copyLink = async () => {
    if (!invitationLink) return;
    await navigator.clipboard?.writeText(invitationLink);
    setCopyStatus('Copied');
    setTimeout(() => setCopyStatus(''), 1800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite New Team Member"
      subtitle="Send an invitation link for the user to set up their profile"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="colleague@onewinq.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
        />

        <Input
          label="Full Name (Optional)"
          placeholder="e.g. John Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Input
          label="Designation"
          placeholder="e.g. Software Engineer"
          value={formData.designation}
          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Department"
            placeholder="Select Department"
            value={formData.departmentId}
            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
            options={departments.map((d) => ({ value: d._id, label: d.name }))}
          />
          <Select
            label="Assign Role"
            placeholder="Select Role"
            value={formData.roleId}
            onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
            options={roles.map((r) => ({ value: r._id, label: r.name }))}
            error={errors.roleId}
            required
          />
        </div>

        {inviteResult && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <p className="text-xs font-bold">Invitation Dispatched Successfully</p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              An invitation email has been dispatched to <strong className="text-slate-800">{formData.email}</strong>.
              The invitee can click the activation link in their email or go to <code className="px-1.5 py-0.5 rounded bg-white border border-emerald-200 text-[11px] font-mono text-indigo-600">/invite/accept</code> to activate their account.
            </p>

            {invitationLink ? (
              <div className="space-y-2 pt-1">
                <p className="text-[11px] text-emerald-700 font-mono break-all p-2 rounded-lg bg-white border border-emerald-200">
                  {invitationLink}
                </p>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={copyLink}>
                    {copyStatus || 'Copy Invitation Link'}
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => window.open(invitationLink, '_blank')}>
                    Open Link
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-1 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard?.writeText(`${window.location.origin}/invite/accept`);
                    setCopyStatus('Copied /invite/accept link');
                    setTimeout(() => setCopyStatus(''), 1800);
                  }}
                >
                  {copyStatus || 'Copy /invite/accept Link'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(`${window.location.origin}/invite/accept`, '_blank')}
                >
                  Open /invite/accept
                </Button>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={loading}>Close</Button>
          {!inviteResult ? (
            <Button type="submit" isLoading={loading}>Send Invitation</Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                setInviteResult(null);
                setFormData({ email: '', name: '', designation: 'Team Member', departmentId: '', roleId: '' });
              }}
            >
              Invite Another
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};
