import React from 'react';

export const PageHeader = ({ title, description, actions, children }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        {description && (
          <p className="text-xs text-slate-500 mt-1 font-medium">{description}</p>
        )}
      </div>
      {(actions || children) && (
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {actions || children}
        </div>
      )}
    </div>
  );
};
