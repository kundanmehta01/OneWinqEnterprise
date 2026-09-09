import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Plus,
  Send,
  CheckCircle2,
  FileQuestion,
  LifeBuoy,
  Mail,
  X
} from 'lucide-react';
import { supportService } from '../services/supportService';

const FAQS = [
  {
    category: 'Digital Identity Card',
    items: [
      {
        q: 'How does my OneWinq Digital NFC Card work?',
        a: 'Your OneWinq Digital Card contains an encrypted link to your verified corporate profile. Anyone scanning the QR code or tapping their NFC smartphone will instantly view your digital profile and save your contact to their device.'
      },
      {
        q: 'Can I change my Employee ID or Department on my card?',
        a: 'Official enterprise attributes such as your Employee ID, Department, and Designation are synchronized with your organization directory and managed by your HR Administrator. To request an update, submit an internal support ticket.'
      },
      {
        q: 'How do I download my contact vCard (.vcf)?',
        a: 'Go to the "Digital Card" page and click "Download Contact (.vcf)". You can also send the card link directly via Email or WhatsApp.'
      }
    ]
  },
  {
    category: 'Colleague Networking & Events',
    items: [
      {
        q: 'How do I register for an enterprise event?',
        a: 'Navigate to the "Events" page, find any upcoming webinar or workshop, and click "Register". You will receive a confirmation notification in your Notifications tab.'
      },
      {
        q: 'Who can see my connection requests?',
        a: 'Only the colleague you sent the request to will see it under their Network > Pending Requests tab and in their Notifications.'
      }
    ]
  },
  {
    category: 'Security & Privacy',
    items: [
      {
        q: 'Can I hide my phone number from my public card?',
        a: 'Yes. Navigate to Settings > Card Privacy & Visibility and toggle off "Display Phone Number".'
      },
      {
        q: 'What should I do if I lose my physical NFC card badge?',
        a: 'Immediately contact your IT administrator or raise a priority ticket here to disable the lost card and issue a replacement.'
      }
    ]
  }
];

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({ '0-0': true });
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'General',
    description: '',
    priority: 'medium'
  });
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await supportService.getMyTickets();
      if (res?.data?.tickets) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      console.error('Failed to load tickets', err);
    }
  };

  const toggleAccordion = (key) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim()) return;

    const newTicket = {
      id: Date.now(),
      ticketNumber: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketForm.subject,
      category: ticketForm.category,
      status: 'Open',
      createdAt: 'Just now'
    };

    setTickets(prev => [newTicket, ...prev]);
    setSubmittedSuccess(true);
    setShowTicketModal(false);
    setTicketForm({ subject: '', category: 'General', description: '', priority: 'medium' });

    try {
      await supportService.createTicket(ticketForm);
    } catch (err) {
      console.error('Failed to submit ticket to API', err);
    }

    setTimeout(() => setSubmittedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Help & Support</h1>
          <p className="text-sm text-gray-500 mt-0.5">Find answers to common questions or submit a support ticket to IT & HR.</p>
        </div>
        <button
          onClick={() => setShowTicketModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      {submittedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Ticket created successfully! Our enterprise support team will respond shortly.</span>
        </div>
      )}

      {/* Search FAQs */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search for articles, questions, card setup..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs"
        />
      </div>

      {/* FAQs Section */}
      <div className="space-y-6">
        {FAQS.map((categoryGroup, cIdx) => {
          const matchingItems = categoryGroup.items.filter(item =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (matchingItems.length === 0) return null;

          return (
            <div key={cIdx} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FileQuestion className="w-4 h-4 text-indigo-600" />
                <span>{categoryGroup.category}</span>
              </h2>

              <div className="space-y-2 pt-1">
                {matchingItems.map((item, iIdx) => {
                  const itemKey = `${cIdx}-${iIdx}`;
                  const isOpen = openItems[itemKey];

                  return (
                    <div
                      key={iIdx}
                      className="border border-gray-100 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleAccordion(itemKey)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 text-left transition-colors"
                      >
                        <span className="text-xs font-bold text-gray-800">{item.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="p-4 bg-white text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* My Support Tickets */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <LifeBuoy className="w-4 h-4 text-indigo-600" />
          <span>My Support Tickets</span>
        </h2>

        {tickets.length > 0 ? (
          <div className="space-y-2.5">
            {tickets.map(t => (
              <div
                key={t.id}
                className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-indigo-600 font-bold">{t.ticketNumber}</span>
                    <h4 className="font-bold text-gray-900">{t.subject}</h4>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{t.category} • Created {t.createdAt}</p>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg text-[10px]">
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No active tickets. Everything is running smoothly!</p>
        )}
      </div>

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Submit Support Ticket</h3>
              <button
                onClick={() => setShowTicketModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Update designation or NFC issue"
                  value={ticketForm.subject}
                  onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={e => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="General">General</option>
                    <option value="Card Issues">Card Issues</option>
                    <option value="Profile Correction">Profile Correction</option>
                    <option value="Access & Permissions">Access & Permissions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={e => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  placeholder="Please describe your issue in detail..."
                  value={ticketForm.description}
                  onChange={e => setTicketForm({ ...ticketForm, description: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
