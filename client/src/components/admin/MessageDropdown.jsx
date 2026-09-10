import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';

export const MessageDropdown = ({ count = 3 }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate('/admin/invitations')}
      className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
      title="Invitations & Messages"
    >
      <Mail className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-xs">
          {count}
        </span>
      )}
    </button>
  );
};
