import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Network, CreditCard, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import { teamMemberService } from '../../services/teamMemberService';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose ? onClose(!isOpen) : null;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await teamMemberService.getAll({ search: query, limit: 5 });
        setResults(data.members || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const quickNav = [
    { label: 'Team Members Directory', path: '/admin/team-members', icon: Users },
    { label: 'Departments', path: '/admin/departments', icon: Network },
    { label: 'Profile Templates', path: '/admin/templates', icon: CreditCard },
    { label: 'Roles & Permissions', path: '/admin/roles', icon: ShieldCheck },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileText }
  ];

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24">
        <div
          className="relative w-full max-w-xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Input Box */}
          <div className="flex items-center px-4 border-b border-slate-100">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search team members, roles, templates..."
              className="w-full py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
            <kbd className="hidden sm:inline-flex items-center rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
              ESC
            </kbd>
          </div>

          {/* Results section */}
          <div className="max-h-80 overflow-y-auto p-3">
            {query.trim() && (
              <div className="mb-3">
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Members
                </p>
                {loading ? (
                  <p className="px-3 py-2 text-xs text-slate-400">Searching...</p>
                ) : results.length > 0 ? (
                  results.map((m) => (
                    <button
                      key={m._id}
                      onClick={() => handleSelect('/admin/team-members')}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {m.name}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            {m.designation || 'Team Member'} • {m.departmentId?.name || 'General'}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-xs text-slate-400">No members found matching &quot;{query}&quot;</p>
                )}
              </div>
            )}

            <div>
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Quick Navigation
              </p>
              <div className="space-y-0.5">
                {quickNav.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-left transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">Jump to page</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
