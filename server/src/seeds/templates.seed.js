import { Template } from '../modules/templates/template.model.js';
import { logger } from '../config/logger.config.js';

export const seedTemplates = async () => {
  logger.info('Seeding profile templates...');

  const templates = [
    {
      name: 'Executive Minimalist',
      slug: 'executive-minimalist',
      category: 'founder',
      description: 'Sophisticated, premium layout tailored for founders, CEOs, and executive leaders.',
      layoutConfig: {
        headerStyle: 'cover_left',
        colorPalette: {
          primary: '#0f172a',
          secondary: '#1e293b',
          accent: '#38bdf8',
          background: '#ffffff',
          text: '#0f172a'
        },
        fontHeading: 'Outfit',
        fontBody: 'Inter',
        showBadges: true,
        showQrCode: true
      },
      availableSections: [
        { sectionKey: 'experience', title: 'Leadership History', isRequired: true, defaultOrder: 1 },
        { sectionKey: 'achievements', title: 'Key Milestones', isRequired: false, defaultOrder: 2 },
        { sectionKey: 'projects', title: 'Ventures & Strategic Initiatives', isRequired: false, defaultOrder: 3 },
        { sectionKey: 'skills', title: 'Core Competencies', isRequired: false, defaultOrder: 4 },
        { sectionKey: 'socialLinks', title: 'Connect & Follow', isRequired: true, defaultOrder: 5 }
      ],
      sectionOrder: ['experience', 'achievements', 'projects', 'skills', 'socialLinks'],
      isDefault: false,
      isActive: true,
      version: 1
    },
    {
      name: 'Modern Tech & Engineering',
      slug: 'modern-tech-engineering',
      category: 'employee',
      description: 'Modern developer & engineer profile highlighting technical skills, github repos, and architecture projects.',
      layoutConfig: {
        headerStyle: 'centered',
        colorPalette: {
          primary: '#2563eb',
          secondary: '#1d4ed8',
          accent: '#60a5fa',
          background: '#f8fafc',
          text: '#1e293b'
        },
        fontHeading: 'Inter',
        fontBody: 'Inter',
        showBadges: true,
        showQrCode: true
      },
      availableSections: [
        { sectionKey: 'skills', title: 'Tech Stack & Skills', isRequired: true, defaultOrder: 1 },
        { sectionKey: 'projects', title: 'Featured Projects & Repos', isRequired: true, defaultOrder: 2 },
        { sectionKey: 'experience', title: 'Work Experience', isRequired: true, defaultOrder: 3 },
        { sectionKey: 'achievements', title: 'Certifications & Awards', isRequired: false, defaultOrder: 4 },
        { sectionKey: 'socialLinks', title: 'Social & Code Profiles', isRequired: true, defaultOrder: 5 }
      ],
      sectionOrder: ['skills', 'projects', 'experience', 'achievements', 'socialLinks'],
      isDefault: true,
      isActive: true,
      version: 1
    },
    {
      name: 'Corporate Leadership Classic',
      slug: 'corporate-leadership-classic',
      category: 'leadership',
      description: 'Polished corporate profile with comprehensive milestone and team oversight sections.',
      layoutConfig: {
        headerStyle: 'banner_minimal',
        colorPalette: {
          primary: '#475569',
          secondary: '#334155',
          accent: '#0284c7',
          background: '#ffffff',
          text: '#0f172a'
        },
        fontHeading: 'Inter',
        fontBody: 'Inter',
        showBadges: true,
        showQrCode: true
      },
      availableSections: [
        { sectionKey: 'experience', title: 'Career Trajectory', isRequired: true, defaultOrder: 1 },
        { sectionKey: 'skills', title: 'Executive Skills', isRequired: false, defaultOrder: 2 },
        { sectionKey: 'projects', title: 'Key Deliverables', isRequired: false, defaultOrder: 3 },
        { sectionKey: 'achievements', title: 'Honors & Recognition', isRequired: false, defaultOrder: 4 },
        { sectionKey: 'socialLinks', title: 'Professional Networks', isRequired: true, defaultOrder: 5 }
      ],
      sectionOrder: ['experience', 'skills', 'projects', 'achievements', 'socialLinks'],
      isDefault: false,
      isActive: true,
      version: 1
    }
  ];

  for (const tpl of templates) {
    await Template.findOneAndUpdate({ slug: tpl.slug }, tpl, { upsert: true, new: true });
  }

  logger.info(`✅ Seeded ${templates.length} profile templates successfully.`);
};
