import React from 'react';

export const Card = ({ children, className = '', hover = false, p = 'p-6', ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-card ${p} ${
        hover ? 'hover:shadow-lg transition-all duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
