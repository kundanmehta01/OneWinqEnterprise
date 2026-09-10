import React from 'react';
import { Grid, Plus } from 'lucide-react';
import { Button } from '../common/Button';

export const RolesHeader = ({ onCreateRole, onMatrixToggle }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Roles &amp; Permissions</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage user roles and their access permissions across the platform.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto">
        <Button
          variant="outline"
          size="md"
          icon={Grid}
          onClick={onMatrixToggle}
        >
          Permission Matrix
        </Button>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={onCreateRole}
        >
          Create Role
        </Button>
      </div>
    </div>
  );
};
