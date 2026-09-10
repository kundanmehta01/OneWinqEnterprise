import React from 'react';
import { Layers, Plus } from 'lucide-react';
import { Button } from '../common/Button';

export const TemplatesHeader = ({ onCreateTemplate, onCategories }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Templates</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Create, manage and assign profile templates for your organization.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto">
        <Button
          variant="outline"
          size="md"
          icon={Layers}
          onClick={onCategories}
        >
          Template Categories
        </Button>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={onCreateTemplate}
        >
          Create Template
        </Button>
      </div>
    </div>
  );
};
