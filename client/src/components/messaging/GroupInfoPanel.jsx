import React, { useState } from 'react';
import { X, Crown, UserMinus, UserPlus, Edit2, Check, Users } from 'lucide-react';
import { useMessagingStore } from '../../stores/messagingStore';
import { useAuthStore } from '../../stores/authStore';

export const GroupInfoPanel = ({ conversation, onClose }) => {
  const { user } = useAuthStore();
  const { updateGroupInfo, addParticipant, removeParticipant } = useMessagingStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(conversation?.name || '');
  const [addUserId, setAddUserId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  if (!conversation) return null;

  const myParticipant = conversation.participants?.find(
    (p) => (p.userId?._id || p.userId)?.toString() === user?._id?.toString()
  );
  const isAdmin = myParticipant?.role === 'admin';

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    try {
      await updateGroupInfo(conversation._id, { name: newName.trim() });
      setIsEditingName(false);
    } catch (err) {
      setError(err.message || 'Failed to update name');
    }
  };

  const handleRemove = async (userId) => {
    try {
      await removeParticipant(conversation._id, userId);
    } catch (err) {
      setError(err.message || 'Failed to remove member');
    }
  };

  const handleAdd = async () => {
    if (!addUserId.trim()) return;
    setIsAdding(true);
    setError('');
    try {
      await addParticipant(conversation._id, addUserId.trim());
      setAddUserId('');
    } catch (err) {
      setError(err.message || 'Failed to add member');
    }
    setIsAdding(false);
  };

  return (
    <div className="w-72 flex flex-col bg-white border-l border-slate-100 h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
        <span className="text-sm font-bold text-slate-900">Group Info</span>
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Group Avatar + Name */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
            {(conversation.name || 'G').slice(0, 2).toUpperCase()}
          </div>

          {isEditingName && isAdmin ? (
            <div className="flex items-center gap-1.5 w-full max-w-[200px]">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 text-sm text-center px-2 py-1 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              />
              <button onClick={handleSaveName} className="p-1 rounded-lg bg-indigo-600 text-white">
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-900">{conversation.name}</span>
              {isAdmin && (
                <button
                  onClick={() => { setNewName(conversation.name); setIsEditingName(true); }}
                  className="p-1 rounded text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
          <p className="text-[11px] text-slate-500">{conversation.participants?.length} members</p>
        </div>

        {/* Members list */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Members</span>
          </div>
          <div className="space-y-1">
            {conversation.participants?.map((p) => {
              const pUserId = (p.userId?._id || p.userId)?.toString();
              const email = p.userId?.email || pUserId || '—';
              const name = email.split('@')[0];
              const isSelf = pUserId === user?._id?.toString();

              return (
                <div
                  key={pUserId}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{name} {isSelf && <span className="text-indigo-500">(you)</span>}</p>
                    {p.role === 'admin' && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-600 font-semibold">
                        <Crown className="w-2.5 h-2.5" /> Admin
                      </span>
                    )}
                  </div>
                  {isAdmin && !isSelf && (
                    <button
                      onClick={() => handleRemove(pUserId)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Remove member"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add member (admin only) */}
        {isAdmin && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <UserPlus className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Add Member</span>
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="User ID..."
                value={addUserId}
                onChange={(e) => setAddUserId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="flex-1 text-xs px-2.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-slate-400"
              />
              <button
                onClick={handleAdd}
                disabled={isAdding || !addUserId.trim()}
                className="px-3 py-2 bg-indigo-600 text-white text-xs rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-xs text-rose-500 bg-rose-50 px-3 py-2 rounded-xl">{error}</p>}
      </div>
    </div>
  );
};
