import { User } from '../modules/users/user.model.js';
import { TeamMember } from '../modules/team-members/teamMember.model.js';
import { Role } from '../modules/roles/role.model.js';
import { Department } from '../modules/departments/department.model.js';
import { EmployeeProfile } from '../modules/employee-profile/employeeProfile.model.js';
import { Template } from '../modules/templates/template.model.js';
import { hashPassword } from '../../utils/hash.util.js';
import { SYSTEM_ROLES } from '../constants/roles.constant.js';
import { logger } from '../config/logger.config.js';

export const seedSuperAdmin = async () => {
  logger.info('Seeding super administrator...');

  const superAdminEmail = 'superadmin@onewinq.com';
  const superAdminPassword = 'OneWinq@Admin2026!';

  let superAdminUser = await User.findOne({ email: superAdminEmail });
  if (!superAdminUser) {
    const passwordHash = await hashPassword(superAdminPassword);
    superAdminUser = await User.create({
      email: superAdminEmail,
      passwordHash,
      status: 'active',
      emailVerified: true,
      emailVerifiedAt: new Date()
    });
  }

  const superAdminRole = await Role.findOne({ name: SYSTEM_ROLES.SUPER_ADMIN });
  const execDept = await Department.findOne({ slug: 'executive-leadership' });
  const founderTemplate = (await Template.findOne({ category: 'founder' })) || (await Template.findOne({ isDefault: true }));

  let member = await TeamMember.findOne({ userId: superAdminUser._id });
  if (!member) {
    member = await TeamMember.create({
      userId: superAdminUser._id,
      employeeId: 'OWQ-001',
      name: 'Super Administrator',
      designation: 'Chief Executive Officer & Founder',
      departmentId: execDept?._id || null,
      roleId: superAdminRole._id,
      status: 'active',
      joiningDate: new Date('2024-01-01')
    });
  }

  let profile = await EmployeeProfile.findOne({ memberId: member._id });
  if (!profile) {
    profile = await EmployeeProfile.create({
      memberId: member._id,
      userId: superAdminUser._id,
      slug: 'superadmin',
      templateId: founderTemplate._id,
      templateVersion: founderTemplate.version,
      visibility: 'public',
      approvalStatus: 'approved',
      published: {
        headline: 'Founder & CEO at OneWinq | Enterprise Identity Architect',
        bio: 'Building the next-generation digital presence and verified credential systems for global modern organizations.',
        workEmail: superAdminUser.email,
        phone: '+1 (555) 901-2030',
        location: { city: 'San Francisco', country: 'United States' },
        experience: [
          {
            title: 'Chief Executive Officer',
            company: 'OneWinq',
            location: 'San Francisco, CA',
            startDate: new Date('2024-01-01'),
            isCurrent: true,
            description: 'Leading global strategy, product innovation, and company growth.',
            order: 1
          }
        ],
        skills: [
          { name: 'Executive Leadership', category: 'Management', proficiencyLevel: 'Expert', order: 1 },
          { name: 'System Architecture', category: 'Technology', proficiencyLevel: 'Expert', order: 2 },
          { name: 'Enterprise Strategy', category: 'Strategy', proficiencyLevel: 'Expert', order: 3 }
        ],
        projects: [
          {
            title: 'OneWinq Identity Core',
            description: 'Architected and launched the flagship digital card and identity engine.',
            role: 'Product Architect',
            technologies: ['Node.js', 'MongoDB', 'Distributed Systems'],
            order: 1
          }
        ],
        achievements: [
          {
            title: 'Top Enterprise Innovator 2025',
            issuer: 'Tech Leaders Global',
            issueDate: new Date('2025-06-15'),
            description: 'Recognized for pioneering decentralized employee credentialing.',
            order: 1
          }
        ],
        socialLinks: [
          { platform: 'LinkedIn', url: 'https://linkedin.com/in/onewinq-founder', isVisible: true, order: 1 },
          { platform: 'X', url: 'https://x.com/onewinq_ceo', isVisible: true, order: 2 }
        ]
      },
      draft: {
        headline: 'Founder & CEO at OneWinq | Enterprise Identity Architect',
        bio: 'Building the next-generation digital presence and verified credential systems for global modern organizations.',
        workEmail: superAdminUser.email,
        phone: '+1 (555) 901-2030',
        location: { city: 'San Francisco', country: 'United States' },
        experience: [
          {
            title: 'Chief Executive Officer',
            company: 'OneWinq',
            location: 'San Francisco, CA',
            startDate: new Date('2024-01-01'),
            isCurrent: true,
            description: 'Leading global strategy, product innovation, and company growth.',
            order: 1
          }
        ],
        skills: [
          { name: 'Executive Leadership', category: 'Management', proficiencyLevel: 'Expert', order: 1 },
          { name: 'System Architecture', category: 'Technology', proficiencyLevel: 'Expert', order: 2 }
        ],
        socialLinks: [
          { platform: 'LinkedIn', url: 'https://linkedin.com/in/onewinq-founder', isVisible: true, order: 1 }
        ]
      }
    });

    member.profileId = profile._id;
    member.profileCompletionScore = profile.calculateCompletionScore();
    await member.save();
  }

  logger.info(`✅ Seeded Super Admin: ${superAdminEmail} (Password: ${superAdminPassword})`);
};
