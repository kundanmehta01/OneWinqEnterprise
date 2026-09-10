import { TeamMember } from '../team-members/teamMember.model.js';
import { Department } from '../departments/department.model.js';
import { ProfileApproval } from '../profile-approvals/profileApproval.model.js';
import { Invitation } from '../invitations/invitation.model.js';
import { analyticsService } from '../analytics/analytics.service.js';

class DashboardService {
  async getExecutiveDashboard() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalMembers,
      activeMembers,
      pendingInvites,
      totalDepartments,
      pendingApprovalsCount,
      recentJoinedMembers,
      recentPendingApprovals,
      completionAgg,
      completedMembersCount,
      inProgressMembersCount,
      memberGrowthAgg,
      analyticsMetrics
    ] = await Promise.all([
      TeamMember.countDocuments({ isArchived: false, isDeleted: { $ne: true }, isSystem: { $ne: true } }),
      TeamMember.countDocuments({ status: 'active', isArchived: false, isDeleted: { $ne: true }, isSystem: { $ne: true } }),
      Invitation.countDocuments({ status: 'pending', expiresAt: { $gt: new Date() } }),
      Department.countDocuments({ isArchived: false }),
      ProfileApproval.countDocuments({ status: 'pending' }),
      TeamMember.find({ status: 'active', isArchived: false, isDeleted: { $ne: true }, isSystem: { $ne: true } })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('roleId', 'name')
        .populate('departmentId', 'name')
        .lean(),
      ProfileApproval.find({ status: 'pending' })
        .sort({ submittedAt: -1 })
        .limit(5)
        .populate('memberId', 'name designation')
        .populate('submittedBy', 'email')
        .lean(),
      TeamMember.aggregate([
        { $match: { isArchived: false, isDeleted: { $ne: true }, isSystem: { $ne: true }, status: 'active' } },
        { $group: { _id: null, avgScore: { $avg: '$profileCompletionScore' } } }
      ]),
      TeamMember.countDocuments({ isArchived: false, isDeleted: { $ne: true }, isSystem: { $ne: true }, profileCompletionScore: { $gte: 80 } }),
      TeamMember.countDocuments({ isArchived: false, isDeleted: { $ne: true }, isSystem: { $ne: true }, profileCompletionScore: { $gt: 0, $lt: 80 } }),
      TeamMember.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo }, isDeleted: { $ne: true }, isSystem: { $ne: true } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
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

    const profileCompletionBreakdown = {
      completed: completedMembersCount,
      inProgress: inProgressMembersCount,
      pendingApproval: pendingApprovalsCount,
      total: totalMembers
    };

    // Generate daily growth timeline for past 7 days
    const growthMap = new Map(memberGrowthAgg.map((g) => [g._id, g.count]));
    const growthTrends = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      growthTrends.push({
        date: label,
        count: growthMap.get(dateKey) || 0
      });
    }

    return {
      overview: {
        totalMembers,
        activeMembers,
        pendingInvites,
        totalDepartments,
        pendingApprovalsCount,
        achievementsCount: 0,
        updatesCount: 0,
        averageProfileCompletion
      },
      profileCompletionBreakdown,
      growthTrends,
      analytics: analyticsMetrics.kpis,
      analyticsTrends: analyticsMetrics.trends,
      topProfiles: analyticsMetrics.topViewedProfiles,
      departmentBreakdown,
      recentPendingApprovals,
      recentActivity: recentJoinedMembers.map((m) => ({
        type: 'MEMBER_JOINED',
        title: `${m.name} joined as ${m.designation || 'Team Member'}`,
        department: m.departmentId?.name || 'General',
        timestamp: m.createdAt
      }))
    };
  }
}

export const dashboardService = new DashboardService();
