import { Event } from '../modules/events/event.model.js';
import { Department } from '../modules/departments/department.model.js';
import { TeamMember } from '../modules/team-members/teamMember.model.js';
import { logger } from '../config/logger.config.js';

export const seedEvents = async () => {
  try {
    logger.info('  [Events] Seeding software enterprise events and attendee rosters...');

    await Event.deleteMany({});

    const [engDept, designDept, prodDept] = await Promise.all([
      Department.findOne({ slug: 'engineering' }),
      Department.findOne({ slug: 'design' }),
      Department.findOne({ slug: 'product' })
    ]);

    const members = await TeamMember.find({ status: 'active' }).limit(6);
    const sampleAttendees = members.map((m) => ({
      userId: m.userId,
      registeredAt: new Date(),
      status: 'confirmed'
    }));

    const sampleEvents = [
      {
        title: 'OneWinq Global Developer & Innovation Summit 2026',
        slug: 'onewinq-global-developer-summit-2026',
        description: 'Join the entire OneWinq engineering, product, and leadership teams for our annual flagship summit unveiling the next generation of enterprise digital identity APIs, smart hardware, and AI Copilots.',
        category: 'conference',
        coverImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // in 14 days
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000),
        locationType: 'hybrid',
        locationAddress: 'Grand Innovation Hall, Crystal IT Hub, Indore',
        meetingUrl: 'https://meet.onewinq.com/summit-2026',
        organizerName: 'OneWinq Developer Guild & Events Committee',
        maxCapacity: 500,
        registrationDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        eligibility: {
          type: 'all',
          departmentIds: [],
          roleIds: []
        },
        attendees: sampleAttendees,
        status: 'published'
      },
      {
        title: 'Engineering All-Hands & Microservices Architecture Deep Dive',
        slug: 'engineering-all-hands-q3-2026',
        description: 'Quarterly engineering architecture review covering scalable multi-tenant infrastructure, zero-knowledge contactless token encryption, Kafka event streams, and CDN edge optimization.',
        category: 'meeting',
        coverImageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80',
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        locationType: 'virtual',
        meetingUrl: 'https://meet.onewinq.com/eng-all-hands',
        organizerName: 'CTO & Engineering Leadership',
        maxCapacity: 100,
        registrationDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        eligibility: {
          type: engDept ? 'departments' : 'all',
          departmentIds: engDept ? [engDept._id] : [],
          roleIds: []
        },
        attendees: sampleAttendees.slice(0, 3),
        status: 'published'
      },
      {
        title: 'Design Systems, Micro-Interactions & Physics-Based Web Workshop',
        slug: 'design-systems-micro-interactions-workshop-2026',
        description: 'Interactive hands-on session on crafting next-generation digital card themes with fluid physics-based animations, glassmorphism UI shaders, and accessible contrast patterns.',
        category: 'workshop',
        coverImageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80',
        startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // in 8 days
        endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
        locationType: 'physical',
        locationAddress: 'Design Studio Lab 3, OneWinq Campus, Indore',
        organizerName: 'Design & Product Guild',
        maxCapacity: 40,
        registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eligibility: {
          type: 'all',
          departmentIds: [],
          roleIds: []
        },
        attendees: sampleAttendees.slice(0, 4),
        status: 'published'
      },
      {
        title: 'Q3 Enterprise SaaS Go-To-Market & Revenue All-Hands',
        slug: 'q3-enterprise-saas-gtm-all-hands-2026',
        description: 'Reviewing quarterly revenue milestones, Fortune 500 customer onboarding metrics, product packaging, and global enterprise expansion targets.',
        category: 'meeting',
        coverImageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
        startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        locationType: 'hybrid',
        locationAddress: 'Executive Boardroom & Virtual Stream',
        meetingUrl: 'https://meet.onewinq.com/gtm-all-hands',
        organizerName: 'Sales & Revenue Operations',
        maxCapacity: 150,
        registrationDeadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        eligibility: {
          type: 'all',
          departmentIds: [],
          roleIds: []
        },
        attendees: sampleAttendees.slice(0, 5),
        status: 'published'
      }
    ];

    await Event.insertMany(sampleEvents);
    logger.info(`  [Events] Successfully seeded ${sampleEvents.length} enterprise events with dynamic attendees.`);
  } catch (error) {
    logger.error(`  [Events] Failed to seed events: ${error.message}`);
  }
};
