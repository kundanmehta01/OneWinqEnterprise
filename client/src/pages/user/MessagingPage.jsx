import React, { useEffect, useState } from 'react';
import { useMessagingStore } from '../../stores/messagingStore';
import { useAuthStore } from '../../stores/authStore';
import { ConversationList } from '../../components/messaging/ConversationList';
import { ChatWindow } from '../../components/messaging/ChatWindow';
import { GroupInfoPanel } from '../../components/messaging/GroupInfoPanel';
import { GroupCreateModal } from '../../components/messaging/GroupCreateModal';
import { NewDirectChatModal } from '../../components/messaging/NewDirectChatModal';

export const MessagingPage = () => {
  const { user, accessToken } = useAuthStore();
  const {
    conversations,
    activeConversationId,
    connectSocket,
    disconnectSocket,
    fetchConversations,
    fetchFolders,
    openConversation,
    closeConversation,
    isLoadingConversations
  } = useMessagingStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showNewDirect, setShowNewDirect] = useState(false);

  // Initialize socket and load conversations
  useEffect(() => {
    if (accessToken) {
      connectSocket(accessToken);
    }
    fetchConversations();
    fetchFolders();

    return () => {
      disconnectSocket();
    };
  }, [accessToken]);

  const activeConversation = conversations.find((c) => c._id === activeConversationId) || null;

  // Responsive: on mobile show either list or chat
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat'

  const handleOpenConversation = (id) => {
    openConversation(id);
    setMobileView('chat');
    setShowGroupInfo(false);
  };

  const handleBack = () => {
    setMobileView('list');
    setShowGroupInfo(false);
    closeConversation();
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Page title bar */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-gradient-to-r from-white to-slate-50/50">
        <div>
          <h1 className="text-base font-bold text-slate-900">Messages</h1>
          <p className="text-xs text-slate-500 mt-0.5">Chat with colleagues and groups in your organization</p>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 min-h-0">
        {/* Conversation List — always visible on desktop, conditional on mobile */}
        <div
          className={`${
            mobileView === 'list' ? 'flex' : 'hidden'
          } lg:flex flex-col w-full lg:w-72 xl:w-80 border-r border-slate-100 shrink-0`}
        >
          {isLoadingConversations ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
            </div>
          ) : (
            <ConversationList
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onNewGroup={() => setShowGroupModal(true)}
              onNewDirect={() => setShowNewDirect(true)}
              onOpen={handleOpenConversation}
            />
          )}
        </div>

        {/* Chat area */}
        <div
          className={`${
            mobileView === 'chat' ? 'flex' : 'hidden'
          } lg:flex flex-1 min-w-0`}
        >
          <ChatWindow
            conversation={activeConversation}
            onBack={handleBack}
            onOpenGroupInfo={() => setShowGroupInfo((v) => !v)}
            onNewDirect={() => setShowNewDirect(true)}
            onNewGroup={() => setShowGroupModal(true)}
          />
        </div>

        {/* Group Info Panel */}
        {showGroupInfo && activeConversation?.type === 'group' && (
          <GroupInfoPanel
            conversation={activeConversation}
            onClose={() => setShowGroupInfo(false)}
          />
        )}
      </div>

      {/* Direct Chat Modal */}
      <NewDirectChatModal
        isOpen={showNewDirect}
        onClose={() => setShowNewDirect(false)}
        onSelected={(conv) => {
          handleOpenConversation(conv._id);
        }}
      />

      {/* Group Create Modal */}
      <GroupCreateModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        onCreated={(conv) => {
          handleOpenConversation(conv._id);
        }}
      />
    </div>
  );
};

export default MessagingPage;
