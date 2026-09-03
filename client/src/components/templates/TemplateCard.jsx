import React from 'react';
import { Badge } from '../common/Badge';

export const TemplateCard = ({ template, onSelect, isSelected }) => {
  const primaryColor = template.layoutConfig?.colorPalette?.primary || '#6366F1';

  return (
    <div
      onClick={() => onSelect?.(template)}
      className={`rounded-2xl border p-4 bg-white transition cursor-pointer ${
        isSelected ? 'border-indigo-600 shadow-md ring-2 ring-indigo-500/20' : 'border-slate-100 hover:border-slate-200'
      }`}
    >
      <div className="h-20 rounded-xl mb-3 relative overflow-hidden" style={{ backgroundColor: primaryColor }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-800">{template.name}</h4>
        {template.isDefault && <Badge variant="indigo">Default</Badge>}
      </div>
    </div>
  );
};
