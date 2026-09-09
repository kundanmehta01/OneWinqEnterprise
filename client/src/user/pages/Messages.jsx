import React, { useState } from 'react';
import {
  Search,
  Edit3,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  Download,
  CheckCheck,
  User,
  Users,
  Share2,
  BellOff,
  Star,
  Ban,
  Flag,
  FileText,
  Boxes,
  Volume2,
  X,
  MessageSquare
} from 'lucide-react';

const INITIAL_CONVERSATIONS = [
  {
    id: 1,
    name: 'Rohan Sharma',
    role: 'Product Manager',
    company: 'Nexisparkx Technologies',
    location: 'Indore, MP',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face',
    status: 'Online',
    lastMessage: "Sure! Let's meet at 3 PM.",
    time: '11:24 AM',
    unread: 0,
    type: 'direct',
    starred: true,
    about: 'Product enthusiast | Building solutions for a smarter tomorrow.',
    tags: ['Product', 'Strategy', 'Collaboration'],
    messages: [
      { id: 1, sender: 'them', text: 'Hey Alisha! 👋', time: '11:20 AM' },
      { id: 2, sender: 'them', text: "Do you have the final version of the presentation for tomorrow's meeting?", time: '11:21 AM' },
      { id: 3, sender: 'me', text: "Hi Rohan!\nYes, I've just updated it. Let me share the file with you.", time: '11:22 AM' },
      {
        id: 4,
        sender: 'me',
        isAttachment: true,
        fileName: 'Product_Strategy_Deck.pdf',
        fileSize: '2.4 MB',
        time: '11:22 AM'
      },
      { id: 5, sender: 'them', text: 'Looks great! 👍\nCan we quickly discuss a few points before the meeting?', time: '11:23 AM' },
      { id: 6, sender: 'me', text: "Sure! Let's meet at 3 PM.", time: '11:24 AM' },
      { id: 7, sender: 'them', text: 'Perfect! See you then.', time: '11:24 AM' }
    ]
  },
  {
    id: 2,
    name: 'Engineering Team',
    role: 'Core Development Group',
    company: 'OneWinq Enterprise',
    location: 'Headquarters',
    avatar: null,
    icon: Users,
    status: 'Online',
    lastMessage: 'Priya: Please find the updated...',
    time: '10:15 AM',
    unread: 4,
    type: 'group',
    starred: false,
    about: 'Sprint coordination, releases, and architectural reviews.',
    tags: ['Engineering', 'Sprint', 'Tech'],
    messages: [
      { id: 1, sender: 'them', senderName: 'Priya', text: 'Please find the updated sprint roadmap for review.', time: '10:15 AM' }
    ]
  },
  {
    id: 3,
    name: 'Megha Jain',
    role: 'Senior Developer',
    company: 'Nexisparkx Technologies',
    location: 'Bangalore, India',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
    status: 'Away',
    lastMessage: 'Got it, thanks!',
    time: 'Yesterday',
    unread: 0,
    type: 'direct',
    starred: false,
    about: 'Full-stack enthusiast focused on robust backend pipelines.',
    tags: ['Dev', 'Backend', 'API'],
    messages: [
      { id: 1, sender: 'me', text: 'Hey Megha, shared the API swagger docs with you.', time: 'Yesterday' },
      { id: 2, sender: 'them', text: 'Got it, thanks!', time: 'Yesterday' }
    ]
  },
  {
    id: 4,
    name: 'Design Team',
    role: 'Product Design',
    company: 'OneWinq Enterprise',
    location: 'Design Studio',
    avatar: null,
    icon: Boxes,
    status: 'Offline',
    lastMessage: 'Aman: Sharing the Figma link...',
    time: 'Yesterday',
    unread: 0,
    type: 'group',
    starred: true,
    about: 'OneWinq Design System and enterprise UX standards.',
    tags: ['UI/UX', 'Design', 'Tokens'],
    messages: [
      { id: 1, sender: 'them', senderName: 'Aman', text: 'Sharing the Figma link for the mobile cards component.', time: 'Yesterday' }
    ]
  },
  {
    id: 5,
    name: 'Priya Singh',
    role: 'QA Engineer',
    company: 'Nexisparkx Technologies',
    location: 'Mumbai, India',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
    status: 'Online',
    lastMessage: "Let's sync tomorrow.",
    time: 'Mon',
    unread: 0,
    type: 'direct',
    starred: false,
    about: 'Test automation champion keeping bugs out of production.',
    tags: ['QA', 'Automation', 'Testing'],
    messages: [
      { id: 1, sender: 'them', text: "Let's sync tomorrow on the test coverage report.", time: 'Mon' }
    ]
  },
  {
    id: 6,
    name: 'HR Announcements',
    role: 'People Ops & Culture',
    company: 'OneWinq Enterprise',
    location: 'Global',
    avatar: null,
    icon: Volume2,
    status: 'Official Channel',
    lastMessage: 'New policy has been released...',
    time: 'Mon',
    unread: 2,
    type: 'group',
    starred: false,
    about: 'Official updates from People Operations and HR team.',
    tags: ['HR', 'Policy', 'Announcements'],
    messages: [
      { id: 1, sender: 'them', senderName: 'HR Team', text: 'New policy has been released regarding hybrid working guidelines.', time: 'Mon' }
    ]
  },
  {
    id: 7,
    name: 'Karan Malhotra',
    role: 'Lead Architect',
    company: 'OneWinq Enterprise',
    location: 'Indore, MP',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    status: 'Online',
    lastMessage: 'Can you review this?',
    time: 'Sun',
    unread: 0,
    type: 'direct',
    starred: false,
    about: 'Distributed systems architect & mentor.',
    tags: ['Architecture', 'Cloud', 'Scale'],
    messages: [
      { id: 1, sender: 'them', text: 'Can you review this pull request before merge?', time: 'Sun' }
    ]
  },
  {
    id: 8,
    name: 'Product Team',
    role: 'Product Management Group',
    company: 'OneWinq Enterprise',
    location: 'Indore, MP',
    avatar: null,
    icon: Boxes,
    status: 'Active',
    lastMessage: 'You: Thanks everyone!',
    time: 'Sun',
    unread: 0,
    type: 'group',
    starred: false,
    about: 'Enterprise digital card feature planning & roadmap.',
    tags: ['Roadmap', 'Strategy'],
    messages: [
      { id: 1, sender: 'me', text: 'Thanks everyone! Good demo today.', time: 'Sun' }
    ]
  },
  {
    id: 9,
    name: 'Neha Gupta',
    role: 'Frontend Engineer',
    company: 'Nexisparkx Technologies',
    location: 'Pune, India',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face',
    status: 'Offline',
    lastMessage: 'Will do!',
    time: 'Aug 28',
    unread: 0,
    type: 'direct',
    starred: false,
    about: 'Crafting pixel-perfect React & Tailwind experiences.',
    tags: ['React', 'CSS', 'UI'],
    messages: [
      { id: 1, sender: 'them', text: 'Will do! Will deploy to staging right away.', time: 'Aug 28' }
    ]
  },
  {
    id: 10,
    name: 'Aman Verma',
    role: 'UI Designer',
    company: 'Nexisparkx Technologies',
    location: 'Delhi, India',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
    status: 'Offline',
    lastMessage: "Let's connect.",
    time: 'Aug 27',
    unread: 0,
    type: 'direct',
    starred: false,
    about: 'Design systems, micro-interactions and iconography.',
    tags: ['Figma', 'UI', 'Illustration'],
    messages: [
      { id: 1, sender: 'them', text: "Let's connect over coffee when you visit Indore!", time: 'Aug 27' }
    ]
  }
];

