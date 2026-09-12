import React, { useState, useEffect } from 'react';
import { X, Users, Search, Check, Loader2, UserCheck } from 'lucide-react';
import { useMessagingStore } from '../../stores/messagingStore';
import { connectionApi } from '../../api/connectionApi';

export const GroupCreateModal = ({ isOpen, onClose, onCreated }) => {
  const { createGroupChat } = useMessagingStore();
  const [step, setStep] = useState('name'); // 'name' | 'members'
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedColleagues, setConnectedColleagues] = useState([]);
  const [directoryResults, setDirectoryResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoadingColleagues, setIsLoadingColleagues] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  // Load connected colleagues when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const loadConnections = async () => {
      setIsLoadingColleagues(true);
      try {
        const res = await connectionApi.getMyConnections({ limit: 100 });
        const list = Array.isArray(res) ? res : res?.connections || res?.data || [];
        const users = list
          .map((c) => c.user || c.partner || c)
          .filter((u) => u && (u.userId || u._id));
        setConnectedColleagues(users);
      } catch (_) {
        setConnectedColleagues([]);
      } finally {
        setIsLoadingColleagues(false);
      }
    };
    loadConnections();
  }, [isOpen]);

  // Search enterprise directory if query typed
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDirectoryResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await connectionApi.getPeople({ search: searchQuery.trim(), limit: 15 });
        const people = Array.isArray(res) ? res : res?.people || res?.data || [];
        setDirectoryResults(people);
      } catch (_) {
        setDirectoryResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleUser = (userObj) => {
    const id = (userObj.userId || userObj._id)?.toString();
    setSelectedUsers((prev) =>
      prev.some((u) => (u.userId || u._id)?.toString() === id)
        ? prev.filter((u) => (u.userId || u._id)?.toString() !== id)
        : [...prev, userObj]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }
    if (selectedUsers.length === 0) {
      setError('Add at least one member to the group');
      return;
    }

    setIsCreating(true);
    setError('');
    try {
      const participantIds = selectedUsers.map((u) => u.userId || u._id);
      const conv = await createGroupChat({
        name: groupName.trim(),
        description: description.trim(),
        participantIds
      });
      const convObj = conv?.data || conv;
      if (convObj?._id) {
        onCreated?.(convObj);
        handleClose();
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to create group');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setStep('name');
    setGroupName('');
    setDescription('');
    setSearchQuery('');
    setDirectoryResults([]);
    setSelectedUsers([]);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  // Determine which user list to show in step 2
  const displayedUsers = searchQuery.trim()
    ? [
        // Connected colleagues matching query
        ...connectedColleagues.filter((c) => {
          const q = searchQuery.toLowerCase();
          const name = (c.name || '').toLowerCase();
          const dept = (c.department || '').toLowerCase();
          return name.includes(q) || dept.includes(q);
        }),
        // Plus other directory results not already included
        ...directoryResults.filter(
          (d) => !connectedColleagues.some((c) => (c.userId || c._id)?.toString() === (d.userId || d._id)?.toString())
        )
      ]
    : connectedColleagues;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Create Group Chat</h2>
              <p className="text-[11px] text-slate-500">
                {step === 'name' ? 'Step 1: Group Details' : `Step 2: Add Members (${selectedUsers.length} selected)`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          {step === 'name' ? (
            /* Step 1: Group name & description */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Group Name *</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Frontend Team, Product Discussion"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-slate-400"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && groupName.trim() && setStep('members')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description <span className="font-normal text-slate-400">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this group for?"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-slate-400"
                />
              </div>

              {error && <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl">{error}</p>}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (groupName.trim()) {
                      setError('');
                      setStep('members');
                    } else {
                      setError('Group name is required');
                    }
                  }}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Next: Select Members →
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: Select Members */
            <div className="space-y-4">
              {/* Selected chips */}
              {selectedUsers.length > 0 && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                    Selected Members ({selectedUsers.length})
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                    {selectedUsers.map((u) => {
                      const id = (u.userId || u._id)?.toString();
                      const name = u.name || u.email?.split('@')[0] || 'Member';
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-xl text-xs font-semibold"
                        >
                          <span>{name}</span>
                          <button
                            type="button"
                            onClick={() => toggleUser(u)}
                            className="hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search connected colleagues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-slate-400"
                  autoFocus
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-purple-600 animate-spin" />
                )}
              </div>

              {/* Members List */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden max-h-52 overflow-y-auto divide-y divide-slate-50">
                {isLoadingColleagues ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                    <p className="text-xs">Loading colleagues...</p>
                  </div>
                ) : displayedUsers.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-400 px-4">
                    {searchQuery.trim()
                      ? `No team members found matching "${searchQuery}".`
                      : 'No connected colleagues found yet. Connect with colleagues first.'}
                  </div>
                ) : (
                  displayedUsers.map((u) => {
                    const id = (u.userId || u._id)?.toString();
                    const name = u.name || u.email?.split('@')[0] || 'Colleague';
                    const designation = u.designation || 'Team Member';
                    const department = u.department || u.departmentId?.name || '';
                    const avatar = u.avatarUrl;
                    const isSelected = selectedUsers.some(
                      (s) => (s.userId || s._id)?.toString() === id
                    );

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleUser(u)}
                        className={`w-full flex items-center justify-between p-2.5 text-left transition-all cursor-pointer ${
                          isSelected ? 'bg-purple-50/70' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={name}
                              className="w-8 h-8 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0">
                              {name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{name}</p>
                            <p className="text-[11px] text-slate-500 truncate">{designation}</p>
                            {department && (
                              <p className="text-[10px] text-purple-600 font-medium truncate">
                                {department}
                              </p>
                            )}
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 ml-2 ${
                            isSelected
                              ? 'bg-purple-600 border-purple-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {error && <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl">{error}</p>}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('name')}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isCreating || selectedUsers.length === 0}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Create Group ({selectedUsers.length})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
