import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { X, Search, MessageSquare, Users, Loader2, UserCheck, ArrowRight } from 'lucide-react';
import { connectionApi } from '../../api/connectionApi';
import { useMessagingStore } from '../../stores/messagingStore';

export const NewDirectChatModal = ({ isOpen, onClose, onSelected }) => {
  const navigate = useNavigate();
  const { createDirectChat } = useMessagingStore();
  const [search, setSearch] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState('');

  // Fetch accepted connections
  const { data: connectionsData, isLoading } = useQuery({
    queryKey: ['my-connections-for-chat'],
    queryFn: async () => {
      const res = await connectionApi.getMyConnections({ limit: 100 });
      return res?.data || res;
    },
    enabled: isOpen
  });

  const rawList = Array.isArray(connectionsData)
    ? connectionsData
    : connectionsData?.connections || [];

  // Extract user objects
  const colleagues = rawList
    .map((c) => c.user || c.partner || c)
    .filter((u) => u && (u.userId || u._id));

  // Filter by search query
  const filtered = colleagues.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = (c.name || '').toLowerCase();
    const designation = (c.designation || '').toLowerCase();
    const dept = (c.department || '').toLowerCase();
    return name.includes(q) || designation.includes(q) || dept.includes(q);
  });

  const handleStartChat = async (targetUserId) => {
    if (!targetUserId || isStarting) return;
    setIsStarting(true);
    setError('');
    try {
      const conv = await createDirectChat(targetUserId);
      const convObj = conv?.data || conv;
      if (convObj?._id) {
        onSelected?.(convObj);
        handleClose();
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to start conversation');
    } finally {
      setIsStarting(false);
    }
  };

  const handleClose = () => {
    setSearch('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">New Direct Message</h2>
              <p className="text-[11px] text-slate-500">Choose a connected colleague to chat with</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search connected colleagues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-slate-400 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Colleagues List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <p className="text-xs">Loading connections...</p>
            </div>
          ) : colleagues.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">No active connections yet</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  You can only chat with colleagues you are connected with. Connect with team members in the Colleague Network first.
                </p>
              </div>
              <button
                onClick={() => {
                  handleClose();
                  navigate('/app/network');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <span>Explore Colleague Network</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              No colleagues match "{search}".
            </div>
          ) : (
            filtered.map((colleague) => {
              const targetId = colleague.userId || colleague._id;
              const avatar = colleague.avatarUrl;
              const name = colleague.name || colleague.email?.split('@')[0] || 'Colleague';
              const designation = colleague.designation || 'Team Member';
              const department = colleague.department || '';

              return (
                <button
                  key={targetId}
                  onClick={() => handleStartChat(targetId)}
                  disabled={isStarting}
                  className="w-full p-3 rounded-2xl hover:bg-purple-50/60 border border-transparent hover:border-purple-100 flex items-center justify-between transition-all group text-left cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 border border-purple-200">
                        {name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700 truncate transition-colors">
                        {name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{designation}</p>
                      {department && (
                        <p className="text-[10px] text-purple-600 font-medium truncate mt-0.5">
                          {department}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
