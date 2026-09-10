import { Template } from '../modules/templates/template.model.js';
import { logger } from '../config/logger.config.js';

export const seedTemplates = async () => {
  logger.info('Seeding profile templates...');

  const templates = [
    {
      name: 'Executive Profile',
      slug: 'executive-profile',
      category: 'executive',
      description: 'Professional template for CXOs',
      layoutConfig: {
        headerStyle: 'cover_left',
        colorPalette: {
          primary: '#5046e5',
          secondary: '#312e81',
          accent: '#818cf8',
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
        { sectionKey: 'skills', title: 'Core Competencies', isRequired: false, defaultOrder: 3 },
        { sectionKey: 'socialLinks', title: 'Connect & Follow', isRequired: true, defaultOrder: 4 }
      ],
      sectionOrder: ['experience', 'achievements', 'skills', 'socialLinks'],
      isDefault: false,
      isActive: true,
      version: 1
    },
    {
      name: 'Manager Profile',
      slug: 'manager-profile',
      category: 'management',
      description: 'Template for managers',
      layoutConfig: {
        headerStyle: 'banner_minimal',
        colorPalette: {
          primary: '#0284c7',
          secondary: '#0369a1',
          accent: '#38bdf8',
          background: '#ffffff',
          text: '#0f172a'
        },
        fontHeading: 'Inter',
        fontBody: 'Inter',
        showBadges: true,
        showQrCode: true
      },
      availableSections: [
        { sectionKey: 'experience', title: 'Management Trajectory', isRequired: true, defaultOrder: 1 },
        { sectionKey: 'projects', title: 'Team Deliverables', isRequired: true, defaultOrder: 2 },
        { sectionKey: 'skills', title: 'Skills & Tools', isRequired: true, defaultOrder: 3 }
      ],
      sectionOrder: ['experience', 'projects', 'skills'],
      isDefault: false,
      isActive: true,
      version: 1
    },
    {
      name: 'Employee Profile',
      slug: 'employee-profile',
      category: 'employee',
      description: 'Standard template for employees',
      layoutConfig: {
        headerStyle: 'centered',
        colorPalette: {
          primary: '#059669',
          secondary: '#047857',
          accent: '#34d399',
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
        { sectionKey: 'projects', title: 'Featured Projects', isRequired: true, defaultOrder: 2 },
        { sectionKey: 'experience', title: 'Work Experience', isRequired: true, defaultOrder: 3 }
      ],
      sectionOrder: ['skills', 'projects', 'experience'],
      isDefault: true,
      isActive: true,
      version: 1
    },
    {
      name: 'Founder Profile',
      slug: 'founder-profile',
      category: 'founder',
      description: 'Template for founders',
      layoutConfig: {
        headerStyle: 'cover_left',
        colorPalette: {
          primary: '#d97706',
          secondary: '#b45309',
          accent: '#fbbf24',
          background: '#ffffff',
          text: '#0f172a'
        },
        fontHeading: 'Outfit',
        fontBody: 'Inter',
        showBadges: true,
        showQrCode: true
      },
      availableSections: [
        { sectionKey: 'journey', title: 'Founder Journey', isRequired: true, defaultOrder: 1 },
        { sectionKey: 'projects', title: 'Ventures', isRequired: true, defaultOrder: 2 },
        { sectionKey: 'achievements', title: 'Milestones', isRequired: true, defaultOrder: 3 }
      ],
      sectionOrder: ['journey', 'projects', 'achievements'],
      isDefault: false,
      isActive: true,
      version: 1
    },
    {
      name: 'Company Profile',
      slug: 'company-profile',
      category: 'company',
      description: 'Organization / company template',
      layoutConfig: {
        headerStyle: 'banner_minimal',
        colorPalette: {
          primary: '#7c3aed',
          secondary: '#6d28d9',
          accent: '#a78bfa',
          background: '#ffffff',
          text: '#0f172a'
        },
        fontHeading: 'Outfit',
        fontBody: 'Inter',
        showBadges: true,
        showQrCode: true
      },
      availableSections: [
        { sectionKey: 'about', title: 'About Company', isRequired: true, defaultOrder: 1 },
        { sectionKey: 'products', title: 'Products & Services', isRequired: true, defaultOrder: 2 },
        { sectionKey: 'leadership', title: 'Leadership', isRequired: true, defaultOrder: 3 }
      ],
      sectionOrder: ['about', 'products', 'leadership'],
      isDefault: false,
      isActive: true,
      version: 1
    },
    {
      name: 'Intern Profile',
      slug: 'intern-profile',
      category: 'employee',
      description: 'Template for interns',
      layoutConfig: {
        headerStyle: 'centered',
        colorPalette: {
          primary: '#64748b',
          secondary: '#475569',
          accent: '#94a3b8',
          background: '#f8fafc',
          text: '#1e293b'
        },
        fontHeading: 'Inter',
        fontBody: 'Inter',
        showBadges: true,
        showQrCode: false
      },
      availableSections: [
        { sectionKey: 'skills', title: 'Skills & Learning', isRequired: true, defaultOrder: 1 },
        { sectionKey: 'projects', title: 'Projects', isRequired: true, defaultOrder: 2 }
      ],
      sectionOrder: ['skills', 'projects'],
      isDefault: false,
      isActive: false,
      version: 1
    },
    {
      name: 'Custom Minimal',
      slug: 'custom-minimal',
      category: 'custom',
      description: 'Minimal clean template',
      layoutConfig: {
        headerStyle: 'banner_minimal',
        colorPalette: {
          primary: '#334155',
          secondary: '#1e293b',
          accent: '#64748b',
          background: '#ffffff',
          text: '#0f172a'
        },
        fontHeading: 'Inter',
        fontBody: 'Inter',
        showBadges: true,
        showQrCode: false
      },
      availableSections: [
        { sectionKey: 'skills', title: 'Overview', isRequired: true, defaultOrder: 1 }
      ],
      sectionOrder: ['skills'],
      isDefault: false,
      isActive: false,
      version: 1
    }
  ];

  for (const tpl of templates) {
    await Template.findOneAndUpdate({ slug: tpl.slug }, tpl, { upsert: true, new: true });
  }

  logger.info(`✅ Seeded ${templates.length} profile templates successfully.`);
};

