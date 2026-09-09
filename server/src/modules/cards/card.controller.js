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

  async linkCard(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress || req.ip,
        userAgent: req.auditContext?.userAgent || req.headers['user-agent']
      };

      const card = await cardService.linkCard(req.body, actorContext);
      return ApiResponse.success(res, {
        message: `Card ${card.cardUid} successfully linked to ${card.member?.name || 'team member'}`,
        data: card
      });
    } catch (error) {
      next(error);
    }
  }

  async unlinkCard(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress || req.ip,
        userAgent: req.auditContext?.userAgent || req.headers['user-agent']
      };

      const result = await cardService.unlinkCard(req.body, actorContext);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
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
