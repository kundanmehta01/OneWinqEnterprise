import { eventService } from './event.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class EventController {
  // User Endpoints
  async getEvents(req, res, next) {
    try {
      const userContext = {
        userId: req.user._id,
        member: req.member,
        isSuperAdmin: req.isSuperAdmin
      };
      const result = await eventService.getEligibleEvents(userContext, req.query);
      return ApiResponse.success(res, { data: result });
    } catch (error) {
      next(error);
    }
  }

  async getEventById(req, res, next) {
    try {
      const userContext = {
        userId: req.user._id,
        member: req.member,
        isSuperAdmin: req.isSuperAdmin
      };
      const event = await eventService.getEventById(req.params.id, userContext);
      return ApiResponse.success(res, { data: event });
    } catch (error) {
      next(error);
    }
  }

  async registerForEvent(req, res, next) {
    try {
      const userContext = {
        userId: req.user._id,
        member: req.member,
        isSuperAdmin: req.isSuperAdmin
      };
      const registration = await eventService.registerForEvent(req.params.id, userContext);
      return ApiResponse.success(res, {
        statusCode: 201,
        message: 'Successfully registered for the event',
        data: registration
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelRegistration(req, res, next) {
    try {
      const result = await eventService.cancelRegistration(req.params.id, req.user._id);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getMyEvents(req, res, next) {
    try {
      const result = await eventService.getMyEvents(req.user._id, req.query);
      return ApiResponse.success(res, { data: result });
    } catch (error) {
      next(error);
    }
  }

  // Admin Endpoints
  async createEvent(req, res, next) {
    try {
      const event = await eventService.createEvent(req.body, req.user._id);
      return ApiResponse.success(res, {
        statusCode: 201,
        message: 'Event created successfully',
        data: event
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req, res, next) {
    try {
      const event = await eventService.updateEvent(req.params.id, req.body, req.user._id);
      return ApiResponse.success(res, {
        message: 'Event updated successfully',
        data: event
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelEvent(req, res, next) {
    try {
      const result = await eventService.cancelEvent(req.params.id, req.user._id);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getEventAttendees(req, res, next) {
    try {
      const result = await eventService.getEventAttendees(req.params.id, req.query);
      return ApiResponse.success(res, { data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const eventController = new EventController();
