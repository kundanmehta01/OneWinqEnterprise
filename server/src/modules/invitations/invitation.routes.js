import { Router } from 'express';
import { invitationController } from './invitation.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { requirePermission } from '../../middlewares/authorize.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authRateLimiter } from '../../middlewares/rateLimiter.middleware.js';
import {
  createInvitationSchema,
  acceptInvitationSchema,
  invitationIdParamSchema
} from './invitation.validation.js';
import { PERMISSIONS } from '../../constants/permissions.constant.js';

const router = Router();

// Public invitation routes
router.get('/verify', invitationController.verifyToken.bind(invitationController));

router.post(
  '/accept',
  authRateLimiter,
  validate({ body: acceptInvitationSchema }),
  invitationController.acceptInvitation.bind(invitationController)
);

// Authenticated Admin invitation routes
router.get(
  '/',
  authenticate,
  requirePermission(PERMISSIONS.INVITATION_READ),
  invitationController.getAllInvitations.bind(invitationController)
);

router.get(
  '/:id',
  authenticate,
  requirePermission(PERMISSIONS.INVITATION_READ),
  validate({ params: invitationIdParamSchema }),
  invitationController.getInvitationById.bind(invitationController)
);

router.post(
  '/',
  authenticate,
  requirePermission(PERMISSIONS.INVITATION_CREATE),
  validate({ body: createInvitationSchema }),
  invitationController.createInvitation.bind(invitationController)
);

router.post(
  '/:id/resend',
  authenticate,
  requirePermission(PERMISSIONS.INVITATION_RESEND),
  validate({ params: invitationIdParamSchema }),
  invitationController.resendInvitation.bind(invitationController)
);

router.post(
  '/:id/cancel',
  authenticate,
  requirePermission(PERMISSIONS.INVITATION_CANCEL),
  validate({ params: invitationIdParamSchema }),
  invitationController.cancelInvitation.bind(invitationController)
);

export const invitationRoutes = router;
