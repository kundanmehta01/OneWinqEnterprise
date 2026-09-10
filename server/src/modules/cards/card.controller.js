import { cardService } from './card.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class CardController {
  async getAllCards(req, res, next) {
    try {
      const result = await cardService.getAllCards(req.query);
      return ApiResponse.success(res, { data: result });
    } catch (error) {
      next(error);
    }
  }

  async getCardStats(req, res, next) {
    try {
      const stats = await cardService.getCardStats();
      return ApiResponse.success(res, { data: stats });
    } catch (error) {
      next(error);
    }
  }

  async getCardById(req, res, next) {
    try {
      const card = await cardService.getCardById(req.params.id);
      return ApiResponse.success(res, { data: card });
    } catch (error) {
      next(error);
    }
  }

  async createCard(req, res, next) {
    try {
      const card = await cardService.createCard(req.body, req.user._id);
      return ApiResponse.success(res, {
        statusCode: 201,
        message: 'Smart card registered successfully into inventory',
        data: card
      });
    } catch (error) {
      next(error);
    }
  }

  async createBulkCards(req, res, next) {
    try {
      const result = await cardService.createBulkCards(req.body.cards, req.user._id);
      return ApiResponse.success(res, {
        statusCode: 201,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  // 1. Assign card to member (Status: AVAILABLE -> ACTIVATION PENDING)
  async assignCard(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        user: req.user,
        ipAddress: req.auditContext?.ipAddress || req.ip,
        userAgent: req.auditContext?.userAgent || req.headers['user-agent']
      };

      const payload = {
        ...req.body,
        cardId: req.params.id || req.body.cardId
      };

      const result = await cardService.assignCard(payload, actorContext);
      return ApiResponse.success(res, {
        message: result.message,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // 2. Unassign card (Status -> AVAILABLE)
  async unassignCard(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        user: req.user,
        ipAddress: req.auditContext?.ipAddress || req.ip,
        userAgent: req.auditContext?.userAgent || req.headers['user-agent']
      };

      const payload = {
        ...req.body,
        cardId: req.params.id || req.body.cardId
      };

      const result = await cardService.unassignCard(payload, actorContext);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  // 3. Get Activation Details (Public check before activation)
  async getActivationDetails(req, res, next) {
    try {
      const details = await cardService.getActivationDetails(req.params.token);
      return ApiResponse.success(res, { data: details });
    } catch (error) {
      next(error);
    }
  }

  // 4. Activate Card (Status: ACTIVATION PENDING -> ACTIVE, authenticated & ownership verified)
  async activateCard(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        user: req.user,
        ipAddress: req.auditContext?.ipAddress || req.ip,
        userAgent: req.auditContext?.userAgent || req.headers['user-agent']
      };

      const result = await cardService.activateCard(req.params.token, actorContext);
      return ApiResponse.success(res, {
        message: result.message,
        data: result.card
      });
    } catch (error) {
      next(error);
    }
  }

  // 5. Generate / Regenerate Activation Link
  async generateActivationLink(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        user: req.user
      };

      const result = await cardService.generateActivationLink(req.params.id, actorContext);
      return ApiResponse.success(res, { data: result });
    } catch (error) {
      next(error);
    }
  }

  // Legacy link/unlink support
  async linkCard(req, res, next) {
    return this.assignCard(req, res, next);
  }

  async unlinkCard(req, res, next) {
    return this.unassignCard(req, res, next);
  }

  async updateCardStatus(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress || req.ip,
        userAgent: req.auditContext?.userAgent || req.headers['user-agent']
      };

      const card = await cardService.updateCardStatus(req.params.id, req.body, actorContext);
      return ApiResponse.success(res, {
        message: `Card status updated to "${card.status}"`,
        data: card
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCard(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress || req.ip,
        userAgent: req.auditContext?.userAgent || req.headers['user-agent']
      };

      const result = await cardService.deleteCard(req.params.id, actorContext);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async resolvePublicTap(req, res, next) {
    try {
      const clientContext = {
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip,
        userAgent: req.headers['user-agent'],
        referer: req.headers['referer'] || ''
      };

      const result = await cardService.resolvePublicCardTap(req.params.cardUid, clientContext);
      return ApiResponse.success(res, { data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const cardController = new CardController();
