import React from 'react';

export const Avatar = ({ src, name = '', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-lg'
  };

  const initial = name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div
      className={`rounded-2xl flex items-center justify-center flex-shrink-0 font-bold overflow-hidden select-none ${
        sizeClasses[size] || sizeClasses.md
      } ${
        src
          ? 'bg-slate-100'
          : 'bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 text-white shadow-xs'
      } ${className}`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
};
