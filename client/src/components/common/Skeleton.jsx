import React from 'react';

export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse bg-slate-200/70 rounded-xl ${className || 'h-4 w-full'}`}
        />
      ))}
    </div>
  );
};
