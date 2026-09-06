import React from 'react';
import { Input } from '../common/Input';

export const OrganizationSettings = ({ settings = {}, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Organization Identity</h3>
      <p className="text-xs text-slate-400">Settings specific to enterprise multi-tenant configuration.</p>
    </div>
  );
};
