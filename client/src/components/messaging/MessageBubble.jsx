import React from 'react';
import { Check, CheckCheck, Trash2, FileText, Image } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const MessageBubble = ({ message, onDelete, isLastInGroup }) => {
  const { user } = useAuthStore();
  const isMine = message.senderId?._id === user?._id || message.senderId === user?._id;

  if (message.isDeleted) {
    return (
      <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1`}>
        <div className="px-3.5 py-2 rounded-2xl text-xs text-slate-400 italic bg-slate-100 border border-slate-200 max-w-xs">
          This message was deleted
        </div>
      </div>
    );
  }

  const senderName = message.senderId?.email?.split('@')[0] || 'Unknown';

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1 group`}>
      <div className={`flex flex-col max-w-[72%] ${isMine ? 'items-end' : 'items-start'}`}>
        {/* Sender label (shown in groups, for others' messages) */}
        {!isMine && isLastInGroup && (
          <span className="text-[10px] text-slate-400 font-medium mb-0.5 px-1">{senderName}</span>
        )}

        <div className="relative flex items-end gap-1.5">
          {/* Delete button (own messages only) */}
          {isMine && (
            <button
              onClick={() => onDelete?.(message._id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 mb-1 shrink-0"
              title="Delete message"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}

          {/* Bubble */}
          <div
            className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
              isMine
                ? 'bg-indigo-600 text-white rounded-br-md shadow-sm'
                : 'bg-white text-slate-800 border border-slate-100 rounded-bl-md shadow-xs'
            }`}
          >
            {/* Attachments */}
            {message.attachments?.length > 0 && (
              <div className="mb-1.5 space-y-1.5">
                {message.attachments.map((att, idx) => {
                  const isImage = att.mimeType?.startsWith('image/');
                  if (isImage) {
                    return (
                      <a key={idx} href={att.url} target="_blank" rel="noreferrer">
                        <img
                          src={att.url}
                          alt={att.originalName}
                          className="max-w-full rounded-xl max-h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </a>
                    );
                  }
                  return (
                    <a
                      key={idx}
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
                        isMine ? 'bg-indigo-500/50 text-white' : 'bg-slate-50 text-slate-700 border border-slate-200'
                      } hover:opacity-80 transition-opacity`}
                    >
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="truncate max-w-[180px]">{att.originalName}</span>
                    </a>
                  );
                })}
              </div>
            )}

            {/* Text content */}
            {message.content && <span>{message.content}</span>}
          </div>
        </div>

        {/* Timestamp + read indicator */}
        <div className={`flex items-center gap-1 mt-0.5 px-1 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] text-slate-400">{formatTime(message.createdAt)}</span>
          {isMine && (
            <span className="text-[10px] text-slate-400">
              {message.readBy?.length > 0 ? (
                <CheckCheck className="w-3 h-3 text-indigo-400 inline" />
              ) : (
                <Check className="w-3 h-3 inline" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
