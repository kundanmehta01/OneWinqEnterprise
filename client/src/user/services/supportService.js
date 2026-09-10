import api from '../../services/api';

export const supportService = {
  getFaqs: async () => {
    const res = await api.get('/support/faqs');
    return res.data.data;
  },

  createTicket: async ({ subject, category, message, priority = 'normal' }) => {
    const res = await api.post('/support/tickets', { subject, category, message, priority });
    return res.data.data;
  },

  getMyTickets: async () => {
    const res = await api.get('/support/tickets/my-tickets');
    return res.data.data;
  }
};
