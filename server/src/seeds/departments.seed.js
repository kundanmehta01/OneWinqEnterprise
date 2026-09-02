import { Department } from '../modules/departments/department.model.js';
import { logger } from '../config/logger.config.js';

export const seedDepartments = async () => {
  logger.info('Seeding departments...');

  const departments = [
    {
      name: 'Executive Leadership',
      slug: 'executive-leadership',
      description: 'Senior strategy, executive management, and organization direction',
      order: 1,
      isActive: true
    },
    {
      name: 'Engineering & Technology',
      slug: 'engineering-technology',
      description: 'Software architecture, platform infrastructure, and backend/frontend engineering',
      order: 2,
      isActive: true
    },
    {
      name: 'Product & Design',
      slug: 'product-design',
      description: 'Product management, user research, UI/UX design, and design systems',
      order: 3,
      isActive: true
    },
    {
      name: 'People & Human Resources',
      slug: 'people-human-resources',
      description: 'Talent acquisition, employee development, culture, and workplace operations',
      order: 4,
      isActive: true
    },
    {
      name: 'Marketing & Growth',
      slug: 'marketing-growth',
      description: 'Brand management, demand generation, product marketing, and public relations',
      order: 5,
      isActive: true
    },
    {
      name: 'Sales & Customer Success',
      slug: 'sales-customer-success',
      description: 'Enterprise partnerships, customer onboarding, account management, and support',
      order: 6,
      isActive: true
    }
  ];

  for (const dept of departments) {
    await Department.findOneAndUpdate({ slug: dept.slug }, dept, { upsert: true, new: true });
  }

  logger.info(`✅ Seeded ${departments.length} departments successfully.`);
};
