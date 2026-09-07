import { connectionService } from './connection.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class ConnectionController {
  async getPeopleDirectory(req, res, next) {
    try {
      const result = await connectionService.getPeopleDirectory(req.user._id, req.query);
      return ApiResponse.success(res, { data: result });
    } catch (error) {
      next(error);
    }
  }

  async sendRequest(req, res, next) {
    try {
      const { recipientId, note } = req.body;
      const connection = await connectionService.sendConnectionRequest(req.user._id, { recipientId, note });
      return ApiResponse.success(res, {
        statusCode: 201,
        message: 'Connection request sent successfully',
        data: connection
      });
    } catch (error) {
      next(error);
    }
  }

  async acceptRequest(req, res, next) {
    try {
      const connection = await connectionService.acceptConnectionRequest(req.params.id, req.user._id);
      return ApiResponse.success(res, {
        message: 'Connection request accepted',
        data: connection
      });
    } catch (error) {
      next(error);
    }
  }

  async declineRequest(req, res, next) {
    try {
      const result = await connectionService.declineConnectionRequest(req.params.id, req.user._id);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async cancelRequest(req, res, next) {
    try {
      const result = await connectionService.cancelConnectionRequest(req.params.id, req.user._id);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getMyConnections(req, res, next) {
    try {
      const result = await connectionService.getMyConnections(req.user._id, req.query);
      return ApiResponse.success(res, { data: result });
    } catch (error) {
      next(error);
    }
  }

  async removeConnection(req, res, next) {
    try {
      const result = await connectionService.removeConnection(req.params.id, req.user._id);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getIncomingRequests(req, res, next) {
    try {
      const result = await connectionService.getIncomingRequests(req.user._id, req.query);
      return ApiResponse.success(res, { data: result });
    } catch (error) {
      next(error);
    }
  }

  async getOutgoingRequests(req, res, next) {
    try {
      const result = await connectionService.getOutgoingRequests(req.user._id, req.query);
      return ApiResponse.success(res, { data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const connectionController = new ConnectionController();
