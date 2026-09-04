import { User } from '../modules/users/user.model.js';
import { TeamMember } from '../modules/team-members/teamMember.model.js';
import { Role } from '../modules/roles/role.model.js';
import { Department } from '../modules/departments/department.model.js';
import { EmployeeProfile } from '../modules/employee-profile/employeeProfile.model.js';
import { Template } from '../modules/templates/template.model.js';
import { hashPassword } from '../utils/hash.util.js';
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
      employeeId: 'EMP-001',
      name: 'Rajat Chaturvedi',
      designation: 'Founder & CEO',
      departmentId: execDept?._id || null,
      roleId: superAdminRole._id,
      status: 'active',
      joiningDate: new Date('2024-01-01')
    });
  } else {
    member.name = 'Rajat Chaturvedi';
    member.designation = 'Founder & CEO';
    await member.save();
  }

  const founderData = {
    headline: 'Founder & CEO | OneWinq Technologies Pvt. Ltd. | Building One Identity Ecosystem',
    bio: 'Visionary leader and entrepreneur passionate about technology, identity and building impactful solutions.',
    workEmail: 'rajat@onewinq.in',
    phone: '+91 731 123 4507',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop',
    collaborationNote: 'Open for collaboration, speaking opportunities and new ideas.',
    overviewStats: {
      connectionsCount: '248',
      projectsCount: '25+',
      yearsOfExperience: '8+',
      servicesCount: '5+'
    },
    location: { city: 'Indore', country: 'India' },
    journey: [
      {
        year: '2024',
        title: 'Founded OneWinq',
        description: 'Founded OneWinq with a vision to simplify digital identity and networking.',
        icon: 'rocket',
        order: 1,
        isVisible: true
      },
      {
        year: '2022',
        title: 'SaaS & AI Leadership',
        description: 'Worked on multiple SaaS products and AI solutions.',
        icon: 'briefcase',
        order: 2,
        isVisible: true
      },
      {
        year: '2019',
        title: 'Engineering & Developer Journey',
        description: 'Started journey as developer and tech enthusiast.',
        icon: 'code',
        order: 3,
        isVisible: true
      },
      {
        year: '2016',
        title: 'Graduated & Explored Entrepreneurship',
        description: 'Graduated and began exploring entrepreneurship and emerging tech.',
        icon: 'award',
        order: 4,
        isVisible: true
      }
    ],
    experience: [
      {
        title: 'Founder & CEO',
        company: 'OneWinq Technologies Pvt. Ltd.',
        location: 'Indore, India',
        startDate: new Date('2024-01-01'),
        isCurrent: true,
        description: '8+ years in product development, team building and technology innovation.',
        order: 1
      }
    ],
    skills: [
      { name: 'Digital Identity - Networking', category: 'Expertise', proficiencyLevel: 'Expert', order: 1 },
      { name: 'AI - SaaS', category: 'Expertise', proficiencyLevel: 'Expert', order: 2 },
      { name: 'Product Strategy', category: 'Expertise', proficiencyLevel: 'Expert', order: 3 },
      { name: 'Leadership', category: 'Expertise', proficiencyLevel: 'Expert', order: 4 },
      { name: 'Business Growth', category: 'Expertise', proficiencyLevel: 'Expert', order: 5 }
    ],
    projects: [
      {
        title: 'OneWinq Platform',
        description: 'Building a complete digital identity ecosystem.',
        status: 'ongoing',
        badge: 'Flagship',
        role: 'Founder & Architect',
        order: 1
      },
      {
        title: 'NFC & ID Solutions',
        description: 'Empowering professionals and businesses with smart cards.',
        status: 'completed',
        badge: 'Smart Hardware',
        role: 'Product Lead',
        order: 2
      },
      {
        title: 'AI Automation',
        description: 'Creating smart assistant for businesses.',
        status: 'completed',
        badge: 'AI & Bot',
        role: 'AI Architect',
        order: 3
      }
    ],
    impactMetrics: [
      { metric: '500+', label: 'Businesses Connected', order: 1 },
      { metric: '25+', label: 'Team Members', order: 2 },
      { metric: 'Multiple', label: 'Products Launched', order: 3 }
    ],
    achievements: [
      {
        title: 'Founder of OneWinq',
        subtitle: 'Building identity ecosystem',
        badge: 'Leadership',
        icon: 'award',
        isFeatured: true,
        order: 1
      },
      {
        title: 'Featured in Tech Media',
        subtitle: 'For innovation & leadership',
        badge: 'Media',
        icon: 'newspaper',
        isFeatured: true,
        order: 2
      },
      {
        title: '500+ Businesses Trust',
        subtitle: 'Our products and services',
        badge: 'Adoption',
        icon: 'users',
        isFeatured: true,
        order: 3
      },
      {
        title: 'Speaker & Mentor',
        subtitle: 'Guiding startups & students',
        badge: 'Mentorship',
        icon: 'microphone',
        isFeatured: true,
        order: 4
      }
    ],
    socialLinks: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/rajatchaturvedi', isVisible: true, order: 1 },
      { platform: 'Twitter', url: 'https://twitter.com/rajat_onewinq', isVisible: true, order: 2 }
    ]
  };

  await EmployeeProfile.findOneAndUpdate(
    { memberId: member._id },
    {
      memberId: member._id,
      userId: superAdminUser._id,
      slug: 'rajat-chaturvedi',
      templateId: founderTemplate._id,
      templateVersion: founderTemplate.version,
      visibility: 'public',
      approvalStatus: 'approved',
      published: founderData,
      draft: founderData
    },
    { upsert: true, new: true }
  );

  const updatedProfile = await EmployeeProfile.findOne({ memberId: member._id });
  member.profileId = updatedProfile._id;
  member.profileCompletionScore = updatedProfile.calculateCompletionScore();
  await member.save();

  logger.info('✅ Seeded Super Administrator (Founder: Rajat Chaturvedi) successfully.');
};
