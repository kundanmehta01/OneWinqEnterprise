import { User } from '../modules/users/user.model.js';
import { TeamMember } from '../modules/team-members/teamMember.model.js';
import { Role } from '../modules/roles/role.model.js';
import { Department } from '../modules/departments/department.model.js';
import { EmployeeProfile } from '../modules/employee-profile/employeeProfile.model.js';
import { Template } from '../modules/templates/template.model.js';
import { hashPassword } from '../utils/hash.util.js';
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
      email: 'himanshu.jain@onewinq.in',
      employeeId: 'EMP-002',
      name: 'Himanshu Jain',
      designation: 'Co-Founder & CTO',
      departmentId: engDept?._id,
      roleId: contentAdminRole?._id || employeeRole._id,
      slug: 'himanshu-jain',
      templateId: leadershipTemplate._id,
      headline: 'Co-Founder & CTO | Distributed Systems & AI Infrastructure',
      bio: 'Co-founder and technology leader passionate about building scalable, secure enterprise identity systems.',
      skills: [
        { name: 'System Architecture', category: 'Engineering', proficiencyLevel: 'Expert', order: 1 },
        { name: 'Cloud Infrastructure', category: 'DevOps', proficiencyLevel: 'Expert', order: 2 },
        { name: 'AI & Data Systems', category: 'AI', proficiencyLevel: 'Expert', order: 3 }
      ],
      journey: [
        { year: '2024', title: 'Co-Founded OneWinq', description: 'Architected the core distributed identity engine.', order: 1 },
        { year: '2021', title: 'Lead Architect at CloudScale', description: 'Scaled microservices to millions of daily requests.', order: 2 }
      ],
      impactMetrics: [
        { metric: '99.99%', label: 'Platform Uptime', order: 1 },
        { metric: '10M+', label: 'API Calls / Mo', order: 2 }
      ],
      experience: [
        {
          title: 'Co-Founder & CTO',
          company: 'OneWinq Technologies Pvt. Ltd.',
          location: 'Indore, India',
          startDate: new Date('2024-01-01'),
          isCurrent: true,
          description: 'Leading all engineering, security infrastructure, and platform scalability.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/himanshu-jain-cto', isVisible: true, order: 1 },
        { platform: 'GitHub', url: 'https://github.com/himanshujain', isVisible: true, order: 2 }
      ]
    },
    {
      email: 'karan.patel@onewinq.in',
      employeeId: 'EMP-003',
      name: 'Karan Patel',
      designation: 'Head of Product',
      departmentId: prodDept?._id,
      roleId: contentAdminRole?._id || employeeRole._id,
      slug: 'karan-patel',
      templateId: leadershipTemplate._id,
      headline: 'Head of Product | Enterprise Identity & SaaS Growth',
      bio: 'Leading product management, UX vision, and feature roadmap for OneWinq enterprise solutions.',
      skills: [
        { name: 'Product Management', category: 'Product', proficiencyLevel: 'Expert', order: 1 },
        { name: 'Growth Strategy', category: 'Strategy', proficiencyLevel: 'Expert', order: 2 },
        { name: 'User Research', category: 'Design', proficiencyLevel: 'Expert', order: 3 }
      ],
      journey: [
        { year: '2024', title: 'Joined OneWinq', description: 'Spearheading product strategy and customer onboarding.', order: 1 }
      ],
      experience: [
        {
          title: 'Head of Product',
          company: 'OneWinq Technologies Pvt. Ltd.',
          location: 'Indore, India',
          startDate: new Date('2024-02-01'),
          isCurrent: true,
          description: 'Driving product vision, cross-functional sprints, and customer feedback loops.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/karanpatel-product', isVisible: true, order: 1 }
      ]
    },
    {
      email: 'neha.singh@onewinq.in',
      employeeId: 'EMP-004',
      name: 'Neha Singh',
      designation: 'UI/UX Designer',
      departmentId: prodDept?._id,
      roleId: employeeRole._id,
      slug: 'neha-singh',
      templateId: techTemplate._id,
      headline: 'UI/UX Designer | Design Systems & Mobile-First Experiences',
      bio: 'Crafting stunning, human-centered digital experiences for next-gen digital identity cards.',
      skills: [
        { name: 'UI/UX Design', category: 'Design', proficiencyLevel: 'Expert', order: 1 },
        { name: 'Figma & Design Systems', category: 'Design', proficiencyLevel: 'Expert', order: 2 },
        { name: 'Mobile Interaction Design', category: 'Design', proficiencyLevel: 'Expert', order: 3 }
      ],
      experience: [
        {
          title: 'UI/UX Designer',
          company: 'OneWinq Technologies Pvt. Ltd.',
          location: 'Indore, India',
          startDate: new Date('2024-03-01'),
          isCurrent: true,
          description: 'Designing elegant, accessible digital business card interfaces and company portals.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/nehasingh-design', isVisible: true, order: 1 },
        { platform: 'Dribbble', url: 'https://dribbble.com/nehasingh', isVisible: true, order: 2 }
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
    const profileData = {
      headline: mData.headline,
      bio: mData.bio,
      workEmail: user.email,
      experience: mData.experience || [],
      journey: mData.journey || [],
      skills: mData.skills || [],
      projects: mData.projects || [],
      impactMetrics: mData.impactMetrics || [],
      socialLinks: mData.socialLinks || []
    };

    if (!profile) {
      profile = await EmployeeProfile.create({
        memberId: member._id,
        userId: user._id,
        slug: mData.slug,
        templateId: mData.templateId,
        templateVersion: 1,
        visibility: 'public',
        approvalStatus: 'approved',
        published: profileData,
        draft: profileData
      });
    } else {
      profile.published = profileData;
      profile.draft = profileData;
      await profile.save();
    }

    member.profileId = profile._id;
    member.profileCompletionScore = profile.calculateCompletionScore();
    await member.save();
  }

  logger.info(`✅ Seeded ${sampleMembers.length} sample team members & public profiles successfully.`);
};
