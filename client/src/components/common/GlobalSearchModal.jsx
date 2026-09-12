import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, Building2, Users, FolderTree, Shield, FileText, BarChart2, CreditCard, Calendar, Settings, X, ChevronRight } from 'lucide-react';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered by parent state or custom event
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNav = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { title: 'Company Profile', path: '/admin/company-profile', icon: Building2, category: 'Organization' },
    { title: 'Manage Users', path: '/admin/team', icon: Users, category: 'Organization' },
    { title: 'Departments', path: '/admin/departments', icon: FolderTree, category: 'Organization' },
    { title: 'Roles & Permissions', path: '/admin/roles', icon: Shield, category: 'Organization' },
    { title: 'Invitations', path: '/admin/invitations', icon: Users, category: 'Organization' },
    { title: 'Templates', path: '/admin/templates', icon: FileText, category: 'Profile' },
    { title: 'Analytics', path: '/admin/analytics', icon: BarChart2, category: 'Analytics' },
    { title: 'Manage Cards', path: '/admin/cards', icon: CreditCard, category: 'Hardware' },
    { title: 'Events', path: '/admin/events', icon: Calendar, category: 'Events' },
    { title: 'General Settings', path: '/admin/settings', icon: Settings, category: 'Settings' }
  ];

  const filtered = query.trim()
    ? quickNav.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase()))
    : quickNav;

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search anything across OneWinq..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">No results found for "{query}"</div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.category}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Press <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">ESC</kbd> to close</span>
          <span>Navigation Quick Search</span>
        </div>
      </div>
    </div>
  );
};
