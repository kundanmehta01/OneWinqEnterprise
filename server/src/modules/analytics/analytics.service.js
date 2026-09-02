import crypto from 'crypto';
import { AnalyticsEvent } from './analyticsEvent.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { Template } from '../templates/template.model.js';
import { logger } from '../../config/logger.config.js';

class AnalyticsService {
  async recordEvent({ eventType, targetType = 'EMPLOYEE', targetId, slug, templateId, metadata = {}, ipAddress = '', userAgent = '', referer = '' }) {
    try {
      const ipHash = ipAddress ? crypto.createHash('sha256').update(ipAddress).digest('hex').substring(0, 16) : '';

      const event = await AnalyticsEvent.create({
        eventType,
        targetType,
        targetId: targetId || null,
        slug: slug || '',
        templateId: templateId || null,
        metadata,
        ipHash,
        userAgent,
        referer,
        timestamp: new Date()
      });

      return event;
    } catch (error) {
      logger.error(`[AnalyticsService] Failed to record event: ${error.message}`, { error });
      return null;
    }
  }

  parseTimeRange(range = '7d', customStart, customEnd) {
    const end = customEnd ? new Date(customEnd) : new Date();
    let start = new Date();

    if (range === 'today') {
      start.setHours(0, 0, 0, 0);
    } else if (range === '7d') {
      start.setDate(end.getDate() - 7);
    } else if (range === '30d') {
      start.setDate(end.getDate() - 30);
    } else if (range === 'custom' && customStart) {
      start = new Date(customStart);
    } else {
      start.setDate(end.getDate() - 7);
    }

    return { start, end };
  }

  async getAggregatedMetrics({ range = '7d', startDate, endDate, targetId, targetType } = {}) {
    const { start, end } = this.parseTimeRange(range, startDate, endDate);

    const matchFilter = {
      timestamp: { $gte: start, $lte: end }
    };

    if (targetId) matchFilter.targetId = targetId;
    if (targetType) matchFilter.targetType = targetType;

    // 1. KPI Counts by Event Type
    const eventCounts = await AnalyticsEvent.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$eventType', count: { $sum: 1 } } }
    ]);

    const kpiMap = {
      PROFILE_VIEW: 0,
      PROFILE_SHARE: 0,
      QR_SCAN: 0,
      PROFILE_LINK_CLICK: 0,
      CONTACT_CLICK: 0
    };

    eventCounts.forEach((item) => {
      if (kpiMap[item._id] !== undefined) {
        kpiMap[item._id] = item.count;
      }
    });

    // 2. Daily Trend Timeline
    const timeline = await AnalyticsEvent.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            type: '$eventType'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Format timeline by date
    const dateMap = {};
    timeline.forEach((item) => {
      const date = item._id.date;
      if (!dateMap[date]) {
        dateMap[date] = { date, views: 0, shares: 0, scans: 0, clicks: 0 };
      }
      if (item._id.type === 'PROFILE_VIEW') dateMap[date].views += item.count;
      if (item._id.type === 'PROFILE_SHARE') dateMap[date].shares += item.count;
      if (item._id.type === 'QR_SCAN') dateMap[date].scans += item.count;
      if (item._id.type === 'PROFILE_LINK_CLICK' || item._id.type === 'CONTACT_CLICK') {
        dateMap[date].clicks += item.count;
      }
    });

    const trendSeries = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));

    // 3. Top Viewed Profiles
    const topProfilesAgg = await AnalyticsEvent.aggregate([
      { $match: { ...matchFilter, eventType: 'PROFILE_VIEW', targetId: { $ne: null } } },
      { $group: { _id: '$targetId', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 5 }
    ]);

    const topMemberIds = topProfilesAgg.map((item) => item._id);
    const members = await TeamMember.find({ _id: { $in: topMemberIds } })
      .populate('departmentId', 'name')
      .populate('profileId', 'slug')
      .lean();

    const memberLookup = new Map(members.map((m) => [m._id.toString(), m]));

    const topViewedProfiles = topProfilesAgg.map((item) => {
      const m = memberLookup.get(item._id.toString());
      return {
        memberId: item._id,
        name: m ? m.name : 'Unknown Member',
        designation: m ? m.designation : '',
        department: m?.departmentId?.name || '',
        slug: m?.profileId?.slug || '',
        views: item.views
      };
    });

    // 4. Most Used Templates
    const templateUsage = await Template.aggregate([
      { $match: { isArchived: false } },
      {
        $lookup: {
          from: 'employeeprofiles',
          localField: '_id',
          foreignField: 'templateId',
          as: 'profiles'
        }
      },
      {
        $project: {
          name: 1,
          category: 1,
          slug: 1,
          profileCount: { $size: '$profiles' }
        }
      },
      { $sort: { profileCount: -1 } }
    ]);

    return {
      timeRange: { range, start, end },
      kpis: {
        totalViews: kpiMap.PROFILE_VIEW,
        totalShares: kpiMap.PROFILE_SHARE,
        totalQrScans: kpiMap.QR_SCAN,
        totalLinkClicks: kpiMap.PROFILE_LINK_CLICK,
        totalContactClicks: kpiMap.CONTACT_CLICK
      },
      trends: trendSeries,
      topViewedProfiles,
      templateUsage
    };
  }
}

export const analyticsService = new AnalyticsService();
