import { TeamMember } from '../team-members/teamMember.model.js';
import { Department } from '../departments/department.model.js';
import { ProfileApproval } from '../profile-approvals/profileApproval.model.js';
import { Invitation } from '../invitations/invitation.model.js';
import { AuditLog } from '../audit-logs/auditLog.model.js';
import { analyticsService } from '../analytics/analytics.service.js';

class DashboardService {
  async getExecutiveDashboard() {
    const [
      totalMembers,
      activeMembers,
      pendingInvites,
      totalDepartments,
      pendingApprovalsCount,
      recentAuditLogs,
      recentPendingApprovals,
      completionAgg,
      analyticsMetrics
    ] = await Promise.all([
      TeamMember.countDocuments({ isArchived: false }),
      TeamMember.countDocuments({ status: 'active', isArchived: false }),
      Invitation.countDocuments({ status: 'pending', expiresAt: { $gt: new Date() } }),
      Department.countDocuments({ isArchived: false }),
      ProfileApproval.countDocuments({ status: 'pending' }),
      AuditLog.find().sort({ timestamp: -1 }).limit(5).populate('actorId', 'email').lean(),
      ProfileApproval.find({ status: 'pending' })
        .sort({ submittedAt: -1 })
        .limit(5)
        .populate('memberId', 'name designation')
        .populate('submittedBy', 'email')
        .lean(),
      TeamMember.aggregate([
        { $match: { isArchived: false, status: 'active' } },
        { $group: { _id: null, avgScore: { $avg: '$profileCompletionScore' } } }
      ]),
      analyticsService.getAggregatedMetrics({ range: '7d' })
    ]);

    const averageProfileCompletion = completionAgg[0]?.avgScore ? Math.round(completionAgg[0].avgScore) : 0;

    // Department breakdown
    const departmentBreakdown = await Department.aggregate([
      { $match: { isArchived: false } },
      {
        $lookup: {
          from: 'teammembers',
          localField: '_id',
          foreignField: 'departmentId',
          as: 'members'
        }
      },
      {
        $project: {
          name: 1,
          slug: 1,
          memberCount: {
            $size: {
              $filter: {
                input: '$members',
                as: 'm',
                cond: { $and: [{ $eq: ['$$m.isArchived', false] }, { $eq: ['$$m.status', 'active'] }] }
              }
            }
          }
        }
      },
      { $sort: { memberCount: -1 } }
    ]);

    return {
      overview: {
        totalMembers,
        activeMembers,
        pendingInvites,
        totalDepartments,
        pendingApprovalsCount,
        averageProfileCompletion
      },
      analytics: analyticsMetrics.kpis,
      analyticsTrends: analyticsMetrics.trends,
      topProfiles: analyticsMetrics.topViewedProfiles,
      departmentBreakdown,
      recentPendingApprovals,
      recentActivity: recentAuditLogs
    };
  }
}

export const dashboardService = new DashboardService();
