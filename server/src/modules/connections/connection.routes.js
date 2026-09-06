import { Router } from 'express';
import { connectionController } from './connection.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  sendConnectionRequestSchema,
  connectionIdParamSchema,
  peopleQuerySchema
} from './connection.validation.js';

const router = Router();

router.use(authenticate);

// 1. Discover colleagues & people directory
router.get(
  '/people',
  validate({ query: peopleQuerySchema }),
  connectionController.getPeopleDirectory.bind(connectionController)
);

// 2. My active connections
router.get(
  '/connections',
  connectionController.getMyConnections.bind(connectionController)
);

router.delete(
  '/connections/:id',
  validate({ params: connectionIdParamSchema }),
  connectionController.removeConnection.bind(connectionController)
);

// 3. Requests management
router.get(
  '/requests/incoming',
  connectionController.getIncomingRequests.bind(connectionController)
);

router.get(
  '/requests/outgoing',
  connectionController.getOutgoingRequests.bind(connectionController)
);

router.post(
  '/requests',
  validate({ body: sendConnectionRequestSchema }),
  connectionController.sendRequest.bind(connectionController)
);

router.post(
  '/requests/:id/accept',
  validate({ params: connectionIdParamSchema }),
  connectionController.acceptRequest.bind(connectionController)
);

router.post(
  '/requests/:id/decline',
  validate({ params: connectionIdParamSchema }),
  connectionController.declineRequest.bind(connectionController)
);

router.post(
  '/requests/:id/cancel',
  validate({ params: connectionIdParamSchema }),
  connectionController.cancelRequest.bind(connectionController)
);

export const connectionRoutes = router;
