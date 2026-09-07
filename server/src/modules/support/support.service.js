import { SupportTicket } from './supportTicket.model.js';
import { parsePagination, formatPaginationMeta } from '../../utils/pagination.util.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';

class SupportService {
  getFaqs() {
    return [
      {
        category: 'Digital Identity & Card',
        questions: [
          {
            q: 'How does my OneWinq Digital Card work?',
            a: 'Your digital card is connected to your unique profile slug (/p/your-slug). When someone scans your QR code or taps your NFC card, your live professional identity is displayed with downloadable vCard contact.'
          },
          {
            q: 'Can I choose which contact information is public?',
            a: 'Yes! In Settings > Privacy, you can toggle email and phone visibility between Public, Connections Only, Company Only, or Hidden.'
          },
          {
            q: 'How do I change my digital card theme style?',
            a: 'Go to My Profile > Edit Profile and select from the enterprise-approved design templates.'
          }
        ]
      },
      {
        category: 'Profile & Approvals',
        questions: [
          {
            q: 'Why does my profile status show "Pending Review"?',
            a: 'When you submit profile changes, organization policy may require administrative review before changes are published live.'
          },
          {
            q: 'Can I edit my Employee ID or Department?',
            a: 'No. Official organizational designations, departments, and employee IDs are managed centrally by your HR Administrator.'
          }
        ]
      },
      {
        category: 'Networking & Events',
        questions: [
          {
            q: 'Who can I connect with on OneWinq?',
            a: 'You can discover and send connection requests to any active team member across all company departments in the Network tab.'
          },
          {
            q: 'How do I check in to company events?',
            a: 'Once registered for an event, open "My Events" to view your unique digital ticket code and QR pass for entry scanning.'
          }
        ]
      }
    ];
  }

  async createTicket(userId, data) {
    const count = await SupportTicket.countDocuments();
    const ticketId = `TKT-${String(count + 1).padStart(4, '0')}`;

    const ticket = await SupportTicket.create({
      ticketId,
      userId,
      ...data
    });

    eventBus.emitEvent(APP_EVENTS.SUPPORT_TICKET_CREATED, {
      ticketId,
      userId,
      subject: ticket.subject
    });

    return ticket;
  }

  async getMyTickets(userId, query = {}) {
    const { page, limit, skip } = parsePagination(query, 10);
    const filter = { userId };

    const [tickets, totalItems] = await Promise.all([
      SupportTicket.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SupportTicket.countDocuments(filter)
    ]);

    return {
      tickets,
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }
}

export const supportService = new SupportService();
