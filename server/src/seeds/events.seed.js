import { Event } from '../modules/events/event.model.js';
import { Department } from '../modules/departments/department.model.js';
import { Role } from '../modules/roles/role.model.js';
import { logger } from '../config/logger.config.js';

export const seedEvents = async () => {
  try {
    logger.info('  [Events] Checking and seeding enterprise events...');

    const existingCount = await Event.countDocuments();
    if (existingCount > 0) {
      logger.info(`  [Events] ${existingCount} events already exist. Skipping seed.`);
      return;
    }

    const [engineeringDept, designDept] = await Promise.all([
      Department.findOne({ slug: 'engineering' }),
      Department.findOne({ slug: 'product-design' })
    ]);

    const sampleEvents = [
      {
        title: 'OneWinq Annual Innovation Summit 2026',
        slug: 'onewinq-annual-innovation-summit-2026',
        description: 'Join the entire OneWinq team for our annual flagship summit unveiling the next generation of enterprise digital identity products.',
        category: 'conference',
        coverImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // in 14 days
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
        locationType: 'hybrid',
        locationAddress: 'Grand Hall, Crystal IT Park, Indore',
        meetingUrl: 'https://meet.onewinq.com/summit-2026',
        organizerName: 'OneWinq Events Committee',
        maxCapacity: 500,
        registrationDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        eligibility: {
          type: 'all',
          departmentIds: [],
          roleIds: []
        },
        status: 'published'
      },
      {
        title: 'Engineering All-Hands & Architecture Deep Dive',
        slug: 'engineering-all-hands-q3',
        description: 'Quarterly architecture review covering scalable multi-tenant infrastructure, token encryption, and CDN pipelines.',
        category: 'meeting',
        coverImageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80',
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        locationType: 'virtual',
        meetingUrl: 'https://meet.onewinq.com/eng-all-hands',
        organizerName: 'Engineering Leadership',
        maxCapacity: 100,
        registrationDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        eligibility: {
          type: engineeringDept ? 'departments' : 'all',
          departmentIds: engineeringDept ? [engineeringDept._id] : [],
          roleIds: []
        },
        status: 'published'
      },
      {
        title: 'Design System & Micro-Interactions Workshop',
        slug: 'design-system-workshop',
        description: 'Interactive hands-on session on creating premium digital card themes with fluid physics-based animations.',
        category: 'workshop',
        coverImageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80',
        startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // in 8 days
        endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        locationType: 'physical',
        locationAddress: 'Design Studio Lab 3, OneWinq Campus',
        organizerName: 'Design Guild',
        maxCapacity: 30,
        registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eligibility: {
          type: 'all',
          departmentIds: [],
          roleIds: []
        },
        status: 'published'
      }
    ];

    await Event.insertMany(sampleEvents);
    logger.info(`  [Events] Successfully seeded ${sampleEvents.length} enterprise events.`);
  } catch (error) {
    logger.error(`  [Events] Failed to seed events: ${error.message}`);
  }
};
