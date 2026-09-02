import request from 'supertest';
import { createApp } from '../src/app.js';
import { User } from '../src/modules/users/user.model.js';
import { TeamMember } from '../src/modules/team-members/teamMember.model.js';
import { EmployeeProfile } from '../src/modules/employee-profile/employeeProfile.model.js';
import { Template } from '../src/modules/templates/template.model.js';
import { Role } from '../src/modules/roles/role.model.js';
import { hashPassword } from '../src/utils/hash.util.js';
import { SYSTEM_ROLES } from '../src/constants/roles.constant.js';

describe('Public Gateway & Profile Telemetry Tests', () => {
  let app;
  let publicSlug = 'public-rockstar';
  let privateSlug = 'private-person';

  beforeAll(async () => {
    app = createApp();

    const role = await Role.findOne({ name: SYSTEM_ROLES.EMPLOYEE });
    const template = await Template.findOne({ isDefault: true });
    const passwordHash = await hashPassword('Password@123');

    // 1. Public Member
    const pubUser = await User.create({
      email: 'public.star@onewinq.com',
      passwordHash,
      status: 'active',
      emailVerified: true
    });
    const pubMember = await TeamMember.create({
      userId: pubUser._id,
      employeeId: 'PUB-001',
      name: 'Public Rockstar',
      designation: 'Growth Lead',
      roleId: role._id,
      status: 'active'
    });
    await EmployeeProfile.create({
      memberId: pubMember._id,
      userId: pubUser._id,
      slug: publicSlug,
      templateId: template._id,
      visibility: 'public',
      approvalStatus: 'approved',
      published: {
        headline: 'Leading Growth & Enterprise Brand Presence',
        bio: 'Empowering companies to grow.',
        socialLinks: [{ platform: 'LinkedIn', url: 'https://linkedin.com', isVisible: true }]
      }
    });

    // 2. Private Member
    const privUser = await User.create({
      email: 'private.user@onewinq.com',
      passwordHash,
      status: 'active',
      emailVerified: true
    });
    const privMember = await TeamMember.create({
      userId: privUser._id,
      employeeId: 'PRIV-001',
      name: 'Private Person',
      designation: 'Internal Auditor',
      roleId: role._id,
      status: 'active'
    });
    await EmployeeProfile.create({
      memberId: privMember._id,
      userId: privUser._id,
      slug: privateSlug,
      templateId: template._id,
      visibility: 'private',
      approvalStatus: 'approved',
      published: {
        headline: 'Private Headline'
      }
    });
  });

  it('GET /api/v1/public/company - should return public company profile', async () => {
    const res = await request(app).get('/api/v1/public/company');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('OneWinq');
    expect(res.body.data.slug).toBe('onewinq');
    expect(res.body.data.branding).toBeDefined();
    // Ensure no internal database fields leaked
    expect(res.body.data.passwordHash).toBeUndefined();
  });

  it('GET /api/v1/public/profiles/:slug - should return published profile and QR code for public user', async () => {
    const res = await request(app).get(`/api/v1/public/profiles/${publicSlug}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Public Rockstar');
    expect(res.body.data.headline).toBe('Leading Growth & Enterprise Brand Presence');
    expect(res.body.data.qrCode).toBeDefined();
    expect(res.body.data.publicUrl).toBeDefined();
  });

  it('GET /api/v1/public/profiles/:slug - should return 404 for private profile', async () => {
    const res = await request(app).get(`/api/v1/public/profiles/${privateSlug}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/public/events - should record public interaction telemetry event', async () => {
    const res = await request(app)
      .post('/api/v1/public/events')
      .send({
        eventType: 'QR_SCAN',
        targetType: 'EMPLOYEE',
        slug: publicSlug,
        metadata: { source: 'badge_nfc' }
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
