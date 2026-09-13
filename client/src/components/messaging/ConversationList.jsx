import React, { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  MessageSquare,
  Folder,
  FolderPlus,
  ChevronDown,
  ChevronRight,
  UserPlus,
  Trash2,
  Edit2,
  Users,
  X,
  Sparkles,
  Check
} from 'lucide-react';
import { useMessagingStore } from '../../stores/messagingStore';
import { useAuthStore } from '../../stores/authStore';
import { FolderManageModal } from './FolderManageModal';

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
    initials: name.slice(0, 2).toUpperCase(),
    otherUserId: (u?._id || u)?.toString()
  };
};

export const ConversationList = ({ searchQuery, onSearchChange, onNewGroup, onNewDirect, onOpen }) => {
  const {
    conversations,
    activeConversationId,
    unreadCounts,
    openConversation,
    createDirectChat,
    folders,
    deleteFolder,
    removeFolderMember
  } = useMessagingStore();
  const { user } = useAuthStore();

  // Active view tab: 'chats' or 'folders'
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' | 'folders'

  // Sub-filter under 'chats' tab: 'all' | 'direct' | 'group' | folder._id
  const [chatFilter, setChatFilter] = useState('all');

  // Expanded folders in the 'folders' tab: { [folderId]: boolean }
  const [expandedFolders, setExpandedFolders] = useState({});

  // Folder modal state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState(null);

  // Toggle folder expansion
  const toggleFolderExpand = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: prev[folderId] === undefined ? false : !prev[folderId]
    }));
  };

  const handleOpenFolderModal = (folder = null) => {
    setFolderToEdit(folder);
    setIsFolderModalOpen(true);
  };

  const handleDeleteFolder = async (e, folderId, folderName) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete folder "${folderName}"?`)) {
      try {
        await deleteFolder(folderId);
      } catch (err) {
        console.error('Failed to delete folder', err);
      }
    }
  };

  const handleRemoveMember = async (e, folderId, memberId) => {
    e.stopPropagation();
    try {
      await removeFolderMember(folderId, memberId);
    } catch (err) {
      console.error('Failed to remove member', err);
    }
  };

  // Start or open a direct chat with a member from a folder
  const handleChatWithMember = async (memberId) => {
    if (!memberId) return;
    try {
      const conv = await createDirectChat(memberId);
      const convObj = conv?.data || conv;
      if (convObj?._id) {
        if (onOpen) onOpen(convObj._id);
        else openConversation(convObj._id);
      }
    } catch (err) {
      console.error('Failed to start chat with member', err);
    }
  };

  // Filter conversations according to search and selected chat filter
  const filteredConversations = useMemo(() => {
    let list = conversations;

    // Filter by type or folder
    if (chatFilter === 'direct') {
      list = list.filter((c) => c.type === 'direct');
    } else if (chatFilter === 'group') {
      list = list.filter((c) => c.type === 'group');
    } else if (chatFilter !== 'all') {
      // Chat filter is a folder ID
      const targetFolder = folders.find((f) => f._id === chatFilter);
      if (targetFolder) {
        const memberIds = new Set(
          (targetFolder.members || []).map((m) => (m._id || m).toString())
        );
        list = list.filter((c) => {
          if (c.type !== 'direct') return false;
          const other = c.participants?.find(
            (p) => (p.userId?._id || p.userId)?.toString() !== user?._id?.toString()
          );
          const otherId = (other?.userId?._id || other?.userId)?.toString();
          return memberIds.has(otherId);
        });
      }
    }

    if (!searchQuery?.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((c) => {
      const meta = getConversationMeta(c, user?._id);
      return meta.name.toLowerCase().includes(q);
    });
  }, [conversations, chatFilter, folders, searchQuery, user?._id]);

  // Filter folders according to search query in 'folders' tab
  const filteredFolders = useMemo(() => {
    if (!searchQuery?.trim()) return folders;
    const q = searchQuery.toLowerCase();
    return folders.filter((f) => {
      const nameMatch = (f.name || '').toLowerCase().includes(q);
      const memberMatch = (f.members || []).some(
        (m) =>
          (m.name || '').toLowerCase().includes(q) ||
          (m.designation || '').toLowerCase().includes(q)
      );
      return nameMatch || memberMatch;
    });
  }, [folders, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header & View Switcher */}
      <div className="px-4 pt-4 pb-2 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('chats')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'chats'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chats
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('folders')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'folders'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Folders</span>
              {folders.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-700 font-semibold">
                  {folders.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleOpenFolderModal(null)}
              title="Create Custom Contact Folder (e.g. Senior)"
              className="p-1.5 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
            <button
              onClick={onNewDirect}
              title="Start 1:1 Chat with Connected Colleague"
              className="p-1.5 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
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

        {/* Search Input */}
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'chats' ? 'Search conversations...' : 'Search folders or members...'}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all"
          />
        </div>

        {/* Quick Filter Pills in 'Chats' Tab */}
        {activeTab === 'chats' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
            <button
              type="button"
              onClick={() => setChatFilter('all')}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold shrink-0 transition-all cursor-pointer ${
                chatFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setChatFilter('direct')}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold shrink-0 transition-all cursor-pointer ${
                chatFilter === 'direct'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Direct
            </button>
            <button
              type="button"
              onClick={() => setChatFilter('group')}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold shrink-0 transition-all cursor-pointer ${
                chatFilter === 'group'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Groups
            </button>

            {/* Custom Folder Pills */}
            {folders.map((f) => {
              const isSelected = chatFilter === f._id;
              return (
                <button
                  key={f._id}
                  type="button"
                  onClick={() => setChatFilter(isSelected ? 'all' : f._id)}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold shrink-0 flex items-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  style={isSelected ? { backgroundColor: f.color || '#8b5cf6' } : {}}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: isSelected ? '#ffffff' : f.color || '#8b5cf6' }}
                  />
                  <span>{f.name}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handleOpenFolderModal(null)}
              className="px-2 py-0.5 rounded-lg text-[11px] font-semibold shrink-0 text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors flex items-center gap-0.5 cursor-pointer"
              title="Add custom folder"
            >
              <Plus className="w-3 h-3" />
              <span>Folder</span>
            </button>
          </div>
        )}
      </div>

      {/* ── View 1: Chats Tab ────────────────────────────────────── */}
      {activeTab === 'chats' && (
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 shadow-xs">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                {chatFilter !== 'all' ? 'No matching conversations' : 'No conversations yet'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                {chatFilter !== 'all'
                  ? 'Switch back to all chats or start a message with a colleague.'
                  : 'Chat with connected colleagues or create a group discussion.'}
              </p>
              <div className="flex flex-col gap-2 w-full mt-4">
                {chatFilter !== 'all' ? (
                  <button
                    type="button"
                    onClick={() => setChatFilter('all')}
                    className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    View All Chats
                  </button>
                ) : (
                  <>
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
                      onClick={() => setActiveTab('folders')}
                      className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Folder className="w-3.5 h-3.5 text-purple-600" />
                      <span>View Custom Folders</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const meta = getConversationMeta(conv, user?._id);
              const unread = unreadCounts[conv._id] || 0;
              const isActive = conv._id === activeConversationId;
              const lastMsg = conv.lastMessage;

              // Check if participant is in any user folders
              const memberFolderTags = conv.type === 'direct' && meta.otherUserId
                ? folders.filter((f) =>
                    (f.members || []).some((m) => (m._id || m).toString() === meta.otherUserId)
                  )
                : [];

              return (
                <button
                  key={conv._id}
                  onClick={() => (onOpen ? onOpen(conv._id) : openConversation(conv._id))}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left border-b border-slate-50 ${
                    isActive
                      ? 'bg-purple-50/70 border-l-3 border-l-purple-600'
                      : 'hover:bg-slate-50 border-l-3 border-l-transparent'
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
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`text-xs font-semibold truncate ${isActive ? 'text-purple-700 font-bold' : 'text-slate-800'}`}>
                          {meta.name}
                        </span>
                        {/* Folder tags */}
                        {memberFolderTags.length > 0 && (
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.2 rounded-md text-white shrink-0"
                            style={{ backgroundColor: memberFolderTags[0].color || '#8b5cf6' }}
                            title={`In folder: ${memberFolderTags.map((f) => f.name).join(', ')}`}
                          >
                            {memberFolderTags[0].name}
                          </span>
                        )}
                      </div>
                      {lastMsg?.sentAt && (
                        <span className="text-[10px] text-slate-400 shrink-0 ml-1">{formatTime(lastMsg.sentAt)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-slate-500 truncate">
                        {lastMsg?.content || 'No messages yet'}
                      </p>
                      {unread > 0 && (
                        <span className="ml-1.5 min-w-[18px] h-[18px] rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center px-1 shrink-0">
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
      )}

      {/* ── View 2: Folders Tab ──────────────────────────────────── */}
      {activeTab === 'folders' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {filteredFolders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 shadow-xs">
                <Folder className="w-6 h-6 fill-purple-100" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                {searchQuery ? 'No folders match search' : 'No custom folders yet'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                Organize your connected colleagues (like "Senior", "Leads", or "Managers") so you can message them with one click without searching.
              </p>
              <button
                type="button"
                onClick={() => handleOpenFolderModal(null)}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Create "Senior" Folder</span>
              </button>
            </div>
          ) : (
            filteredFolders.map((f) => {
              const isExpanded = expandedFolders[f._id] !== false; // expanded by default
              const memberCount = (f.members || []).length;

              return (
                <div
                  key={f._id}
                  className="rounded-2xl border border-slate-100 bg-white shadow-2xs overflow-hidden transition-all hover:border-slate-200"
                >
                  {/* Folder Header */}
                  <div
                    onClick={() => toggleFolderExpand(f._id)}
                    className="flex items-center justify-between p-3 cursor-pointer bg-gradient-to-r from-slate-50/70 to-white hover:bg-slate-50 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                        style={{ backgroundColor: f.color || '#8b5cf6' }}
                      >
                        <Folder className="w-3.5 h-3.5 fill-white/20" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 truncate">{f.name}</span>
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-full">
                            {memberCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleOpenFolderModal(f)}
                        title="Edit folder or manage members"
                        className="p-1 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteFolder(e, f._id, f.name)}
                        title="Delete folder"
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFolderExpand(f._id)}
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Folder Members */}
                  {isExpanded && (
                    <div className="p-2 border-t border-slate-50 space-y-1 bg-slate-50/20">
                      {memberCount === 0 ? (
                        <div className="py-4 text-center px-3">
                          <p className="text-[11px] text-slate-400">No members in this folder yet.</p>
                          <button
                            type="button"
                            onClick={() => handleOpenFolderModal(f)}
                            className="mt-2 text-xs font-semibold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>Add Colleagues</span>
                          </button>
                        </div>
                      ) : (
                        f.members.map((member) => {
                          const mId = (member._id || member).toString();
                          const avatar = member.avatarUrl;
                          const name = member.name || member.email?.split('@')[0] || 'Colleague';
                          const designation = member.designation || 'Team Member';
                          const dept = member.department || '';

                          return (
                            <div
                              key={mId}
                              onClick={() => handleChatWithMember(mId)}
                              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-purple-50/80 transition-all group cursor-pointer border border-transparent hover:border-purple-100"
                              title={`Click to chat with ${name}`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {avatar ? (
                                  <img
                                    src={avatar}
                                    alt={name}
                                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-purple-700 font-bold text-[11px] flex items-center justify-center shrink-0 border border-purple-200">
                                    {name.substring(0, 2).toUpperCase()}
                                  </div>
                                )}
                                <div className="min-w-0 text-left">
                                  <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700 truncate transition-colors">
                                    {name}
                                  </p>
                                  <p className="text-[10px] text-slate-500 truncate">
                                    {designation}
                                    {dept && ` • ${dept}`}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 group-hover:bg-purple-600 group-hover:text-white px-2 py-0.5 rounded-lg transition-all flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  <span>Chat</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => handleRemoveMember(e, f._id, mId)}
                                  title={`Remove ${name} from folder`}
                                  className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}

                      {/* Add more button at bottom of folder card */}
                      {memberCount > 0 && (
                        <button
                          type="button"
                          onClick={() => handleOpenFolderModal(f)}
                          className="w-full py-1.5 px-2 mt-1 rounded-xl text-[11px] font-medium text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors flex items-center justify-center gap-1 cursor-pointer border border-dashed border-slate-200"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>Add more colleagues to {f.name}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Folder Manage Modal */}
      <FolderManageModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        folder={folderToEdit}
      />
    </div>
  );
};

export default ConversationList;
