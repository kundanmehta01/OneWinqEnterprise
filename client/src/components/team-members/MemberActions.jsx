import React from 'react';
import { MoreHorizontal, Edit, Trash2, RotateCcw, ExternalLink } from 'lucide-react';
import { Dropdown } from '../common/Dropdown';

export const MemberActions = ({ member, onEdit, onArchive, onRestore }) => {
  const isArchived = member.status === 'archived';
  const slug = member.profileId?.slug;

  const items = [
    { label: 'Edit Member', icon: Edit, onClick: () => onEdit?.(member) },
    ...(slug
      ? [{ label: 'View Public Card', icon: ExternalLink, onClick: () => window.open(`/p/${slug}`, '_blank') }]
      : []),
    { divider: true },
    ...(isArchived
      ? [{ label: 'Restore Member', icon: RotateCcw, onClick: () => onRestore?.(member._id) }]
      : [{ label: 'Archive Member', icon: Trash2, danger: true, onClick: () => onArchive?.(member._id) }])
  ];

  return (
    <Dropdown
      trigger={
        <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      }
      items={items}
    />
  );
};
