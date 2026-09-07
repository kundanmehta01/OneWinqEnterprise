import { Router } from 'express';
import { eventController } from './event.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { requirePermission } from '../../middlewares/authorize.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createEventSchema,
  updateEventSchema,
  eventIdParamSchema,
  eventQuerySchema
} from './event.validation.js';
import { PERMISSIONS } from '../../constants/permissions.constant.js';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requirePermission(PERMISSIONS.EVENT_CREATE),
  validate({ body: createEventSchema }),
  eventController.createEvent.bind(eventController)
);

router.patch(
  '/:id',
  requirePermission(PERMISSIONS.EVENT_UPDATE),
  validate({ params: eventIdParamSchema, body: updateEventSchema }),
  eventController.updateEvent.bind(eventController)
);

router.post(
  '/:id/cancel',
  requirePermission(PERMISSIONS.EVENT_UPDATE),
  validate({ params: eventIdParamSchema }),
  eventController.cancelEvent.bind(eventController)
);

router.get(
  '/:id/attendees',
  requirePermission(PERMISSIONS.EVENT_READ),
  validate({ params: eventIdParamSchema }),
  eventController.getEventAttendees.bind(eventController)
);

export const adminEventRoutes = router;
