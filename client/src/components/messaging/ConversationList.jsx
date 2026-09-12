import React, { useMemo } from 'react';
import { Search, Plus, MessageSquare } from 'lucide-react';
import { useMessagingStore } from '../../stores/messagingStore';
import { useAuthStore } from '../../stores/authStore';

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diff < 604800000) return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const getConversationMeta = (conversation, currentUserId) => {
  if (conversation.type === 'group') {
    return {
      name: conversation.name || 'Group Chat',
      avatar: conversation.avatarUrl || null,
      initials: (conversation.name || 'G').slice(0, 2).toUpperCase()
    };
  }
  // Direct: find the other participant
  const other = conversation.participants?.find(
    (p) => (p.userId?._id || p.userId)?.toString() !== currentUserId?.toString()
  );
  const u = other?.userId;
  const name = u?.name || u?.email?.split('@')[0] || 'Colleague';
  const avatar = u?.avatarUrl || null;
  return {
    name,
    avatar,
    initials: name.slice(0, 2).toUpperCase()
  };
};

export const ConversationList = ({ searchQuery, onSearchChange, onNewGroup, onNewDirect }) => {
  const { conversations, activeConversationId, unreadCounts, openConversation } = useMessagingStore();
  const { user } = useAuthStore();

  const filtered = useMemo(() => {
    if (!searchQuery?.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((c) => {
      const meta = getConversationMeta(c, user?._id);
      return meta.name.toLowerCase().includes(q);
    });
  }, [conversations, searchQuery, user?._id]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">Messages</h2>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onNewDirect}
              title="Start 1:1 Chat with Connected Colleague"
              className="px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
            <button
              onClick={onNewGroup}
              title="Create Group Chat"
              className="p-1.5 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 shadow-xs">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800">No conversations yet</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
              Chat with connected colleagues or create a group discussion.
            </p>
            <div className="flex flex-col gap-2 w-full mt-4">
              <button
                type="button"
                onClick={onNewDirect}
                className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Start Direct Chat</span>
              </button>
              <button
                type="button"
                onClick={onNewGroup}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Group Chat</span>
              </button>
            </div>
          </div>
        ) : (
          filtered.map((conv) => {
            const meta = getConversationMeta(conv, user?._id);
            const unread = unreadCounts[conv._id] || 0;
            const isActive = conv._id === activeConversationId;
            const lastMsg = conv.lastMessage;

            return (
              <button
                key={conv._id}
                onClick={() => openConversation(conv._id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left border-b border-slate-50 ${
                  isActive
                    ? 'bg-indigo-50/80 border-l-2 border-l-indigo-500'
                    : 'hover:bg-slate-50 border-l-2 border-l-transparent'
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  {meta.avatar ? (
                    <img src={meta.avatar} alt={meta.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                        conv.type === 'group'
                          ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                          : 'bg-gradient-to-br from-indigo-400 to-blue-500 text-white'
                      }`}
                    >
                      {meta.initials}
                    </div>
                  )}
                  {conv.type === 'group' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-[7px] text-white font-bold">{conv.participants?.length}</span>
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-xs font-semibold truncate ${isActive ? 'text-indigo-700' : 'text-slate-800'}`}>
                      {meta.name}
                    </span>
                    {lastMsg?.sentAt && (
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">{formatTime(lastMsg.sentAt)}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-slate-500 truncate">
                      {lastMsg?.content || 'No messages yet'}
                    </p>
                    {unread > 0 && (
                      <span className="ml-1.5 min-w-[18px] h-[18px] rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center px-1 shrink-0">
                        {unread > 9 ? '9+' : unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
