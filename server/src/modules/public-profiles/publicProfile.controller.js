import { publicProfileService } from './publicProfile.service.js';
import { companyProfileService } from '../company-profile/companyProfile.service.js';
import { analyticsService } from '../analytics/analytics.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class PublicProfileController {
  async getCompanyProfile(req, res, next) {
    try {
      const profile = await companyProfileService.getPublicCompanyProfile();
      if (!profile) {
        return ApiResponse.error(res, { statusCode: 404, message: 'Company profile is not published' });
      }
      return ApiResponse.success(res, { data: profile });
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeProfile(req, res, next) {
    try {
      const clientContext = {
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip,
        userAgent: req.headers['user-agent'],
        referer: req.headers['referer'] || ''
      };
      const profile = await publicProfileService.getPublicProfileBySlug(req.params.slug, clientContext);
      return ApiResponse.success(res, { data: profile });
    } catch (error) {
      next(error);
    }
  }

  async getProfileQrCode(req, res, next) {
    try {
      const format = req.query.format === 'svg' ? 'svg' : 'dataUrl';
      const qr = await publicProfileService.getQrCodeForSlug(req.params.slug, format);

      if (format === 'svg') {
        res.setHeader('Content-Type', 'image/svg+xml');
        return res.send(qr);
      }
      return ApiResponse.success(res, { data: { qrCodeDataUrl: qr } });
    } catch (error) {
      next(error);
    }
  }

  async recordPublicEvent(req, res, next) {
    try {
      const { eventType, targetType, targetId, slug, metadata } = req.body;
      const clientContext = {
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip,
        userAgent: req.headers['user-agent'],
        referer: req.headers['referer'] || ''
      };

      await analyticsService.recordEvent({
        eventType,
        targetType: targetType || 'EMPLOYEE',
        targetId,
        slug,
        metadata,
        ...clientContext
      });

      return ApiResponse.success(res, { message: 'Event recorded successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const publicProfileController = new PublicProfileController();
