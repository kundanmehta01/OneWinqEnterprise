import request from 'supertest';
import { createApp } from '../src/app.js';
import { User } from '../src/modules/users/user.model.js';
import { TeamMember } from '../src/modules/team-members/teamMember.model.js';
import { EmployeeProfile } from '../src/modules/employee-profile/employeeProfile.model.js';
import { ProfileApproval } from '../src/modules/profile-approvals/profileApproval.model.js';
import { Template } from '../src/modules/templates/template.model.js';
import { Role } from '../src/modules/roles/role.model.js';
import { hashPassword } from '../src/utils/hash.util.js';
import { generateAccessToken } from '../src/utils/token.util.js';
import { SYSTEM_ROLES } from '../src/constants/roles.constant.js';

describe('Profile Approvals & Review Lifecycle Tests', () => {
  let app;
  let adminToken;
  let approvalId;
  let profileDoc;

  beforeAll(async () => {
    app = createApp();

    const superAdminRole = await Role.findOne({ name: SYSTEM_ROLES.SUPER_ADMIN });
    const employeeRole = await Role.findOne({ name: SYSTEM_ROLES.EMPLOYEE });
    const template = await Template.findOne({ isDefault: true });
    const passwordHash = await hashPassword('AdminPass@123');

    // Admin user
    const adminUser = await User.create({
      email: 'approver.admin@onewinq.com',
      passwordHash,
      status: 'active',
      emailVerified: true
    });
    await TeamMember.create({
      userId: adminUser._id,
      employeeId: 'APPR-ADM-01',
      name: 'Approval Admin',
      designation: 'Admin Lead',
      roleId: superAdminRole._id,
      status: 'active'
    });
    adminToken = generateAccessToken({ userId: adminUser._id.toString(), email: adminUser.email });

    // Submitting employee
    const empUser = await User.create({
      email: 'submitting.emp@onewinq.com',
      passwordHash,
      status: 'active',
      emailVerified: true
    });
    const empMember = await TeamMember.create({
      userId: empUser._id,
      employeeId: 'SUB-EMP-01',
      name: 'Submitting Employee',
      designation: 'Staff Designer',
      roleId: employeeRole._id,
      status: 'active'
    });

    profileDoc = await EmployeeProfile.create({
      memberId: empMember._id,
      userId: empUser._id,
      slug: 'submitting-employee',
      templateId: template._id,
      approvalStatus: 'pending_review',
      isLocked: true,
      published: {
        headline: 'Junior Designer'
      },
      draft: {
        headline: 'Senior Lead Product Designer',
        bio: 'Promoted to lead product designer.'
      }
    });

    const approval = await ProfileApproval.create({
      memberId: empMember._id,
      profileId: profileDoc._id,
      submittedBy: empUser._id,
      status: 'pending',
      diffSummary: [
        { field: 'headline', oldValue: 'Junior Designer', newValue: 'Senior Lead Product Designer' }
      ],
      draftSnapshot: profileDoc.draft.toObject()
    });

    approvalId = approval._id;
  });

  it('GET /api/v1/admin/approvals - should list pending approval requests', async () => {
    const res = await request(app)
      .get('/api/v1/admin/approvals?status=pending')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/admin/approvals/:id/review - should approve changes and publish draft to live profile', async () => {
    const res = await request(app)
      .post(`/api/v1/admin/approvals/${approvalId}/review`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        action: 'approve',
        reviewNote: 'Congratulations on the promotion!'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('approved');

    // Verify profile document in DB is now published and unlocked
    const updatedProfile = await EmployeeProfile.findById(profileDoc._id);
    expect(updatedProfile.approvalStatus).toBe('approved');
    expect(updatedProfile.isLocked).toBe(false);
    expect(updatedProfile.published.headline).toBe('Senior Lead Product Designer');
  });
});
