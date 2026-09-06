import React from 'react';
import { Modal } from '../common/Modal';

export const MemberDetailsModal = ({ isOpen, onClose, member }) => {
  if (!member) return null;
  const profile = member.profileId || {};
  const qrValue = profile.qrCode || profile.qrUrl || member.qrCode || member.qrUrl;
  const email = member.email || member.userId?.email;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Member Profile Overview">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center">
            {member.name?.charAt(0) || 'M'}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
            <p className="text-xs text-slate-400">{email || 'No email available'}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl"><span className="text-slate-400 block mb-1">Designation</span><span className="font-bold text-slate-800">{member.designation || profile.headline || '-'}</span></div>
          <div className="bg-slate-50 p-3 rounded-xl"><span className="text-slate-400 block mb-1">Department</span><span className="font-bold text-slate-800">{member.departmentId?.name || '-'}</span></div>
          <div className="bg-slate-50 p-3 rounded-xl"><span className="text-slate-400 block mb-1">Role</span><span className="font-bold text-slate-800">{member.roleId?.name || '-'}</span></div>
          <div className="bg-slate-50 p-3 rounded-xl"><span className="text-slate-400 block mb-1">Status</span><span className="font-bold text-slate-800 capitalize">{member.status || '-'}</span></div>
          <div className="bg-slate-50 p-3 rounded-xl"><span className="text-slate-400 block mb-1">Location</span><span className="font-bold text-slate-800">{profile.location || profile.city || '-'}</span></div>
          <div className="bg-slate-50 p-3 rounded-xl"><span className="text-slate-400 block mb-1">Profile Completion</span><span className="font-bold text-slate-800">{member.profileCompletionScore ?? profile.completionPercentage ?? '-'}{(member.profileCompletionScore ?? profile.completionPercentage) != null ? '%' : ''}</span></div>
        </div>
        {profile.bio && <div className="bg-slate-50 p-3 rounded-xl text-xs"><span className="text-slate-400 block mb-1">About</span><p className="text-slate-700 whitespace-pre-wrap">{profile.bio}</p></div>}
        {qrValue && <div className="border border-slate-200 rounded-xl p-4 text-center"><p className="text-xs font-semibold text-slate-500 mb-2">Profile QR Code</p><img src={qrValue} alt="Member profile QR code" className="w-36 h-36 mx-auto object-contain" /></div>}
      </div>
    </Modal>
  );
};
