import request from 'supertest';
import { createApp } from '../src/app.js';
import { User } from '../src/modules/users/user.model.js';
import { TeamMember } from '../src/modules/team-members/teamMember.model.js';
import { EmployeeProfile } from '../src/modules/employee-profile/employeeProfile.model.js';
import { Template } from '../src/modules/templates/template.model.js';
import { Role } from '../src/modules/roles/role.model.js';
import { hashPassword } from '../src/utils/hash.util.js';
import { generateAccessToken } from '../src/utils/token.util.js';
import { SYSTEM_ROLES } from '../src/constants/roles.constant.js';

describe('Employee Profile Draft & Submission Workflow Tests', () => {
  let app;
  let user;
  let member;
  let profile;
  let token;

  beforeAll(async () => {
    app = createApp();

    const role = await Role.findOne({ name: SYSTEM_ROLES.EMPLOYEE });
    const template = await Template.findOne({ isDefault: true });
    const passwordHash = await hashPassword('Password@123');

    user = await User.create({
      email: 'profile.test@onewinq.com',
      passwordHash,
      status: 'active',
      emailVerified: true
    });

    member = await TeamMember.create({
      userId: user._id,
      employeeId: 'PROF-001',
      name: 'Profile Tester',
      designation: 'Developer',
      roleId: role._id,
      status: 'active'
    });

    profile = await EmployeeProfile.create({
      memberId: member._id,
      userId: user._id,
      slug: 'profile-tester',
      templateId: template._id,
      visibility: 'public',
      approvalStatus: 'approved',
      published: {
        headline: 'Original Headline',
        bio: 'Original Bio'
      },
      draft: {
        headline: 'Original Headline',
        bio: 'Original Bio'
      }
    });

    member.profileId = profile._id;
    await member.save();

    token = generateAccessToken({ userId: user._id.toString(), email: user.email });
  });

  it('GET /api/v1/me/profile - should return current user profile with draft and published data', async () => {
    const res = await request(app)
      .get('/api/v1/me/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('profile-tester');
    expect(res.body.data.published.headline).toBe('Original Headline');
  });

  it('PATCH /api/v1/me/profile - should update draft without modifying published profile', async () => {
    const res = await request(app)
      .get('/api/v1/me/profile')
      .set('Authorization', `Bearer ${token}`);

    const patchRes = await request(app)
      .patch('/api/v1/me/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        headline: 'New Proposed Headline',
        bio: 'New Updated Bio',
        skills: [{ name: 'TypeScript / JavaScript', category: 'Dev', proficiencyLevel: 'Expert', order: 1 }]
      });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.success).toBe(true);
    expect(patchRes.body.data.draft.headline).toBe('New Proposed Headline');
    expect(patchRes.body.data.published.headline).toBe('Original Headline'); // Published remains unchanged!
  });

  it('POST /api/v1/me/profile/submit - should submit draft for approval and lock profile', async () => {
    const res = await request(app)
      .post('/api/v1/me/profile/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({ note: 'Please review my new skills and headline' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.approvalId).toBeDefined();
    expect(res.body.data.diffSummary.length).toBeGreaterThan(0);

    // Profile should now be locked
    const checkRes = await request(app)
      .get('/api/v1/me/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(checkRes.body.data.isLocked).toBe(true);
    expect(checkRes.body.data.approvalStatus).toBe('pending_review');
  });

  it('PATCH /api/v1/me/profile - should reject draft edits when profile is locked under review', async () => {
    const res = await request(app)
      .patch('/api/v1/me/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ headline: 'Another Change' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('PROFILE_LOCKED');
  });
});
