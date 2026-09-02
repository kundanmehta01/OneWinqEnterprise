import { User } from '../modules/users/user.model.js';
import { TeamMember } from '../modules/team-members/teamMember.model.js';
import { Role } from '../modules/roles/role.model.js';
import { Department } from '../modules/departments/department.model.js';
import { EmployeeProfile } from '../modules/employee-profile/employeeProfile.model.js';
import { Template } from '../modules/templates/template.model.js';
import { hashPassword } from '../../utils/hash.util.js';
import { SYSTEM_ROLES } from '../constants/roles.constant.js';
import { logger } from '../config/logger.config.js';

export const seedSampleMembers = async () => {
  logger.info('Seeding sample team members and employee profiles...');

  const employeeRole = await Role.findOne({ name: SYSTEM_ROLES.EMPLOYEE });
  const hrAdminRole = await Role.findOne({ name: SYSTEM_ROLES.HR_ADMIN });
  const contentAdminRole = await Role.findOne({ name: SYSTEM_ROLES.CONTENT_ADMIN });

  const engDept = await Department.findOne({ slug: 'engineering-technology' });
  const prodDept = await Department.findOne({ slug: 'product-design' });
  const hrDept = await Department.findOne({ slug: 'people-human-resources' });

  const techTemplate = (await Template.findOne({ category: 'employee' })) || (await Template.findOne({ isDefault: true }));
  const leadershipTemplate = (await Template.findOne({ category: 'leadership' })) || techTemplate;

  const defaultPasswordHash = await hashPassword('Employee@2026!');

  const sampleMembers = [
    {
      email: 'alex.morgan@onewinq.com',
      employeeId: 'OWQ-002',
      name: 'Alex Morgan',
      designation: 'VP of Product & Design',
      departmentId: prodDept?._id,
      roleId: contentAdminRole?._id || employeeRole._id,
      slug: 'alex-morgan',
      templateId: leadershipTemplate._id,
      headline: 'VP of Product | Design Systems & Enterprise UX Leader',
      bio: 'Over 12 years of experience crafting intuitive enterprise web applications and scalable design systems.',
      skills: [
        { name: 'Product Strategy', category: 'Product', proficiencyLevel: 'Expert', order: 1 },
        { name: 'UI/UX Design', category: 'Design', proficiencyLevel: 'Expert', order: 2 },
        { name: 'Design Systems', category: 'Design', proficiencyLevel: 'Expert', order: 3 }
      ],
      experience: [
        {
          title: 'VP of Product',
          company: 'OneWinq',
          location: 'San Francisco, CA',
          startDate: new Date('2024-02-01'),
          isCurrent: true,
          description: 'Leading product management, design system architecture, and UX research.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/alex-morgan-product', isVisible: true, order: 1 },
        { platform: 'Dribbble', url: 'https://dribbble.com/alexmorgan', isVisible: true, order: 2 }
      ]
    },
    {
      email: 'priya.patel@onewinq.com',
      employeeId: 'OWQ-003',
      name: 'Priya Patel',
      designation: 'Principal Software Architect',
      departmentId: engDept?._id,
      roleId: employeeRole._id,
      slug: 'priya-patel',
      templateId: techTemplate._id,
      headline: 'Principal Backend Architect | Distributed Systems & High-Scale APIs',
      bio: 'Passionate about backend performance, clean architecture, Node.js, and high-throughput micro-monolith systems.',
      skills: [
        { name: 'Node.js', category: 'Backend', proficiencyLevel: 'Expert', order: 1 },
        { name: 'MongoDB', category: 'Database', proficiencyLevel: 'Expert', order: 2 },
        { name: 'System Design', category: 'Architecture', proficiencyLevel: 'Expert', order: 3 },
        { name: 'Cloud Infrastructure', category: 'DevOps', proficiencyLevel: 'Advanced', order: 4 }
      ],
      experience: [
        {
          title: 'Principal Software Architect',
          company: 'OneWinq',
          location: 'San Francisco, CA',
          startDate: new Date('2024-03-15'),
          isCurrent: true,
          description: 'Architecting the core digital profile runtime, caching layers, and security frameworks.',
          order: 1
        }
      ],
      projects: [
        {
          title: 'High-Performance Profile Engine',
          description: 'Sub-10ms profile delivery API with global edge caching and QR telemetry.',
          role: 'Lead Architect',
          technologies: ['Node.js', 'Express', 'MongoDB'],
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com/priyapatel-tech', isVisible: true, order: 1 },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/priya-patel-architect', isVisible: true, order: 2 }
      ]
    },
    {
      email: 'sarah.jenkins@onewinq.com',
      employeeId: 'OWQ-004',
      name: 'Sarah Jenkins',
      designation: 'Head of People & Culture',
      departmentId: hrDept?._id,
      roleId: hrAdminRole?._id || employeeRole._id,
      slug: 'sarah-jenkins',
      templateId: leadershipTemplate._id,
      headline: 'Head of People | Talent Strategy & Workplace Culture',
      bio: 'Dedicated to building high-performing, inclusive remote-first teams and modern onboarding workflows.',
      skills: [
        { name: 'People Operations', category: 'HR', proficiencyLevel: 'Expert', order: 1 },
        { name: 'Talent Acquisition', category: 'HR', proficiencyLevel: 'Expert', order: 2 },
        { name: 'Culture & Engagement', category: 'HR', proficiencyLevel: 'Expert', order: 3 }
      ],
      experience: [
        {
          title: 'Head of People',
          company: 'OneWinq',
          location: 'New York, NY',
          startDate: new Date('2024-04-01'),
          isCurrent: true,
          description: 'Managing company-wide recruitment, onboarding experiences, and talent development.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/sarah-jenkins-people', isVisible: true, order: 1 }
      ]
    }
  ];

  for (const mData of sampleMembers) {
    let user = await User.findOne({ email: mData.email });
    if (!user) {
      user = await User.create({
        email: mData.email,
        passwordHash: defaultPasswordHash,
        status: 'active',
        emailVerified: true,
        emailVerifiedAt: new Date()
      });
    }

    let member = await TeamMember.findOne({ employeeId: mData.employeeId });
    if (!member) {
      member = await TeamMember.create({
        userId: user._id,
        employeeId: mData.employeeId,
        name: mData.name,
        designation: mData.designation,
        departmentId: mData.departmentId,
        roleId: mData.roleId,
        status: 'active',
        joiningDate: new Date()
      });
    }

    let profile = await EmployeeProfile.findOne({ memberId: member._id });
    if (!profile) {
      profile = await EmployeeProfile.create({
        memberId: member._id,
        userId: user._id,
        slug: mData.slug,
        templateId: mData.templateId,
        templateVersion: 1,
        visibility: 'public',
        approvalStatus: 'approved',
        published: {
          headline: mData.headline,
          bio: mData.bio,
          workEmail: user.email,
          experience: mData.experience || [],
          skills: mData.skills || [],
          projects: mData.projects || [],
          socialLinks: mData.socialLinks || []
        },
        draft: {
          headline: mData.headline,
          bio: mData.bio,
          workEmail: user.email,
          experience: mData.experience || [],
          skills: mData.skills || [],
          projects: mData.projects || [],
          socialLinks: mData.socialLinks || []
        }
      });

      member.profileId = profile._id;
      member.profileCompletionScore = profile.calculateCompletionScore();
      await member.save();
    }
  }

  logger.info(`✅ Seeded ${sampleMembers.length} sample team members & public profiles successfully.`);
};
