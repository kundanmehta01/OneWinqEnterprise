import { Department } from '../modules/departments/department.model.js';
import { TeamMember } from '../modules/team-members/teamMember.model.js';
import { Template } from '../modules/templates/template.model.js';
import { EmployeeProfile } from '../modules/employee-profile/employeeProfile.model.js';
import { logger } from '../config/logger.config.js';

export const seedDepartments = async () => {
  logger.info('Seeding software company departments with template bindings...');

  const departments = [
    {
      name: 'Executive Leadership',
      slug: 'executive-leadership',
      description: 'Corporate strategy, enterprise vision, board governance & executive operations',
      leadName: 'Priya Sharma',
      templateSlug: 'executive-profile',
      order: 1,
      isActive: true
    },
    {
      name: 'Engineering',
      slug: 'engineering',
      description: 'Cloud infrastructure, microservices, mobile apps, security & distributed systems',
      leadName: 'Rahul Verma',
      templateSlug: 'engineering-profile',
      order: 2,
      isActive: true
    },
    {
      name: 'Product',
      slug: 'product',
      description: 'Product roadmap, technical specifications, user research & feature prioritization',
      leadName: 'Aditi Nair',
      templateSlug: 'product-profile',
      order: 3,
      isActive: true
    },
    {
      name: 'Design',
      slug: 'design',
      description: 'Enterprise design systems, product UX/UI, visual branding & interactive prototypes',
      leadName: 'Sneha Joshi',
      templateSlug: 'marketing-profile',
      order: 4,
      isActive: true
    },
    {
      name: 'Marketing',
      slug: 'marketing',
      description: 'Developer relations, product-led growth, digital demand generation & brand storytelling',
      leadName: 'Arjun Mehta',
      templateSlug: 'marketing-profile',
      order: 5,
      isActive: true
    },
    {
      name: 'Sales',
      slug: 'sales',
      description: 'Enterprise B2B SaaS sales, strategic partnerships & client account management',
      leadName: 'Neha Patel',
      templateSlug: 'sales-profile',
      order: 6,
      isActive: true
    },
    {
      name: 'Human Resources',
      slug: 'human-resources',
      description: 'Global talent acquisition, engineering recruiting, people operations & culture',
      leadName: 'Vikram Singh',
      templateSlug: 'hr-profile',
      order: 7,
      isActive: true
    },
    {
      name: 'Customer Support',
      slug: 'customer-support',
      description: '24/7 technical customer support, solutions architecture & enterprise client onboarding',
      leadName: 'Kabir Sengupta',
      templateSlug: 'employee-profile',
      order: 8,
      isActive: true
    },
    {
      name: 'Finance',
      slug: 'finance',
      description: 'Corporate finance, SaaS accounting, revenue forecasting, treasury & compliance',
      leadName: 'Sameer Kulkarni',
      templateSlug: 'employee-profile',
      order: 9,
      isActive: true
    }
  ];

  for (const dept of departments) {
    let headMemberId = null;
    if (dept.leadName) {
      const head = await TeamMember.findOne({ name: { $regex: new RegExp(dept.leadName, 'i') } });
      if (head) {
        headMemberId = head._id;
      }
    }

    let templateId = null;
    if (dept.templateSlug) {
      const tpl = await Template.findOne({ slug: dept.templateSlug });
      if (tpl) {
        templateId = tpl._id;
      }
    }

    const { leadName, templateSlug, ...deptData } = dept;
    const doc = await Department.findOneAndUpdate(
      { slug: dept.slug },
      {
        ...deptData,
        ...(headMemberId ? { headMemberId } : {}),
        ...(templateId ? { templateId } : {})
      },
      { upsert: true, new: true }
    );

    // If head member was found, make sure their departmentId points to this department
    if (headMemberId) {
      await TeamMember.findByIdAndUpdate(headMemberId, { departmentId: doc._id });
    }

    // Auto-sync existing members in this department to have this profile template
    if (templateId) {
      const membersInDept = await TeamMember.find({ departmentId: doc._id }).select('profileId');
      const profileIds = membersInDept.map((m) => m.profileId).filter(Boolean);
      if (profileIds.length > 0) {
        await EmployeeProfile.updateMany(
          { _id: { $in: profileIds } },
          { templateId }
        );
      }
    }
  }

  logger.info(`✅ Seeded ${departments.length} enterprise departments with leadership and template bindings successfully.`);
};
