import { Router } from 'express';
import { cardController } from './card.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { requirePermission } from '../../middlewares/authorize.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createCardSchema,
  createBulkCardsSchema,
  assignCardSchema,
  unassignCardSchema,
  linkCardSchema,
  unlinkCardSchema,
  updateCardStatusSchema,
  cardIdParamSchema,
  activationTokenParamSchema,
  claimCardSchema,
  cardQuerySchema
} from './card.validation.js';
import { PERMISSIONS } from '../../constants/permissions.constant.js';

// 1. User & Public Activation Router (/cards or /api/v1/cards)
const activationRouter = Router();

// Public: verify activation token & get card details
activationRouter.get(
  '/activate/:token',
  validate({ params: activationTokenParamSchema }),
  cardController.getActivationDetails.bind(cardController)
);

// Authenticated: activate the card (enforces ownership)
activationRouter.post(
  '/activate/:token',
  authenticate,
  validate({ params: activationTokenParamSchema }),
  cardController.activateCard.bind(cardController)
);

// Authenticated: Claim/link an unlinked card directly to the logged-in user's profile
activationRouter.post(
  '/claim',
  authenticate,
  validate({ body: claimCardSchema }),
  cardController.claimCard.bind(cardController)
);


// 2. Organization Admin Card Management Router (/admin/cards or /api/v1/admin/cards)
const adminRouter = Router();

adminRouter.use(authenticate);

// Inventory & Statistics
adminRouter.get(
  '/',
  requirePermission(PERMISSIONS.CARD_READ),
  validate({ query: cardQuerySchema }),
  cardController.getAllCards.bind(cardController)
);

adminRouter.get(
  '/stats',
  requirePermission(PERMISSIONS.CARD_READ),
  cardController.getCardStats.bind(cardController)
);

// Card Assignment & Activation Link Generation
adminRouter.post(
  '/assign',
  requirePermission(PERMISSIONS.CARD_LINK),
  validate({ body: assignCardSchema }),
  cardController.assignCard.bind(cardController)
);

adminRouter.post(
  '/:id/assign',
  requirePermission(PERMISSIONS.CARD_LINK),
  validate({ params: cardIdParamSchema }),
  cardController.assignCard.bind(cardController)
);

adminRouter.post(
  '/unassign',
  requirePermission(PERMISSIONS.CARD_UNLINK),
  validate({ body: unassignCardSchema }),
  cardController.unassignCard.bind(cardController)
);

adminRouter.post(
  '/:id/unassign',
  requirePermission(PERMISSIONS.CARD_UNLINK),
  validate({ params: cardIdParamSchema }),
  cardController.unassignCard.bind(cardController)
);

adminRouter.post(
  '/:id/activation-link',
  requirePermission(PERMISSIONS.CARD_LINK),
  validate({ params: cardIdParamSchema }),
  cardController.generateActivationLink.bind(cardController)
);

// Legacy Link & Unlink
adminRouter.post(
  '/link',
  requirePermission(PERMISSIONS.CARD_LINK),
  validate({ body: linkCardSchema }),
  cardController.linkCard.bind(cardController)
);

adminRouter.post(
  '/unlink',
  requirePermission(PERMISSIONS.CARD_UNLINK),
  validate({ body: unlinkCardSchema }),
  cardController.unlinkCard.bind(cardController)
);

// Card Registration (Single & Bulk)
adminRouter.post(
  '/',
  requirePermission(PERMISSIONS.CARD_CREATE),
  validate({ body: createCardSchema }),
  cardController.createCard.bind(cardController)
);

adminRouter.post(
  '/bulk',
  requirePermission(PERMISSIONS.CARD_CREATE),
  validate({ body: createBulkCardsSchema }),
  cardController.createBulkCards.bind(cardController)
);

// Single Card Details, Status & Delete
adminRouter.get(
  '/:id',
  requirePermission(PERMISSIONS.CARD_READ),
  validate({ params: cardIdParamSchema }),
  cardController.getCardById.bind(cardController)
);

adminRouter.patch(
  '/:id/status',
  requirePermission(PERMISSIONS.CARD_UPDATE),
  validate({ params: cardIdParamSchema, body: updateCardStatusSchema }),
  cardController.updateCardStatus.bind(cardController)
);

adminRouter.delete(
  '/:id',
  requirePermission(PERMISSIONS.CARD_DELETE),
  validate({ params: cardIdParamSchema }),
  cardController.deleteCard.bind(cardController)
);

export const cardRoutes = adminRouter;
export const cardActivationRoutes = activationRouter;
