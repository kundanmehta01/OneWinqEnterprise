import React from 'react';
import { Upload, UserPlus, ChevronDown } from 'lucide-react';
import { Button } from '../common/Button';

export const TeamMembersHeader = ({ onAddMember, onInviteMember }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Team Members</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage and organize all members of your organization.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto">
        <Button
          variant="outline"
          size="md"
          icon={Upload}
          onClick={onInviteMember}
        >
          Invite Members
        </Button>

        <Button
          variant="primary"
          size="md"
          icon={UserPlus}
          onClick={onAddMember}
          className="gap-2"
        >
          <span>Add Member</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
