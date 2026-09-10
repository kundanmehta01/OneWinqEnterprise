import { CompanyProfile } from '../modules/company-profile/companyProfile.model.js';
import { OrganizationSettings } from '../modules/settings/organizationSettings.model.js';
import { Template } from '../modules/templates/template.model.js';
import { logger } from '../config/logger.config.js';

export const seedOrganization = async () => {
  logger.info('Seeding software enterprise company profile and organization settings...');

  const defaultTemplate = await Template.findOne({ isDefault: true }).lean();

  // 1. Organization Settings
  await OrganizationSettings.findOneAndUpdate(
    {},
    {
      organizationName: 'OneWinq Technologies',
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

  // 2. Company Profile (Modern B2B Software Enterprise)
  await CompanyProfile.findOneAndUpdate(
    { slug: 'onewinq' },
    {
      name: 'OneWinq Technologies Inc.',
      slug: 'onewinq',
      tagline: 'Next-Generation Digital Identity, Smart NFC Infrastructure & Enterprise Cloud APIs',
      description:
        'OneWinq is a modern enterprise software company providing next-generation digital identity infrastructure, smart NFC hardware cards, AI-driven networking workflows, and secure credential management for high-growth tech teams and global enterprises.',
      industry: 'Enterprise Software / Cloud SaaS / AI & IoT',
      website: 'https://onewinq.com',
      overviewStats: {
        foundedYear: '2024',
        locationShort: 'Indore / Silicon Valley',
        teamSize: '50+ Engineers & Operators'
      },
      location: {
        address: 'OneWinq Tech Park, Suite 400, Crystal IT Hub',
        city: 'Indore',
        state: 'Madhya Pradesh',
        country: 'India',
        zipCode: '452010'
      },
      contact: {
        email: 'contact@onewinq.com',
        phone: '+91 731 490 8800',
        supportEmail: 'support@onewinq.com',
        workingHours: 'Mon - Fri (9:00 AM - 7:00 PM IST)',
        directionsUrl: 'https://maps.google.com/?q=Indore+Madhya+Pradesh'
      },
      about: {
        vision:
          "To be the world's most ubiquitous and trusted identity layer connecting people, smart hardware, and cloud software seamlessly.",
        mission:
          'To empower every enterprise workforce with instant cryptographic credentials, intelligent role-based profiles, and frictionless networking infrastructure.',
        story:
          'Founded by veteran software engineers and product architects, OneWinq was created to replace obsolete paper business cards and fragmented directory tools with unified, live-updating digital identity operating systems.',
        aboutCompany:
          'OneWinq Technologies engineers distributed identity cloud platforms, contactless NFC hardware cards, AI networking assistants, and enterprise compliance engines. Trusted by high-growth startups and Fortune 500 enterprises.',
        values: [
          {
            title: 'Engineering Rigor & Trust',
            description: 'Zero-trust cryptographic verification and enterprise-grade reliability in every line of code.',
            icon: 'shield-check'
          },
          {
            title: 'Customer-Obsessed Innovation',
            description: 'Merging physical NFC hardware with real-time web & mobile applications seamlessly.',
            icon: 'sparkles'
          },
          {
            title: 'Autonomous People & Growth',
            description: 'Cultivating world-class engineering, design, and product excellence with high-agency ownership.',
            icon: 'users'
          }
        ]
      },
      productsServices: [
        {
          title: 'OneWinq Identity Cloud (SaaS)',
          description: 'Enterprise multi-tenant identity fabric with role governance, approval workflows, and audit trails.',
          category: 'Cloud SaaS',
          badge: 'Flagship Platform',
          icon: 'cloud',
          order: 1,
          isVisible: true
        },
        {
          title: 'Smart NFC Enterprise Hardware Cards',
          description: 'Custom matte black metal, 24K gold, and bamboo NFC cards with instant tap-to-profile handshakes.',
          category: 'Hardware & IoT',
          badge: 'Hardware',
          icon: 'nfc',
          order: 2,
          isVisible: true
        },
        {
          title: 'OneWinq AI Copilot & Lead Automation',
          description: 'Intelligent AI assistant embedded in profiles for automatic lead capture, CRM sync, and smart scheduling.',
          category: 'AI & Automation',
          badge: 'AI Powered',
          icon: 'bot',
          order: 3,
          isVisible: true
        },
        {
          title: 'Developer API & SDK Gateway',
          description: 'RESTful and GraphQL APIs with webhooks for automated employee provisioning via Workday, Okta, and BambooHR.',
          category: 'Developer Platform',
          badge: 'Developer Tools',
          icon: 'code',
          order: 4,
          isVisible: true
        },
        {
          title: 'Dynamic QR & Smart vCard Distribution',
          description: 'Encrypted offline and online dynamic QR codes with 1-click vCard download to Apple Wallet and Android contacts.',
          category: 'Mobile & Security',
          badge: 'Security',
          icon: 'qr-code',
          order: 5,
          isVisible: true
        }
      ],
      projects: [
        {
          title: 'OneWinq Distributed Microservices Cloud',
          description: 'High-throughput identity service handling millions of profile lookups with sub-50ms global latency.',
          category: 'Cloud Infrastructure',
          status: 'ongoing',
          order: 1,
          isVisible: true
        },
        {
          title: 'Zero-Knowledge Contactless Handshake Protocol',
          description: 'Cryptographic NFC payload transmission ensuring zero-tamper profile credential verification.',
          category: 'Cybersecurity & IoT',
          status: 'completed',
          order: 2,
          isVisible: true
        },
        {
          title: 'Real-Time Enterprise Analytics Pipeline',
          description: 'Kafka & Redis streaming architecture delivering live team networking engagement metrics to admins.',
          category: 'Big Data & Analytics',
          status: 'completed',
          order: 3,
          isVisible: true
        },
        {
          title: 'Enterprise SSO & SCIM Directory Integration',
          description: 'Automated user sync with Microsoft Azure AD, Google Workspace, and Okta.',
          category: 'Enterprise Integration',
          status: 'ongoing',
          order: 4,
          isVisible: true
        }
      ],
      achievements: [
        {
          title: 'Enterprise SaaS Product of the Year 2025',
          subtitle: 'Global Tech Innovation Awards',
          description: 'Recognized for pioneering contactless enterprise digital identity and smart networking platforms.',
          badge: 'Winner',
          year: '2025',
          metric: 'Top SaaS 2025',
          order: 1,
          isVisible: true
        },
        {
          title: 'SOC 2 Type II & ISO/IEC 27001 Certified',
          subtitle: 'Information Security & Privacy Compliance',
          description: 'Rigorous third-party security audits verifying end-to-end encryption and compliance standards.',
          badge: 'Security Compliance',
          year: '2025',
          metric: '100% Compliant',
          order: 2,
          isVisible: true
        },
        {
          title: '500+ Enterprise Clients Globally',
          subtitle: 'Active High-Growth Tech & Corporate Teams',
          description: 'Over 50,000 corporate professionals connected using OneWinq smart cards and identity cloud.',
          badge: 'Adoption',
          year: '2025',
          metric: '50k+ Active Users',
          order: 3,
          isVisible: true
        },
        {
          title: '10,000,000+ Monthly API Operations',
          subtitle: 'Cloud Infrastructure Scale',
          description: 'Powering high-velocity card taps, dynamic QR resolutions, and directory integrations globally.',
          badge: 'Scale',
          year: '2025',
          metric: '99.99% Uptime',
          order: 4,
          isVisible: true
        }
      ],
      mediaGallery: [
        {
          title: 'OneWinq Global Developer & Innovation Summit 2026',
          type: 'photo',
          url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&fit=crop',
          date: new Date('2026-06-15'),
          order: 1,
          isVisible: true
        },
        {
          title: 'Next-Gen NFC Smart Hardware Keynote',
          type: 'video',
          url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&fit=crop',
          date: new Date('2026-05-10'),
          order: 2,
          isVisible: true
        },
        {
          title: 'OneWinq Featured in Silicon Review & TechCrunch',
          type: 'news',
          url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1000&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&fit=crop',
          date: new Date('2026-04-20'),
          order: 3,
          isVisible: true
        },
        {
          title: 'Distributed Systems & Cloud Architecture Workshop',
          type: 'photo',
          url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&fit=crop',
          date: new Date('2026-03-05'),
          order: 4,
          isVisible: true
        }
      ],
      branding: {
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=250&h=250&fit=crop',
        coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400&h=500&fit=crop',
        primaryColor: '#6366f1',
        secondaryColor: '#090d16',
        accentColor: '#818cf8',
        fontHeading: 'Inter',
        fontBody: 'Inter',
        themeMode: 'dark'
      },
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/onewinq', order: 1, isVisible: true },
        { platform: 'GitHub', url: 'https://github.com/onewinq', order: 2, isVisible: true },
        { platform: 'Twitter', url: 'https://twitter.com/onewinq', order: 3, isVisible: true },
        { platform: 'YouTube', url: 'https://youtube.com/@onewinq', order: 4, isVisible: true },
        { platform: 'Discord', url: 'https://discord.gg/onewinq', order: 5, isVisible: true }
      ],
      isPublic: true
    },
    { upsert: true, new: true }
  );

  logger.info('✅ Seeded software enterprise company profile and organization settings successfully.');
};
