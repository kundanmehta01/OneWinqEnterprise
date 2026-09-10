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
      start.setDate(end.getDate() - 6);
      start.setHours(0, 0, 0, 0);
    } else if (range === '30d') {
      start.setDate(end.getDate() - 29);
      start.setHours(0, 0, 0, 0);
    } else if (range === '90d') {
      start.setDate(end.getDate() - 89);
      start.setHours(0, 0, 0, 0);
    } else if (range === 'month' || range === 'this_month') {
      start = new Date(end.getFullYear(), end.getMonth(), 1);
    } else if (range === 'year' || range === 'this_year') {
      start = new Date(end.getFullYear(), 0, 1);
    } else if (range === 'custom' && customStart) {
      start = new Date(customStart);
    } else {
      start.setDate(end.getDate() - 6);
      start.setHours(0, 0, 0, 0);
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

    // 5. Active Members Count
    const activeMembersCount = await TeamMember.countDocuments({ status: 'active', isArchived: false });

    // 6. Traffic Sources Breakdown (Dynamic from AnalyticsEvent)
    const rawSources = await AnalyticsEvent.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$eventType', 'QR_SCAN'] },
              'QR Code',
              {
                $cond: [
                  { $regexMatch: { input: '$referer', regex: /facebook|twitter|linkedin|instagram|whatsapp|t\.co/i } },
                  'Social Media',
                  {
                    $cond: [
                      { $or: [{ $eq: ['$referer', ''] }, { $not: ['$referer'] }] },
                      'Direct',
                      'Web Referral'
                    ]
                  }
                ]
              }
            ]
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalSourcesEvents = rawSources.reduce((sum, s) => sum + s.count, 0) || 1;
    const colorMap = {
      'Direct': '#6366f1',
      'QR Code': '#ec4899',
      'Social Media': '#f59e0b',
      'Web Referral': '#10b981',
      'Other': '#8b5cf6'
    };

    const trafficSources = rawSources.length
      ? rawSources.map((s) => ({
          source: s._id || 'Direct',
          count: s.count,
          percentage: Number(((s.count / totalSourcesEvents) * 100).toFixed(1)),
          color: colorMap[s._id] || '#8b5cf6'
        }))
      : [
          { source: 'Direct', count: 0, percentage: 0, color: '#6366f1' },
          { source: 'QR Code', count: 0, percentage: 0, color: '#ec4899' },
          { source: 'Social Media', count: 0, percentage: 0, color: '#f59e0b' }
        ];

    // 7. Profile Engagement Funnel
    const totalViews = kpiMap.PROFILE_VIEW || 0;
    const calcRate = (cnt) => (totalViews > 0 ? `${((cnt / totalViews) * 100).toFixed(1)}%` : '0%');

    const funnel = [
      { stage: 'Profile Views', count: totalViews, rate: totalViews > 0 ? '100%' : '0%', color: '#4f46e5' },
      { stage: 'Profile Shares', count: kpiMap.PROFILE_SHARE || 0, rate: calcRate(kpiMap.PROFILE_SHARE || 0), color: '#6366f1' },
      { stage: 'Link Clicks', count: kpiMap.PROFILE_LINK_CLICK || 0, rate: calcRate(kpiMap.PROFILE_LINK_CLICK || 0), color: '#38bdf8' },
      { stage: 'Contact Clicks', count: kpiMap.CONTACT_CLICK || 0, rate: calcRate(kpiMap.CONTACT_CLICK || 0), color: '#34d399' }
    ];

    // 8. Device Breakdown
    const rawDevices = await AnalyticsEvent.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            $cond: [
              { $regexMatch: { input: '$userAgent', regex: /iPad|Tablet/i } },
              'Tablet',
              {
                $cond: [
                  { $regexMatch: { input: '$userAgent', regex: /Mobile|Android|iPhone/i } },
                  'Mobile',
                  'Desktop'
                ]
              }
            ]
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalDeviceEvents = rawDevices.reduce((sum, d) => sum + d.count, 0) || 1;
    const deviceColorMap = {
      Mobile: '#4f46e5',
      Desktop: '#38bdf8',
      Tablet: '#34d399'
    };

    const deviceBreakdown = rawDevices.length
      ? rawDevices.map((d) => ({
          device: d._id || 'Desktop',
          count: d.count,
          percentage: Number(((d.count / totalDeviceEvents) * 100).toFixed(1)),
          color: deviceColorMap[d._id] || '#4f46e5'
        }))
      : [
          { device: 'Mobile', count: 0, percentage: 0, color: '#4f46e5' },
          { device: 'Desktop', count: 0, percentage: 0, color: '#38bdf8' }
        ];

    // 9. Ensure continuous trend date series
    const finalTrends = [];
    const currDate = new Date(start);
    while (currDate <= end) {
      const dateKey = currDate.toISOString().slice(0, 10);
      const label = currDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const record = dateMap[dateKey] || { views: 0, shares: 0, scans: 0, clicks: 0 };
      finalTrends.push({
        date: label,
        views: record.views,
        shares: record.shares,
        scans: record.scans,
        clicks: record.clicks
      });
      currDate.setDate(currDate.getDate() + 1);
    }

    return {
      timeRange: { range, start, end },
      kpis: {
        totalViews: kpiMap.PROFILE_VIEW || 0,
        totalShares: kpiMap.PROFILE_SHARE || 0,
        totalQrScans: kpiMap.QR_SCAN || 0,
        totalLinkClicks: kpiMap.PROFILE_LINK_CLICK || 0,
        totalContactClicks: kpiMap.CONTACT_CLICK || 0,
        activeMembers: activeMembersCount
      },
      trends: finalTrends,
      topViewedProfiles: topViewedProfiles,
      topTemplates: templateUsage.map((t) => ({
        name: t.name,
        category: t.category,
        usage: t.profileCount || 0
      })),
      trafficSources,
      funnel,
      deviceBreakdown,
      templateUsage
    };
  }
}

export const analyticsService = new AnalyticsService();

