import { CompanyProfile } from '../modules/company-profile/companyProfile.model.js';
import { OrganizationSettings } from '../modules/settings/organizationSettings.model.js';
import { Template } from '../modules/templates/template.model.js';
import { logger } from '../config/logger.config.js';

export const seedOrganization = async () => {
  logger.info('Seeding company profile and organization settings...');

  const defaultTemplate = await Template.findOne({ isDefault: true }).lean();

  // 1. Organization Settings
  await OrganizationSettings.findOneAndUpdate(
    {},
    {
      organizationName: 'OneWinq',
      timezone: 'America/New_York',
      language: 'en',
      profileSettings: {
        defaultVisibility: 'public',
        defaultTemplateId: defaultTemplate?._id || null,
        requireApprovalForProfileChanges: true,
        allowCustomThemes: true
      },
      securitySettings: {
        passwordMinLength: 8,
        sessionTimeoutMinutes: 120,
        maxFailedLogins: 5,
        twoFactorEnabled: false,
        ssoEnabled: false
      }
    },
    { upsert: true, new: true }
  );

  // 2. Company Profile
  await CompanyProfile.findOneAndUpdate(
    { slug: 'onewinq' },
    {
      name: 'OneWinq',
      slug: 'onewinq',
      tagline: 'The Enterprise Digital Identity & People Platform',
      description:
        'OneWinq unifies company branding, employee digital identities, and verified credentials into a seamless, modern platform.',
      industry: 'Enterprise Software / SaaS',
      website: 'https://onewinq.com',
      location: {
        address: '500 Tech Parkway, Suite 800',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        zipCode: '94105'
      },
      contact: {
        email: 'contact@onewinq.com',
        phone: '+1 (555) 019-2834',
        supportEmail: 'support@onewinq.com'
      },
      about: {
        aboutCompany:
          'OneWinq is on a mission to modernize how modern enterprises represent their brand and empower their workforce with verified, elegant digital identity tools.',
        mission: 'Empowering companies and their people with seamless digital presence and trusted identity infrastructure.',
        vision: 'To be the standard digital identity fabric for progressive enterprises worldwide.',
        values: [
          { title: 'Customer Obsession', description: 'We build every feature with relentless care for user experience.', icon: 'heart' },
          { title: 'Security First', description: 'Enterprise privacy and zero-trust security are in our DNA.', icon: 'shield' },
          { title: 'Radical Transparency', description: 'Clear communication, open standards, and verified information.', icon: 'eye' }
        ]
      },
      branding: {
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
        coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop',
        primaryColor: '#2563eb',
        secondaryColor: '#0f172a',
        accentColor: '#38bdf8',
        fontHeading: 'Inter',
        fontBody: 'Inter',
        themeMode: 'system'
      },
      dynamicSections: [
        {
          sectionId: 'sec-overview',
          title: 'Platform Overview',
          type: 'overview',
          content: {
            headline: 'Unified Digital Identity For Every Team Member',
            highlights: ['Smart QR Code Badges', 'Verified Role Credentials', 'Dynamic Digital Profiles']
          },
          order: 1,
          isVisible: true
        },
        {
          sectionId: 'sec-services',
          title: 'Products & Solutions',
          type: 'services',
          content: {
            items: [
              { name: 'OneWinq Digital Cards', desc: 'Instant NFC and QR-enabled employee smart cards.' },
              { name: 'Enterprise Identity Hub', desc: 'Centralized directory and access governance.' },
              { name: 'Verified Credentials', desc: 'Cryptographically secured identity proofs.' }
            ]
          },
          order: 2,
          isVisible: true
        },
        {
          sectionId: 'sec-contact',
          title: 'Get In Touch',
          type: 'contact',
          content: {
            officeHours: 'Monday - Friday, 9:00 AM - 6:00 PM PST',
            inquiriesEmail: 'enterprise@onewinq.com'
          },
          order: 3,
          isVisible: true
        }
      ],
      navigation: [
        { navId: 'nav-overview', label: 'Overview', targetSectionId: 'sec-overview', icon: 'home', order: 1, isVisible: true },
        { navId: 'nav-services', label: 'Products', targetSectionId: 'sec-services', icon: 'layers', order: 2, isVisible: true },
        { navId: 'nav-contact', label: 'Contact', targetSectionId: 'sec-contact', icon: 'mail', order: 3, isVisible: true }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/onewinq', order: 1, isVisible: true },
        { platform: 'X', url: 'https://x.com/onewinq', order: 2, isVisible: true },
        { platform: 'GitHub', url: 'https://github.com/onewinq', order: 3, isVisible: true }
      ],
      isPublic: true
    },
    { upsert: true, new: true }
  );

  logger.info('✅ Seeded company profile and organization settings successfully.');
};
