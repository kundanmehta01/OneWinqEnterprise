import request from 'supertest';
import { createApp } from '../src/app.js';
import { User } from '../src/modules/users/user.model.js';
import { TeamMember } from '../src/modules/team-members/teamMember.model.js';
import { Role } from '../src/modules/roles/role.model.js';
import { Invitation } from '../src/modules/invitations/invitation.model.js';
import { hashPassword } from '../src/utils/hash.util.js';
import { generateAccessToken } from '../src/utils/token.util.js';
import { SYSTEM_ROLES } from '../src/constants/roles.constant.js';

describe('Invitation System & Onboarding Flow Tests', () => {
  let app;
  let adminToken;
  let employeeRoleId;

  beforeAll(async () => {
    app = createApp();

    const superAdminRole = await Role.findOne({ name: SYSTEM_ROLES.SUPER_ADMIN });
    const empRole = await Role.findOne({ name: SYSTEM_ROLES.EMPLOYEE });
    employeeRoleId = empRole._id.toString();

    const passwordHash = await hashPassword('AdminPass@123');
    const adminUser = await User.create({
      email: 'invite.admin@onewinq.com',
      passwordHash,
      status: 'active',
      emailVerified: true
    });
    await TeamMember.create({
      userId: adminUser._id,
      employeeId: 'INV-ADM-01',
      name: 'Invite Admin',
      designation: 'HR Lead',
      roleId: superAdminRole._id,
      status: 'active'
    });
    adminToken = generateAccessToken({ userId: adminUser._id.toString(), email: adminUser.email });
  });

  it('POST /api/v1/invitations - admin should create and send an employee invitation', async () => {
    const res = await request(app)
      .post('/api/v1/invitations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'new.candidate@onewinq.com',
        name: 'New Candidate',
        designation: 'Senior Backend Engineer',
        roleId: employeeRoleId
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('new.candidate@onewinq.com');
    expect(res.body.data.status).toBe('pending');
  });

  it('POST /api/v1/invitations/accept - invited employee accepts invitation and activates account', async () => {
    // 1. Create invitation directly to get raw token
    const createRes = await request(app)
      .post('/api/v1/invitations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'accept.test@onewinq.com',
        name: 'Accept Tester',
        designation: 'Product Designer',
        roleId: employeeRoleId
      });

    const inviteDoc = await Invitation.findById(createRes.body.data._id);
    expect(inviteDoc).toBeDefined();

    // Since in test mode the token was hashed, let's create a known raw token test
    const { generateRandomToken, hashToken } = await import('../src/utils/token.util.js');
    const rawToken = generateRandomToken(32);
    inviteDoc.tokenHash = hashToken(rawToken);
    await inviteDoc.save();

    // 2. Verify token
    const verifyRes = await request(app)
      .get(`/api/v1/invitations/verify?token=${rawToken}`);

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);
    expect(verifyRes.body.data.email).toBe('accept.test@onewinq.com');

    // 3. Accept invitation
    const acceptRes = await request(app)
      .post('/api/v1/invitations/accept')
      .send({
        token: rawToken,
        password: 'SecurePassword@2026',
        name: 'Accept Tester Verified'
      });

    expect(acceptRes.status).toBe(201);
    expect(acceptRes.body.success).toBe(true);
    expect(acceptRes.body.data.accessToken).toBeDefined();
    expect(acceptRes.body.data.user.email).toBe('accept.test@onewinq.com');
    expect(acceptRes.body.data.member.name).toBe('Accept Tester Verified');
    expect(acceptRes.body.data.profile.slug).toBeDefined();

    // 4. Accepting again should be rejected with 400
    const duplicateAcceptRes = await request(app)
      .post('/api/v1/invitations/accept')
      .send({
        token: rawToken,
        password: 'SecurePassword@2026'
      });

    expect(duplicateAcceptRes.status).toBe(400);
  });
});
