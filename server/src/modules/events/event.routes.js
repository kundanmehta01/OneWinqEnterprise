import { Router } from 'express';
import { eventController } from './event.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  eventIdParamSchema,
  eventQuerySchema
} from './event.validation.js';

const router = Router();

router.use(authenticate);

// 1. Browse eligible events
router.get(
  '/',
  validate({ query: eventQuerySchema }),
  eventController.getEvents.bind(eventController)
);

// 2. My registered events (upcoming / past)
router.get(
  '/my-events',
  validate({ query: eventQuerySchema }),
  eventController.getMyEvents.bind(eventController)
);

// 3. Event details & RSVP
router.get(
  '/:id',
  validate({ params: eventIdParamSchema }),
  eventController.getEventById.bind(eventController)
);

router.post(
  '/:id/register',
  validate({ params: eventIdParamSchema }),
  eventController.registerForEvent.bind(eventController)
);

router.post(
  '/:id/cancel',
  validate({ params: eventIdParamSchema }),
  eventController.cancelRegistration.bind(eventController)
);

export const eventRoutes = router;
