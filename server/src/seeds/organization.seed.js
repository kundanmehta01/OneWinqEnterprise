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
      name: 'OneWinq Technologies Pvt. Ltd.',
      slug: 'onewinq',
      tagline: 'One Identity, Infinite Possibilities.',
      description:
        'Company Identity First. Role Identity Always. Represents the company as a brand and its complete digital presence.',
      industry: 'Technology / SaaS / AI',
      website: 'https://onewinq.in',
      overviewStats: {
        foundedYear: '2024',
        locationShort: 'Indore',
        teamSize: '25+'
      },
      location: {
        address: 'Scheme No. 78',
        city: 'Indore',
        state: 'Madhya Pradesh',
        country: 'India',
        zipCode: '452010'
      },
      contact: {
        email: 'hello@onewinq.in',
        phone: '+91 731 123 4507',
        supportEmail: 'support@onewinq.in',
        workingHours: 'Mon - Sat (10 AM - 7 PM)',
        directionsUrl: 'https://maps.google.com/?q=Indore+Madhya+Pradesh'
      },
      about: {
        vision: "To become the world's most trusted identity and networking platform for people and businesses.",
        mission: 'To empower every individual and organization with a digital identity that creates value, trust and growth.',
        story: 'OneWinq was founded with a vision to unify identity, network and business in one seamless platform.',
        aboutCompany:
          'OneWinq Technologies is on a mission to revolutionize digital presence by bridging company branding with individual role identity.',
        values: [
          { title: 'Trust & Verification', description: 'Every card and credential is cryptographically verified.', icon: 'shield-check' },
          { title: 'Innovation in Identity', description: 'Merging NFC, dynamic QR codes, and AI-powered networking.', icon: 'sparkles' },
          { title: 'People-First Growth', description: 'Empowering teams with seamless role and brand recognition.', icon: 'users' }
        ]
      },
      productsServices: [
        {
          title: 'OneWinq ID Card',
          description: 'Digital identity card for individuals and businesses.',
          category: 'Digital Identity',
          badge: 'Flagship',
          icon: 'id-card',
          order: 1,
          isVisible: true
        },
        {
          title: 'NFC Card',
          description: 'Smart NFC business card solution for frictionless tap-and-connect.',
          category: 'Smart Hardware',
          badge: 'Hardware',
          icon: 'nfc',
          order: 2,
          isVisible: true
        },
        {
          title: 'AI Chat Assistant',
          description: 'AI powered business assistant for automated networking and lead capture.',
          category: 'AI & Automation',
          badge: 'AI Powered',
          icon: 'bot',
          order: 3,
          isVisible: true
        },
        {
          title: 'Website Template',
          description: 'Professional website templates tailored for enterprise presence.',
          category: 'Web Solutions',
          badge: 'Templates',
          icon: 'layout',
          order: 4,
          isVisible: true
        }
      ],
      projects: [
        {
          title: 'OneWinq Platform',
          description: 'Complete identity & network management platform for modern enterprises.',
          category: 'Identity Platform',
          status: 'ongoing',
          order: 1,
          isVisible: true
        },
        {
          title: 'AI Assistant System',
          description: 'AI based business assistant for automated customer engagement.',
          category: 'AI & Machine Learning',
          status: 'completed',
          order: 2,
          isVisible: true
        },
        {
          title: 'NFC Card Solution',
          description: 'Smart card solution engineered for professionals and enterprise teams.',
          category: 'Hardware & IoT',
          status: 'completed',
          order: 3,
          isVisible: true
        }
      ],
      achievements: [
        {
          title: 'Best Startup Award 2024',
          subtitle: 'Technology Excellence',
          description: 'Awarded for groundbreaking work in digital identity and networking innovation.',
          badge: 'Winner',
          year: '2024',
          metric: 'Top Innovator',
          order: 1,
          isVisible: true
        },
        {
          title: 'ISO 27001 Certified',
          subtitle: 'Information Security Management',
          description: 'Certified enterprise security standards across data governance and privacy.',
          badge: 'Security',
          year: '2024',
          order: 2,
          isVisible: true
        },
        {
          title: '500+ Businesses',
          subtitle: 'Connected on OneWinq',
          description: 'Trusted by hundreds of leading businesses for modern employee identity.',
          badge: 'Adoption',
          metric: '500+ Active',
          order: 3,
          isVisible: true
        },
        {
          title: '25+ Team Members',
          subtitle: 'Working Across India',
          description: 'A passionate team building world-class identity infrastructure.',
          badge: 'Team',
          metric: '25+ Talent',
          order: 4,
          isVisible: true
        }
      ],
      branding: {
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
        coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop',
        primaryColor: '#6366f1',
        secondaryColor: '#090d16',
        accentColor: '#818cf8',
        fontHeading: 'Inter',
        fontBody: 'Inter',
        themeMode: 'dark'
      },
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/onewinq', order: 1, isVisible: true },
        { platform: 'Facebook', url: 'https://facebook.com/onewinq', order: 2, isVisible: true },
        { platform: 'Instagram', url: 'https://instagram.com/onewinq', order: 3, isVisible: true },
        { platform: 'YouTube', url: 'https://youtube.com/@onewinq', order: 4, isVisible: true },
        { platform: 'Twitter', url: 'https://twitter.com/onewinq', order: 5, isVisible: true }
      ],
      isPublic: true
    },
    { upsert: true, new: true }
  );

  logger.info('✅ Seeded company profile and organization settings successfully.');
};
