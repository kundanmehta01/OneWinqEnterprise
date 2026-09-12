import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Send, Paperclip, X, ArrowLeft, Users, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { useMessagingStore } from '../../stores/messagingStore';
import { useAuthStore } from '../../stores/authStore';
import { MessageBubble } from './MessageBubble';

const getConversationMeta = (conversation, currentUserId) => {
  if (!conversation) return { name: 'Chat', initials: 'C' };
  if (conversation.type === 'group') {
    return {
      name: conversation.name || 'Group Chat',
      avatar: conversation.avatarUrl || null,
      initials: (conversation.name || 'G').slice(0, 2).toUpperCase(),
      isGroup: true
    };
  }
  const other = conversation.participants?.find(
    (p) => (p.userId?._id || p.userId)?.toString() !== currentUserId?.toString()
  );
  const u = other?.userId;
  const name = u?.name || u?.email?.split('@')[0] || 'Colleague';
  const avatar = u?.avatarUrl || null;
  return { name, avatar, initials: name.slice(0, 2).toUpperCase(), isGroup: false };
};

export const ChatWindow = ({ conversation, onBack, onOpenGroupInfo, onNewDirect, onNewGroup }) => {
  const { user } = useAuthStore();
  const { messages, typingUsers, sendMessage, deleteMessage, setTyping, activeConversationId } = useMessagingStore();
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimerRef = useRef(null);

  const conversationId = conversation?._id;
  const msgs = messages[conversationId] || [];
  const typing = typingUsers[conversationId] || [];
  const meta = getConversationMeta(conversation, user?._id);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs.length]);

  // Handle typing indicator debounce
  const handleInputChange = (e) => {
    setInput(e.target.value);

    setTyping(conversationId, true);
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setTyping(conversationId, false);
    }, 1500);
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    if (f.type.startsWith('image/')) {
      setFilePreview(URL.createObjectURL(f));
    } else {
      setFilePreview(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if (!input.trim() && !file) return;
    if (isSending) return;

    setIsSending(true);
    clearTimeout(typingTimerRef.current);
    setTyping(conversationId, false);

    try {
      await sendMessage(conversationId, { content: input.trim(), file });
      setInput('');
      clearFile();
    } catch (_) {}
    setIsSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDelete = async (messageId) => {
    await deleteMessage(conversationId, messageId);
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 text-slate-400 p-8 text-center">
        <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 shadow-xs">
          <MessageSquare className="w-8 h-8" />
        </div>
        <p className="text-base font-bold text-slate-800">Your Messages</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Connect with colleagues across departments and start direct conversations or group discussions.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={onNewDirect}
            className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat with Colleague</span>
          </button>
          <button
            type="button"
            onClick={onNewGroup}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Users className="w-4 h-4 text-purple-600" />
            <span>New Group Chat</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] shrink-0">
        <button
          onClick={onBack}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Avatar */}
        {meta.avatar ? (
          <img
            src={meta.avatar}
            alt={meta.name}
            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
          />
        ) : (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${
              meta.isGroup
                ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                : 'bg-gradient-to-br from-indigo-500 to-purple-600'
            }`}
          >
            {meta.initials}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{meta.name}</p>
          {meta.isGroup && (
            <p className="text-[10px] text-slate-500">{conversation.participants?.length} members</p>
          )}
        </div>

        {meta.isGroup && (
          <button
            onClick={onOpenGroupInfo}
            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Group info"
          >
            <Users className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5 bg-gradient-to-b from-slate-50/30 to-white">
        {msgs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-16">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-3">
              <Send className="w-5 h-5 text-indigo-300" />
            </div>
            <p className="text-xs font-medium">Start the conversation</p>
            <p className="text-[11px] mt-0.5 opacity-70">Say hello 👋</p>
          </div>
        ) : (
          msgs.map((msg, idx) => {
            const prevMsg = msgs[idx - 1];
            const prevSender = prevMsg?.senderId?._id || prevMsg?.senderId;
            const currSender = msg.senderId?._id || msg.senderId;
            const isLastInGroup = prevSender?.toString() !== currSender?.toString();

            return (
              <MessageBubble
                key={msg._id}
                message={msg}
                onDelete={handleDelete}
                isLastInGroup={isLastInGroup}
              />
            );
          })
        )}

        {/* Typing indicator */}
        {typing.length > 0 && (
          <div className="flex items-center gap-2 py-1">
            <div className="flex gap-0.5 items-center px-3 py-2 bg-white rounded-2xl rounded-bl-md border border-slate-100 shadow-xs">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-[10px] text-slate-400">
              {typing.map((u) => u.name).join(', ')} {typing.length === 1 ? 'is' : 'are'} typing...
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* File preview bar */}
      {file && (
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center gap-2 shrink-0">
          {filePreview ? (
            <img src={filePreview} alt="preview" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center border border-slate-200">
              <ImageIcon className="w-5 h-5 text-indigo-400" />
            </div>
          )}
          <span className="text-xs text-slate-600 font-medium truncate flex-1">{file.name}</span>
          <button onClick={clearFile} className="p-1 rounded-full text-slate-400 hover:text-rose-500 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-slate-100 bg-white flex items-end gap-2 shrink-0">
        {/* File attach */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shrink-0 mb-0.5"
          title="Attach file"
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        />

        {/* Text input */}
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send)"
          rows={1}
          className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 resize-none leading-snug transition-all"
          style={{ maxHeight: '120px', overflowY: 'auto' }}
        />

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={isSending || (!input.trim() && !file)}
          className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 mb-0.5 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
