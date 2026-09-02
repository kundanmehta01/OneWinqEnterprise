import { templateService } from './template.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class TemplateController {
  async getAllTemplates(req, res, next) {
    try {
      const { category, search, includeArchived } = req.query;
      const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;
      const templates = await templateService.getAllTemplates({
        category,
        isActive,
        includeArchived: includeArchived === 'true',
        search
      });
      return ApiResponse.success(res, { data: templates });
    } catch (error) {
      next(error);
    }
  }

  async getTemplateById(req, res, next) {
    try {
      const template = await templateService.getTemplateById(req.params.id);
      return ApiResponse.success(res, { data: template });
    } catch (error) {
      next(error);
    }
  }

  async createTemplate(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const template = await templateService.createTemplate(req.body, actorContext);
      return ApiResponse.created(res, {
        message: 'Template created successfully',
        data: template
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTemplate(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const template = await templateService.updateTemplate(req.params.id, req.body, actorContext);
      return ApiResponse.success(res, {
        message: 'Template updated successfully',
        data: template
      });
    } catch (error) {
      next(error);
    }
  }

  async duplicateTemplate(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const duplicate = await templateService.duplicateTemplate(req.params.id, req.body.name, actorContext);
      return ApiResponse.created(res, {
        message: 'Template duplicated successfully',
        data: duplicate
      });
    } catch (error) {
      next(error);
    }
  }

  async archiveTemplate(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const result = await templateService.archiveTemplate(req.params.id, actorContext);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const templateController = new TemplateController();
