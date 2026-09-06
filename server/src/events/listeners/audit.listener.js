import { eventBus } from '../appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';
import { auditLogService } from '../../modules/audit-logs/auditLog.service.js';

export const registerAuditListeners = () => {
  // Map of events to their module and default resource types
  const eventConfig = {
    [APP_EVENTS.USER_LOGGED_IN]: { module: 'auth', resourceType: 'User' },
    [APP_EVENTS.USER_PASSWORD_RESET]: { module: 'auth', resourceType: 'User' },
    [APP_EVENTS.MEMBER_INVITED]: { module: 'invitations', resourceType: 'Invitation' },
    [APP_EVENTS.MEMBER_JOINED]: { module: 'team', resourceType: 'TeamMember' },
    [APP_EVENTS.MEMBER_UPDATED]: { module: 'team', resourceType: 'TeamMember' },
    [APP_EVENTS.MEMBER_ARCHIVED]: { module: 'team', resourceType: 'TeamMember' },
    [APP_EVENTS.MEMBER_DELETED]: { module: 'team', resourceType: 'TeamMember' },
    [APP_EVENTS.MEMBER_RESTORED]: { module: 'team', resourceType: 'TeamMember' },
    [APP_EVENTS.ROLE_CREATED]: { module: 'roles', resourceType: 'Role' },
    [APP_EVENTS.ROLE_UPDATED]: { module: 'roles', resourceType: 'Role' },
    [APP_EVENTS.ROLE_DELETED]: { module: 'roles', resourceType: 'Role' },
    [APP_EVENTS.DEPARTMENT_CREATED]: { module: 'departments', resourceType: 'Department' },
    [APP_EVENTS.DEPARTMENT_UPDATED]: { module: 'departments', resourceType: 'Department' },
    [APP_EVENTS.DEPARTMENT_ARCHIVED]: { module: 'departments', resourceType: 'Department' },
    [APP_EVENTS.COMPANY_PROFILE_UPDATED]: { module: 'company_profile', resourceType: 'CompanyProfile' },
    [APP_EVENTS.PROFILE_SUBMITTED]: { module: 'profile_approvals', resourceType: 'ProfileApproval' },
    [APP_EVENTS.PROFILE_APPROVED]: { module: 'profile_approvals', resourceType: 'ProfileApproval' },
    [APP_EVENTS.PROFILE_REJECTED]: { module: 'profile_approvals', resourceType: 'ProfileApproval' },
    [APP_EVENTS.PROFILE_CHANGES_REQUESTED]: { module: 'profile_approvals', resourceType: 'ProfileApproval' },
    [APP_EVENTS.TEMPLATE_CREATED]: { module: 'templates', resourceType: 'Template' },
    [APP_EVENTS.TEMPLATE_UPDATED]: { module: 'templates', resourceType: 'Template' },
    [APP_EVENTS.TEMPLATE_DELETED]: { module: 'templates', resourceType: 'Template' },
    [APP_EVENTS.SETTINGS_UPDATED]: { module: 'settings', resourceType: 'OrganizationSettings' },
    [APP_EVENTS.EVENT_CREATED]: { module: 'events', resourceType: 'Event' },
    [APP_EVENTS.EVENT_UPDATED]: { module: 'events', resourceType: 'Event' },
    [APP_EVENTS.EVENT_CANCELLED]: { module: 'events', resourceType: 'Event' },
    [APP_EVENTS.EVENT_REGISTERED]: { module: 'events', resourceType: 'EventRegistration' },
    [APP_EVENTS.CONNECTION_REQUESTED]: { module: 'connections', resourceType: 'Connection' },
    [APP_EVENTS.CONNECTION_ACCEPTED]: { module: 'connections', resourceType: 'Connection' },
    [APP_EVENTS.SUPPORT_TICKET_CREATED]: { module: 'support', resourceType: 'SupportTicket' }
  };

  for (const [eventName, config] of Object.entries(eventConfig)) {
    eventBus.subscribeEvent(eventName, async (payload) => {
      const context = payload.context || {};
      await auditLogService.log({
        actorId: payload.actorId,
        action: eventName,
        module: config.module,
        resourceType: config.resourceType,
        resourceId: payload.resourceId || payload.memberId || payload.profileId || payload.approvalId,
        previousValue: payload.previousValue,
        newValue: payload.newValue,
        ipAddress: context.ipAddress || payload.ipAddress || '',
        userAgent: context.userAgent || payload.userAgent || '',
        requestId: context.requestId || ''
      });
    });
  }
};
