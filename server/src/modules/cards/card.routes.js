import { Router } from 'express';
import { cardController } from './card.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { requirePermission } from '../../middlewares/authorize.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createCardSchema,
  createBulkCardsSchema,
  linkCardSchema,
  unlinkCardSchema,
  updateCardStatusSchema,
  cardIdParamSchema,
  cardQuerySchema
} from './card.validation.js';
import { PERMISSIONS } from '../../constants/permissions.constant.js';

const router = Router();

router.use(authenticate);

// 1. Inventory & Statistics
router.get(
  '/',
  requirePermission(PERMISSIONS.CARD_READ),
  validate({ query: cardQuerySchema }),
  cardController.getAllCards.bind(cardController)
);

router.get(
  '/stats',
  requirePermission(PERMISSIONS.CARD_READ),
  cardController.getCardStats.bind(cardController)
);

// 2. Link & Unlink Operations
router.post(
  '/link',
  requirePermission(PERMISSIONS.CARD_LINK),
  validate({ body: linkCardSchema }),
  cardController.linkCard.bind(cardController)
);

router.post(
  '/unlink',
  requirePermission(PERMISSIONS.CARD_UNLINK),
  validate({ body: unlinkCardSchema }),
  cardController.unlinkCard.bind(cardController)
);

// 3. Card Registration (Single & Bulk)
router.post(
  '/',
  requirePermission(PERMISSIONS.CARD_CREATE),
  validate({ body: createCardSchema }),
  cardController.createCard.bind(cardController)
);

router.post(
  '/bulk',
  requirePermission(PERMISSIONS.CARD_CREATE),
  validate({ body: createBulkCardsSchema }),
  cardController.createBulkCards.bind(cardController)
);

// 4. Single Card Lifecycle
router.get(
  '/:id',
  requirePermission(PERMISSIONS.CARD_READ),
  validate({ params: cardIdParamSchema }),
  cardController.getCardById.bind(cardController)
);

router.patch(
  '/:id/status',
  requirePermission(PERMISSIONS.CARD_UPDATE),
  validate({ params: cardIdParamSchema, body: updateCardStatusSchema }),
  cardController.updateCardStatus.bind(cardController)
);

router.delete(
  '/:id',
  requirePermission(PERMISSIONS.CARD_DELETE),
  validate({ params: cardIdParamSchema }),
  cardController.deleteCard.bind(cardController)
);

export const cardRoutes = router;
