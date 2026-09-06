import { supportService } from './support.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class SupportController {
  getFaqs(req, res, next) {
    try {
      const faqs = supportService.getFaqs();
      return ApiResponse.success(res, { data: { faqs } });
    } catch (error) {
      next(error);
    }
  }

  async createTicket(req, res, next) {
    try {
      const ticket = await supportService.createTicket(req.user._id, req.body);
      return ApiResponse.success(res, {
        statusCode: 201,
        message: 'Support ticket submitted successfully',
        data: ticket
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyTickets(req, res, next) {
    try {
      const result = await supportService.getMyTickets(req.user._id, req.query);
      return ApiResponse.success(res, { data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const supportController = new SupportController();
