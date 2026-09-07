import { Router } from 'express';
import { supportController } from './support.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createSupportTicketSchema } from './support.validation.js';

const router = Router();

router.use(authenticate);

router.get('/faqs', supportController.getFaqs.bind(supportController));
router.post(
  '/tickets',
  validate({ body: createSupportTicketSchema }),
  supportController.createTicket.bind(supportController)
);
router.get('/tickets/my-tickets', supportController.getMyTickets.bind(supportController));

export const supportRoutes = router;
