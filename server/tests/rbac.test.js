import request from 'supertest';
import { createApp } from '../src/app.js';
import { User } from '../src/modules/users/user.model.js';
import { TeamMember } from '../src/modules/team-members/teamMember.model.js';
import { Role } from '../src/modules/roles/role.model.js';
import { hashPassword } from '../src/utils/hash.util.js';
import { generateAccessToken } from '../src/utils/token.util.js';
import { SYSTEM_ROLES } from '../src/constants/roles.constant.js';

describe('RBAC & Authorization Security Tests', () => {
  let app;
  let employeeToken;
  let adminToken;

  beforeAll(async () => {
    app = createApp();

    const employeeRole = await Role.findOne({ name: SYSTEM_ROLES.EMPLOYEE });
    const superAdminRole = await Role.findOne({ name: SYSTEM_ROLES.SUPER_ADMIN });

    const passwordHash = await hashPassword('SecurePass123!');

    // Employee
    const empUser = await User.create({
      email: 'emp.rbac@onewinq.com',
      passwordHash,
      status: 'active',
      emailVerified: true
    });
    await TeamMember.create({
      userId: empUser._id,
      employeeId: 'RBAC-EMP-01',
      name: 'RBAC Employee',
      designation: 'Staff',
      roleId: employeeRole._id,
      status: 'active'
    });
    employeeToken = generateAccessToken({ userId: empUser._id.toString(), email: empUser.email });

    // Super Admin
    const adminUser = await User.create({
      email: 'admin.rbac@onewinq.com',
      passwordHash,
      status: 'active',
      emailVerified: true
    });
    await TeamMember.create({
      userId: adminUser._id,
      employeeId: 'RBAC-ADM-01',
      name: 'RBAC Admin',
      designation: 'Admin',
      roleId: superAdminRole._id,
      status: 'active'
    });
    adminToken = generateAccessToken({ userId: adminUser._id.toString(), email: adminUser.email });
  });

  it('GET /api/v1/admin/team - should block standard employee with 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/v1/admin/team')
      .set('Authorization', `Bearer ${employeeToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INSUFFICIENT_PERMISSIONS');
  });

  it('GET /api/v1/admin/team - should allow Super Admin to access', async () => {
    const res = await request(app)
      .get('/api/v1/admin/team')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/admin/settings - should block unauthenticated request with 401', async () => {
    const res = await request(app).get('/api/v1/admin/settings');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
