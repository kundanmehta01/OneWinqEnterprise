import React from 'react';
import { Button } from '../common/Button';
import { Trash2, Mail } from 'lucide-react';

export const BulkMemberActions = ({ selectedCount = 0, onArchiveAll, onEmailAll }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl text-xs">
      <span className="font-bold text-indigo-900">{selectedCount} members selected</span>
      <Button size="sm" variant="outline" icon={Mail} onClick={onEmailAll}>
        Send Notice
      </Button>
      <Button size="sm" variant="danger" icon={Trash2} onClick={onArchiveAll}>
        Archive
      </Button>
    </div>
  );
};