export default function Messages() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState(1);
  const [filterTab, setFilterTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [showContactInfo, setShowContactInfo] = useState(true);
  const [muted, setMuted] = useState(false);

  const activeChat = conversations.find(c => c.id === activeChatId) || conversations[0];

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeChatId) {
          return {
            ...c,
            lastMessage: newMsg.text,
            time: newMsg.time,
            messages: [...(c.messages || []), newMsg]
          };
        }
        return c;
      })
    );
    setInputText('');
  };

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterTab === 'Unread') return c.unread > 0;
    if (filterTab === 'Groups') return c.type === 'group';
    if (filterTab === 'Starred') return c.starred;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Messages</h1>
          <p className="text-sm text-gray-500 mt-0.5">Connect, collaborate, and keep the conversation going.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-indigo-500 text-indigo-600 bg-white hover:bg-indigo-50/50 rounded-xl text-sm font-semibold transition-all shadow-sm">
          <Edit3 className="w-4 h-4 text-indigo-600" />
          <span>New Message</span>
        </button>
      </div>

      {/* Main 3-Column Chat UI */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-210px)] min-h-[640px]">
        {/* Left Column: Conversations List (4 cols) */}
        <div className="lg:col-span-4 border-r border-gray-100 flex flex-col h-full bg-white">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900">Conversations</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50/80 border border-gray-100 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {['All', 'Unread', 'Groups', 'Starred'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    filterTab === tab
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-gray-100/70 text-gray-600 hover:bg-gray-200/60'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filteredConversations.map(conv => {
              const isActive = conv.id === activeChatId;
              const IconComponent = conv.icon;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveChatId(conv.id)}
                  className={`flex items-start gap-3 p-3.5 cursor-pointer transition-all border-l-4 ${
                    isActive
                      ? 'bg-indigo-50/60 border-indigo-600'
                      : 'border-transparent hover:bg-gray-50/80'
                  }`}
                >
                  {/* Avatar / Icon */}
                  <div className="relative shrink-0">
                    {conv.avatar ? (
                      <img
                        src={conv.avatar}
                        alt={conv.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        {IconComponent ? <IconComponent className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                      </div>
                    )}
                    {conv.status === 'Online' && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className={`text-xs font-semibold truncate ${isActive ? 'text-indigo-950 font-bold' : 'text-gray-900'}`}>
                        {conv.name}
                      </p>
                      <span className="text-[10px] text-gray-400 shrink-0 font-medium">{conv.time}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-gray-500 truncate leading-relaxed">
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <span className="shrink-0 w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: Active Chat Thread */}
        <div className={`${showContactInfo ? 'lg:col-span-5' : 'lg:col-span-8'} flex flex-col h-full bg-[#FCFCFD]`}>
          {/* Active Chat Header */}
          <div className="p-3.5 px-5 bg-white border-b border-gray-100 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                {activeChat.avatar ? (
                  <img
                    src={activeChat.avatar}
                    alt={activeChat.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    {activeChat.icon ? <activeChat.icon className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                  </div>
                )}
                {activeChat.status === 'Online' && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900">{activeChat.name}</h3>
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    {activeChat.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate max-w-[240px]">
                  {activeChat.role} | {activeChat.company}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                className="w-8 h-8 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/60 flex items-center justify-center transition-colors"
                title="Voice Call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                className="w-8 h-8 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/60 flex items-center justify-center transition-colors"
                title="Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowContactInfo(!showContactInfo)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  showContactInfo ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title="Toggle Contact Info"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {/* Center Date Badge */}
            <div className="flex justify-center my-2">
              <span className="px-3 py-1 bg-gray-200/70 text-gray-600 text-[11px] font-semibold rounded-full">
                Today
              </span>
            </div>

            {activeChat.messages && activeChat.messages.map(msg => {
              const isMe = msg.sender === 'me';
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <div className="shrink-0 mb-1">
                      {activeChat.avatar ? (
                        <img
                          src={activeChat.avatar}
                          alt={activeChat.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">
                          {activeChat.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="max-w-[78%] space-y-1">
                    {/* Message Bubble */}
                    {msg.isAttachment ? (
                      <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl rounded-br-sm p-3 shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 pr-2">
                            <p className="text-xs font-semibold text-gray-900 truncate">{msg.fileName}</p>
                            <p className="text-[10px] text-gray-500">{msg.fileSize}</p>
                          </div>
                          <button className="w-7 h-7 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 flex items-center justify-center transition-colors">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-indigo-400">
                          <span>{msg.time}</span>
                          <CheckCheck className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`p-3 text-xs leading-relaxed shadow-xs rounded-2xl ${
                          isMe
                            ? 'bg-indigo-50/90 text-indigo-950 border border-indigo-100/80 rounded-br-sm'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-indigo-400' : 'text-gray-400'}`}>
                          <span>{msg.time}</span>
                          {isMe && <CheckCheck className="w-3.5 h-3.5 text-indigo-600" />}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Message Input Bar */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="Attach File"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  title="Insert Emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>

              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all shadow-sm ${
                  inputText.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                    : 'bg-indigo-300 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4 translate-x-0.5 -translate-y-0.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Contact Info Drawer */}
        {showContactInfo && (
          <div className="lg:col-span-3 border-l border-gray-100 p-5 overflow-y-auto bg-white flex flex-col space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Contact Info</h3>
              <button
                onClick={() => setShowContactInfo(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-2">
                {activeChat.avatar ? (
                  <img
                    src={activeChat.avatar}
                    alt={activeChat.name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-50"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold">
                    {activeChat.name.charAt(0)}
                  </div>
                )}
                {activeChat.status === 'Online' && (
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <h4 className="text-base font-bold text-gray-900">{activeChat.name}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{activeChat.role}</p>
              <p className="text-xs text-indigo-600 font-medium">{activeChat.company}</p>
              <p className="text-[11px] text-gray-400 mt-1">{activeChat.location}</p>
            </div>

            {/* Quick Circular Action Buttons */}
            <div className="grid grid-cols-4 gap-2 pt-1 border-t border-gray-100">
              <button className="flex flex-col items-center gap-1 group">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-gray-600 font-medium">Message</span>
              </button>
              <button className="flex flex-col items-center gap-1 group">
                <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-gray-600 font-medium">Call</span>
              </button>
              <button className="flex flex-col items-center gap-1 group">
                <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Video className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-gray-600 font-medium">Video</span>
              </button>
              <button className="flex flex-col items-center gap-1 group">
                <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-gray-600 font-medium">More</span>
              </button>
            </div>

            {/* About Section */}
            <div>
              <h5 className="text-xs font-bold text-gray-900 mb-1.5">About</h5>
              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/80 p-2.5 rounded-xl">
                {activeChat.about || 'Enterprise member at OneWinq.'}
              </p>
            </div>

            {/* Tags */}
            <div>
              <h5 className="text-xs font-bold text-gray-900 mb-1.5">Tags</h5>
              <div className="flex flex-wrap gap-1.5">
                {(activeChat.tags || ['Enterprise', 'Team']).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-semibold rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Options List */}
            <div className="space-y-1 pt-2 border-t border-gray-100 text-xs text-gray-700">
              <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <User className="w-4 h-4 text-indigo-600" />
                <span>View Profile</span>
              </button>
              <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Start a Group Chat</span>
              </button>
              <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <Share2 className="w-4 h-4 text-indigo-600" />
                <span>Share Contact</span>
              </button>

              <div className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <BellOff className="w-4 h-4 text-gray-500" />
                  <span>Mute Notifications</span>
                </div>
                <button
                  onClick={() => setMuted(!muted)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    muted ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      muted ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Star Conversation</span>
              </button>
              <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors text-left">
                <Ban className="w-4 h-4 text-rose-600" />
                <span>Block User</span>
              </button>
              <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors text-left">
                <Flag className="w-4 h-4 text-rose-600" />
                <span>Report</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
