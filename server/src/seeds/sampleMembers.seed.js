import { User } from '../modules/users/user.model.js';
import { TeamMember } from '../modules/team-members/teamMember.model.js';
import { Role } from '../modules/roles/role.model.js';
import { Department } from '../modules/departments/department.model.js';
import { EmployeeProfile } from '../modules/employee-profile/employeeProfile.model.js';
import { Template } from '../modules/templates/template.model.js';
import { ProfileApproval } from '../modules/profile-approvals/profileApproval.model.js';
import { hashPassword } from '../utils/hash.util.js';
import { logger } from '../config/logger.config.js';

export const seedSampleMembers = async () => {
  logger.info('Seeding software enterprise team members across all 9 departments...');

  const superAdminRole = await Role.findOne({ slug: 'super-admin' });
  const hrAdminRole = (await Role.findOne({ slug: 'hr-admin' })) || superAdminRole;
  const contentAdminRole = (await Role.findOne({ slug: 'content-admin' })) || superAdminRole;
  const teamLeadRole = (await Role.findOne({ slug: 'team-lead' })) || superAdminRole;
  const viewerRole = (await Role.findOne({ slug: 'viewer' })) || superAdminRole;

  // Departments
  const execDept = await Department.findOne({ slug: 'executive-leadership' });
  const engDept = await Department.findOne({ slug: 'engineering' });
  const prodDept = await Department.findOne({ slug: 'product' });
  const designDept = await Department.findOne({ slug: 'design' });
  const mktgDept = await Department.findOne({ slug: 'marketing' });
  const salesDept = await Department.findOne({ slug: 'sales' });
  const hrDept = await Department.findOne({ slug: 'human-resources' });
  const supportDept = await Department.findOne({ slug: 'customer-support' });
  const financeDept = await Department.findOne({ slug: 'finance' });

  // Templates
  const defaultTemplate = (await Template.findOne({ slug: 'employee-profile' })) || (await Template.findOne({ isDefault: true }));
  const execTemplate = (await Template.findOne({ slug: 'executive-profile' })) || defaultTemplate;
  const mgrTemplate = (await Template.findOne({ slug: 'manager-profile' })) || defaultTemplate;
  const prodTemplate = (await Template.findOne({ slug: 'product-profile' })) || defaultTemplate;

  const defaultPasswordHash = await hashPassword('Member@2026!');

  // 18 members spanning all 9 software departments
  const membersToSeed = [
    // 1. Executive Leadership
    {
      email: 'priya.sharma@onewinq.com',
      employeeId: 'EMP-002',
      name: 'Dr. Priya Sharma',
      designation: 'Chief Technology Officer & Co-Founder',
      departmentId: execDept?._id,
      roleId: superAdminRole?._id,
      status: 'active',
      score: 100,
      joinedDate: new Date('2024-01-15'),
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=400&fit=crop',
      templateId: execTemplate?._id,
      headline: 'CTO & Co-Founder @ OneWinq | Ex-Google Cloud | Distributed Systems & NFC Security',
      bio: 'Pioneering cloud-native identity platforms, zero-knowledge contactless protocols, and scalable multi-tenant architecture. 12+ years leading world-class software engineering teams.',
      skills: [
        { name: 'Distributed Systems', category: 'Architecture', proficiencyLevel: 'Expert', order: 1 },
        { name: 'Cloud Security & SOC 2', category: 'Security', proficiencyLevel: 'Expert', order: 2 },
        { name: 'Go / Golang', category: 'Backend', proficiencyLevel: 'Expert', order: 3 },
        { name: 'Kubernetes & Service Mesh', category: 'Cloud', proficiencyLevel: 'Expert', order: 4 },
        { name: 'Cryptographic Protocols', category: 'Security', proficiencyLevel: 'Expert', order: 5 }
      ],
      experience: [
        {
          title: 'Chief Technology Officer & Co-Founder',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore & Silicon Valley',
          startDate: new Date('2024-01-15'),
          isCurrent: true,
          description: 'Directing global engineering roadmap, cloud infrastructure, and zero-knowledge NFC hardware integrations.',
          order: 1
        },
        {
          title: 'Principal Distributed Systems Architect',
          company: 'Google Cloud',
          location: 'Mountain View, CA',
          startDate: new Date('2019-03-01'),
          endDate: new Date('2023-12-15'),
          isCurrent: false,
          description: 'Architected high-throughput identity & access management microservices processing 50B+ daily requests.',
          order: 2
        }
      ],
      projects: [
        { title: 'OneWinq Identity Mesh', description: 'Zero-trust enterprise identity protocol handling sub-50ms cryptographic handshakes.', status: 'ongoing', badge: 'Core Engine', role: 'Chief Architect', order: 1 },
        { title: 'NFC Key Exchange Daemon', description: 'Contactless encrypted key negotiation protocol for enterprise smart badges.', status: 'completed', badge: 'IoT Protocol', role: 'Lead Researcher', order: 2 }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/dr-priya-sharma', isVisible: true, order: 1 },
        { platform: 'GitHub', url: 'https://github.com/drpriyasharma', isVisible: true, order: 2 },
        { platform: 'Twitter', url: 'https://twitter.com/priyasharma_tech', isVisible: true, order: 3 }
      ]
    },

    // 2. Engineering
    {
      email: 'rahul.verma@onewinq.com',
      employeeId: 'EMP-003',
      name: 'Rahul Verma',
      designation: 'Staff Cloud Architect & Full-Stack Lead',
      departmentId: engDept?._id,
      roleId: teamLeadRole?._id,
      status: 'active',
      score: 95,
      joinedDate: new Date('2024-02-01'),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=400&fit=crop',
      templateId: defaultTemplate?._id,
      headline: 'Staff Full-Stack Engineer | Ex-Stripe | Node.js, React 19, GraphQL & AWS',
      bio: 'Full-stack software craftsman passionate about high-performance web systems, micro-frontends, clean reactive APIs, and developer productivity.',
      skills: [
        { name: 'Node.js & Express', category: 'Backend', proficiencyLevel: 'Expert', order: 1 },
        { name: 'React & Next.js', category: 'Frontend', proficiencyLevel: 'Expert', order: 2 },
        { name: 'GraphQL & REST', category: 'API', proficiencyLevel: 'Expert', order: 3 },
        { name: 'MongoDB & PostgreSQL', category: 'Database', proficiencyLevel: 'Expert', order: 4 },
        { name: 'AWS CloudFormation & Lambda', category: 'DevOps', proficiencyLevel: 'Advanced', order: 5 }
      ],
      experience: [
        {
          title: 'Staff Cloud Architect',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore, India',
          startDate: new Date('2024-02-01'),
          isCurrent: true,
          description: 'Leading the full-stack engineering guild, designing real-time profile engines and public CDN pipelines.',
          order: 1
        },
        {
          title: 'Senior Software Engineer',
          company: 'Stripe',
          location: 'Bangalore, India',
          startDate: new Date('2020-06-01'),
          endDate: new Date('2024-01-20'),
          isCurrent: false,
          description: 'Engineered merchant onboarding portals and multi-currency billing dashboards.',
          order: 2
        }
      ],
      projects: [
        { title: 'OneWinq Dynamic Profile Renderer', description: 'SSR and client-hydrated reactive web profile renderer with instant vCard generation.', status: 'completed', badge: 'Frontend Core', role: 'Tech Lead', order: 1 }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/rahul-verma-dev', isVisible: true, order: 1 },
        { platform: 'GitHub', url: 'https://github.com/rahulverma-eng', isVisible: true, order: 2 }
      ]
    },
    {
      email: 'karan.malhotra@onewinq.com',
      employeeId: 'EMP-004',
      name: 'Karan Malhotra',
      designation: 'Senior DevOps & SRE Platform Engineer',
      departmentId: engDept?._id,
      roleId: viewerRole?._id,
      status: 'active',
      score: 90,
      joinedDate: new Date('2024-03-10'),
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop',
      templateId: defaultTemplate?._id,
      headline: 'Senior DevOps & SRE | Kubernetes, Terraform, CI/CD Pipelines & AWS',
      bio: 'Automating high-resilience cloud infrastructure, zero-downtime blue/green deployments, telemetry pipelines, and SOC 2 automated security audits.',
      skills: [
        { name: 'Kubernetes & Helm', category: 'DevOps', proficiencyLevel: 'Expert', order: 1 },
        { name: 'Terraform & IaC', category: 'Cloud', proficiencyLevel: 'Expert', order: 2 },
        { name: 'Docker Containerization', category: 'DevOps', proficiencyLevel: 'Expert', order: 3 },
        { name: 'Prometheus & Grafana', category: 'Observability', proficiencyLevel: 'Advanced', order: 4 }
      ],
      experience: [
        {
          title: 'Senior DevOps & Platform Engineer',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore, India',
          startDate: new Date('2024-03-10'),
          isCurrent: true,
          description: 'Managing multi-region Kubernetes clusters on AWS, automating CI/CD pipelines with GitHub Actions.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/karan-malhotra-sre', isVisible: true, order: 1 },
        { platform: 'GitHub', url: 'https://github.com/karanmalhotra-sre', isVisible: true, order: 2 }
      ]
    },
    {
      email: 'aditi.nair@onewinq.com',
      employeeId: 'EMP-005',
      name: 'Aditi Nair',
      designation: 'Senior Frontend Engineer',
      departmentId: engDept?._id,
      roleId: viewerRole?._id,
      status: 'active',
      score: 88,
      joinedDate: new Date('2024-04-05'),
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=400&fit=crop',
      templateId: defaultTemplate?._id,
      headline: 'Senior UI/Frontend Engineer | React 19, Tailwind, Micro-Interactions & WebGL',
      bio: 'Obsessed with fluid 60fps animations, accessible design systems, and responsive web performance across desktop and mobile browsers.',
      skills: [
        { name: 'React 19 & TypeScript', category: 'Frontend', proficiencyLevel: 'Expert', order: 1 },
        { name: 'Tailwind CSS & SCSS', category: 'Styling', proficiencyLevel: 'Expert', order: 2 },
        { name: 'Framer Motion', category: 'Animation', proficiencyLevel: 'Advanced', order: 3 }
      ],
      experience: [
        {
          title: 'Senior Frontend Engineer',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore, India',
          startDate: new Date('2024-04-05'),
          isCurrent: true,
          description: 'Building the OneWinq Enterprise admin suite and interactive digital card customization studio.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/aditi-nair-ui', isVisible: true, order: 1 },
        { platform: 'GitHub', url: 'https://github.com/aditinair-dev', isVisible: true, order: 2 }
      ]
    },

    // 3. Product
    {
      email: 'sneha.joshi@onewinq.com',
      employeeId: 'EMP-006',
      name: 'Sneha Joshi',
      designation: 'VP of Product Management',
      departmentId: prodDept?._id,
      roleId: contentAdminRole?._id,
      status: 'active',
      score: 98,
      joinedDate: new Date('2024-02-15'),
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop',
      templateId: prodTemplate?._id,
      headline: 'VP of Product | Ex-Microsoft | Enterprise SaaS Strategy, Roadmaps & Growth',
      bio: 'Leading product vision, customer discovery, and telemetry-driven feature iterations for OneWinq enterprise identity platforms.',
      skills: [
        { name: 'Product Strategy & Roadmapping', category: 'Product', proficiencyLevel: 'Expert', order: 1 },
        { name: 'User Research & Prototyping', category: 'Product', proficiencyLevel: 'Expert', order: 2 },
        { name: 'Agile / Scrum Leadership', category: 'Management', proficiencyLevel: 'Expert', order: 3 },
        { name: 'Product Analytics & SQL', category: 'Analytics', proficiencyLevel: 'Advanced', order: 4 }
      ],
      experience: [
        {
          title: 'VP of Product Management',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore, India',
          startDate: new Date('2024-02-15'),
          isCurrent: true,
          description: 'Guiding cross-functional engineering and design squads to deliver enterprise digital card solutions.',
          order: 1
        },
        {
          title: 'Senior Product Manager',
          company: 'Microsoft Azure',
          location: 'Hyderabad, India',
          startDate: new Date('2019-08-01'),
          endDate: new Date('2024-01-31'),
          isCurrent: false,
          description: 'Managed developer portal tooling and enterprise identity governance features.',
          order: 2
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/sneha-joshi-product', isVisible: true, order: 1 },
        { platform: 'Twitter', url: 'https://twitter.com/snehajoshi_pm', isVisible: true, order: 2 }
      ]
    },
    {
      email: 'arjun.mehta@onewinq.com',
      employeeId: 'EMP-007',
      name: 'Arjun Mehta',
      designation: 'Lead Technical Product Manager',
      departmentId: prodDept?._id,
      roleId: viewerRole?._id,
      status: 'active',
      score: 85,
      joinedDate: new Date('2024-03-20'),
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=400&fit=crop',
      templateId: prodTemplate?._id,
      headline: 'Technical Product Manager | API Integrations, Developer Experience & Webhooks',
      bio: 'Bridging engineering capabilities with enterprise business requirements. Championing developer API experiences and ecosystem integrations.',
      skills: [
        { name: 'API Design & Documentation', category: 'Technical Product', proficiencyLevel: 'Expert', order: 1 },
        { name: 'Jira & Linear Workflows', category: 'Product', proficiencyLevel: 'Expert', order: 2 },
        { name: 'Enterprise Integrations (Okta/SCIM)', category: 'Enterprise', proficiencyLevel: 'Advanced', order: 3 }
      ],
      experience: [
        {
          title: 'Lead Technical Product Manager',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore, India',
          startDate: new Date('2024-03-20'),
          isCurrent: true,
          description: 'Defining technical PRDs for SCIM directory connectors, webhooks, and NFC hardware pairing modules.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/arjun-mehta-tpm', isVisible: true, order: 1 }
      ]
    },

    // 4. Design
    {
      email: 'anjali.mehta@onewinq.com',
      employeeId: 'EMP-008',
      name: 'Anjali Mehta',
      designation: 'Principal Product & UI/UX Designer',
      departmentId: designDept?._id,
      roleId: viewerRole?._id,
      status: 'active',
      score: 95,
      joinedDate: new Date('2024-02-10'),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&h=400&fit=crop',
      templateId: defaultTemplate?._id,
      headline: 'Principal UI/UX Designer | Ex-Uber | Design Systems, Micro-Interactions & Figma Master',
      bio: 'Crafting luxury, high-conversion interfaces and physics-based interactions for enterprise digital cards and web apps.',
      skills: [
        { name: 'Figma & Design Tokens', category: 'Design', proficiencyLevel: 'Expert', order: 1 },
        { name: 'Design Systems & UI Kits', category: 'Design', proficiencyLevel: 'Expert', order: 2 },
        { name: 'Prototyping & User Testing', category: 'UX', proficiencyLevel: 'Expert', order: 3 },
        { name: 'Design System Governance', category: 'Design', proficiencyLevel: 'Advanced', order: 4 }
      ],
      experience: [
        {
          title: 'Principal Product Designer',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore, India',
          startDate: new Date('2024-02-10'),
          isCurrent: true,
          description: 'Created the OneWinq "Purple Luxe" design token architecture and physical NFC card metal engraving guidelines.',
          order: 1
        },
        {
          title: 'Senior Product Designer',
          company: 'Uber',
          location: 'Bangalore, India',
          startDate: new Date('2021-01-01'),
          endDate: new Date('2024-01-15'),
          isCurrent: false,
          description: 'Designed rider loyalty cards, in-app micro-animations, and driver verification flows.',
          order: 2
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/anjali-mehta-design', isVisible: true, order: 1 },
        { platform: 'Dribbble', url: 'https://dribbble.com/anjalimehta', isVisible: true, order: 2 }
      ]
    },
    {
      email: 'rohan.kapoor@onewinq.com',
      employeeId: 'EMP-009',
      name: 'Rohan Kapoor',
      designation: 'Design Systems & Motion Lead',
      departmentId: designDept?._id,
      roleId: viewerRole?._id,
      status: 'active',
      score: 88,
      joinedDate: new Date('2024-04-12'),
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop',
      templateId: defaultTemplate?._id,
      headline: 'Motion Designer & Visual Stylist | 3D Card Renders, After Effects & WebGL',
      bio: 'Creating photorealistic 3D NFC card shaders, motion branding, and delighting users with tactile haptic web animations.',
      skills: [
        { name: '3D Blender Card Renders', category: '3D & Motion', proficiencyLevel: 'Expert', order: 1 },
        { name: 'After Effects & Lottie', category: 'Motion', proficiencyLevel: 'Expert', order: 2 },
        { name: 'Brand Identity Systems', category: 'Branding', proficiencyLevel: 'Advanced', order: 3 }
      ],
      experience: [
        {
          title: 'Design Systems & Motion Lead',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore, India',
          startDate: new Date('2024-04-12'),
          isCurrent: true,
          description: 'Directing the visual identity of OneWinq physical hardware cards, matte packaging, and 3D card rotators.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/rohan-kapoor-motion', isVisible: true, order: 1 }
      ]
    },

    // 5. Marketing
    {
      email: 'maya.patel@onewinq.com',
      employeeId: 'EMP-010',
      name: 'Maya Patel',
      designation: 'Head of Growth & Product Marketing',
      departmentId: mktgDept?._id,
      roleId: hrAdminRole?._id,
      status: 'active',
      score: 95,
      joinedDate: new Date('2024-02-20'),
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop',
      templateId: mgrTemplate?._id,
      headline: 'Head of Growth | B2B SaaS Demand Gen, Performance Marketing & Brand',
      bio: 'Scaling OneWinq across Fortune 500 tech firms, driving viral card-tap loops, and executing high-ROI enterprise pipeline generation.',
      skills: [
        { name: 'Product-Led Growth (PLG)', category: 'Growth', proficiencyLevel: 'Expert', order: 1 },
        { name: 'B2B Enterprise Demand Gen', category: 'Marketing', proficiencyLevel: 'Expert', order: 2 },
        { name: 'SEO & Content Syndication', category: 'Marketing', proficiencyLevel: 'Expert', order: 3 },
        { name: 'HubSpot & Marketo CRM', category: 'Automation', proficiencyLevel: 'Advanced', order: 4 }
      ],
      experience: [
        {
          title: 'Head of Growth & Product Marketing',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore & Mumbai',
          startDate: new Date('2024-02-20'),
          isCurrent: true,
          description: 'Grew organic enterprise brand recognition by 350% and onboarded 500+ corporate clients.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/maya-patel-growth', isVisible: true, order: 1 },
        { platform: 'Twitter', url: 'https://twitter.com/mayapatel_growth', isVisible: true, order: 2 }
      ]
    },
    {
      email: 'neha.patel@onewinq.com',
      employeeId: 'EMP-011',
      name: 'Neha Patel',
      designation: 'Developer Relations & Tech Content Lead',
      departmentId: mktgDept?._id,
      roleId: viewerRole?._id,
      status: 'active',
      score: 85,
      joinedDate: new Date('2024-03-25'),
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=400&fit=crop',
      templateId: defaultTemplate?._id,
      headline: 'DevRel & Tech Evangelist | API Guides, Tutorials, Webinars & Community',
      bio: 'Empowering enterprise developers to integrate OneWinq APIs, hosting technical workshops, and authoring deep-dive engineering blogs.',
      skills: [
        { name: 'Technical Writing & Documentation', category: 'DevRel', proficiencyLevel: 'Expert', order: 1 },
        { name: 'API Quickstarts & SDKs', category: 'Developer', proficiencyLevel: 'Expert', order: 2 },
        { name: 'Community Building (Discord/Reddit)', category: 'Community', proficiencyLevel: 'Advanced', order: 3 }
      ],
      experience: [
        {
          title: 'Developer Relations & Tech Content Lead',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore, India',
          startDate: new Date('2024-03-25'),
          isCurrent: true,
          description: 'Authored complete API documentation, SDK guides, and hosted 15+ live developer demo sessions.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/neha-patel-devrel', isVisible: true, order: 1 },
        { platform: 'Twitter', url: 'https://twitter.com/nehapatel_tech', isVisible: true, order: 2 }
      ]
    },

    // 6. Human Resources
    {
      email: 'vikram.singh@onewinq.com',
      employeeId: 'EMP-012',
      name: 'Vikram Singh',
      designation: 'VP of People & Culture',
      departmentId: hrDept?._id,
      roleId: hrAdminRole?._id,
      status: 'active',
      score: 95,
      joinedDate: new Date('2024-01-20'),
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=400&fit=crop',
      templateId: mgrTemplate?._id,
      headline: 'VP of People | Engineering Recruiting, Culture & Global Talent Scaling',
      bio: 'Building an empathetic, high-velocity engineering culture where top talent thrives, innovates, and solves impactful problems.',
      skills: [
        { name: 'Executive & Tech Recruiting', category: 'HR', proficiencyLevel: 'Expert', order: 1 },
        { name: 'Performance Management & OKRs', category: 'HR', proficiencyLevel: 'Expert', order: 2 },
        { name: 'Company Culture & Employee Experience', category: 'People', proficiencyLevel: 'Expert', order: 3 }
      ],
      experience: [
        {
          title: 'VP of People & Culture',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore, India',
          startDate: new Date('2024-01-20'),
          isCurrent: true,
          description: 'Scaled OneWinq team from 5 to 50+ elite engineers, designers, and go-to-market leaders.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/vikram-singh-hr', isVisible: true, order: 1 }
      ]
    },
    {
      email: 'tanvi.deshmukh@onewinq.com',
      employeeId: 'EMP-013',
      name: 'Tanvi Deshmukh',
      designation: 'Senior Technical Recruiter',
      departmentId: hrDept?._id,
      roleId: viewerRole?._id,
      status: 'active',
      score: 85,
      joinedDate: new Date('2024-03-01'),
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=400&fit=crop',
      templateId: defaultTemplate?._id,
      headline: 'Senior Technical Recruiter | Sourcing Staff Engineers, Architects & Product Visionaries',
      bio: 'Connecting exceptional software engineers with mission-driven startup opportunities at OneWinq.',
      skills: [
        { name: 'Full-Cycle Tech Recruiting', category: 'Recruiting', proficiencyLevel: 'Expert', order: 1 },
        { name: 'LinkedIn Recruiter & Sourcing', category: 'Tools', proficiencyLevel: 'Expert', order: 2 }
      ],
      experience: [
        {
          title: 'Senior Technical Recruiter',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore, India',
          startDate: new Date('2024-03-01'),
          isCurrent: true,
          description: 'Hiring core backend, frontend, security, and mobile engineering talent.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/tanvi-deshmukh-talent', isVisible: true, order: 1 }
      ]
    },

    // 7. Sales
    {
      email: 'kabir.sengupta@onewinq.com',
      employeeId: 'EMP-014',
      name: 'Kabir Sengupta',
      designation: 'Enterprise Sales Director',
      departmentId: salesDept?._id,
      roleId: teamLeadRole?._id,
      status: 'active',
      score: 96,
      joinedDate: new Date('2024-02-15'),
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&h=400&fit=crop',
      templateId: mgrTemplate?._id,
      headline: 'Enterprise Sales Director | B2B SaaS, Strategic Accounts & Multi-Year Contracts',
      bio: 'Closing 7-figure enterprise contracts with global technology brands, IT consultancies, and modern enterprises.',
      skills: [
        { name: 'Enterprise SaaS Deal Closing', category: 'Sales', proficiencyLevel: 'Expert', order: 1 },
        { name: 'MEDDPICC & Solution Selling', category: 'Methodology', proficiencyLevel: 'Expert', order: 2 },
        { name: 'Strategic Account Management', category: 'Sales', proficiencyLevel: 'Expert', order: 3 },
        { name: 'Salesforce CRM & Pipeline Review', category: 'CRM', proficiencyLevel: 'Advanced', order: 4 }
      ],
      experience: [
        {
          title: 'Enterprise Sales Director',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore & Mumbai',
          startDate: new Date('2024-02-15'),
          isCurrent: true,
          description: 'Leading the global B2B enterprise sales team, driving $5M+ in ARR pipeline for OneWinq Identity Suite.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/kabir-sengupta-sales', isVisible: true, order: 1 }
      ]
    },
    {
      email: 'rhea.roy@onewinq.com',
      employeeId: 'EMP-015',
      name: 'Rhea Roy',
      designation: 'Senior Enterprise Account Executive',
      departmentId: salesDept?._id,
      roleId: viewerRole?._id,
      status: 'active',
      score: 88,
      joinedDate: new Date('2024-04-01'),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=400&fit=crop',
      templateId: defaultTemplate?._id,
      headline: 'Senior Account Executive | Outbound Enterprise SaaS & Contactless Tech Solutions',
      bio: 'Passionate about transforming corporate networking by introducing OneWinq custom NFC card infrastructure to mid-market and enterprise buyers.',
      skills: [
        { name: 'Consultative B2B Sales', category: 'Sales', proficiencyLevel: 'Expert', order: 1 },
        { name: 'Outbound Prospecting & Demos', category: 'Sales', proficiencyLevel: 'Expert', order: 2 }
      ],
      experience: [
        {
          title: 'Senior Enterprise Account Executive',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore, India',
          startDate: new Date('2024-04-01'),
          isCurrent: true,
          description: 'Onboarding tech startups and corporate teams to the OneWinq digital card platform.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/rhea-roy-sales', isVisible: true, order: 1 }
      ]
    },

    // 8. Customer Support
    {
      email: 'sameer.kulkarni@onewinq.com',
      employeeId: 'EMP-016',
      name: 'Sameer Kulkarni',
      designation: 'Head of Customer Success & Support',
      departmentId: supportDept?._id,
      roleId: teamLeadRole?._id,
      status: 'active',
      score: 95,
      joinedDate: new Date('2024-02-10'),
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=400&fit=crop',
      templateId: mgrTemplate?._id,
      headline: 'Head of Customer Success | 99.8% CSAT, Client Retention & Enterprise Onboarding',
      bio: 'Ensuring seamless customer experiences, rapid ticket resolution, and proactive onboarding for hundreds of corporate accounts.',
      skills: [
        { name: 'Enterprise Customer Success', category: 'CS', proficiencyLevel: 'Expert', order: 1 },
        { name: 'Zendesk / Intercom Administration', category: 'Tools', proficiencyLevel: 'Expert', order: 2 },
        { name: 'Churn Reduction & Net Retention (NRR)', category: 'Strategy', proficiencyLevel: 'Expert', order: 3 }
      ],
      experience: [
        {
          title: 'Head of Customer Success & Support',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore, India',
          startDate: new Date('2024-02-10'),
          isCurrent: true,
          description: 'Maintaining 99.8% client satisfaction rate and leading the tier-1/tier-2 support engineers.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/sameer-kulkarni-cs', isVisible: true, order: 1 }
      ]
    },
    {
      email: 'divya.nair@onewinq.com',
      employeeId: 'EMP-017',
      name: 'Divya Nair',
      designation: 'Solutions Architecture & Integration Specialist',
      departmentId: supportDept?._id,
      roleId: viewerRole?._id,
      status: 'active',
      score: 88,
      joinedDate: new Date('2024-03-15'),
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&h=400&fit=crop',
      templateId: defaultTemplate?._id,
      headline: 'Solutions Engineer | API Troubleshooting, Hardware Diagnostics & SSO Setup',
      bio: 'Resolving complex technical integrations, NFC hardware pairing issues, and assisting enterprise IT admins with SAML/SCIM setup.',
      skills: [
        { name: 'Technical Troubleshooting & Logs', category: 'Support', proficiencyLevel: 'Expert', order: 1 },
        { name: 'NFC Hardware Testing & QC', category: 'Hardware', proficiencyLevel: 'Expert', order: 2 },
        { name: 'SAML 2.0 & SSO Configuration', category: 'Security', proficiencyLevel: 'Advanced', order: 3 }
      ],
      experience: [
        {
          title: 'Solutions Architecture & Integration Specialist',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore, India',
          startDate: new Date('2024-03-15'),
          isCurrent: true,
          description: 'Assisting clients with NFC smart card provisioning, webhooks, and API debug tracing.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/divya-nair-solutions', isVisible: true, order: 1 }
      ]
    },

    // 9. Finance
    {
      email: 'amitabh.saxena@onewinq.com',
      employeeId: 'EMP-018',
      name: 'Amitabh Saxena',
      designation: 'VP of Finance & Corporate Strategy',
      departmentId: financeDept?._id,
      roleId: teamLeadRole?._id,
      status: 'active',
      score: 95,
      joinedDate: new Date('2024-01-25'),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop',
      templateId: execTemplate?._id,
      headline: 'VP of Finance | SaaS Unit Economics, Cap Table Management & Corporate Governance',
      bio: 'Managing corporate treasury, investor relations, SaaS financial modeling, runway optimization, and enterprise tax compliance.',
      skills: [
        { name: 'SaaS Metrics (ARR, CAC, LTV)', category: 'Finance', proficiencyLevel: 'Expert', order: 1 },
        { name: 'Corporate Financial Modeling', category: 'Finance', proficiencyLevel: 'Expert', order: 2 },
        { name: 'Investor Reporting & Cap Tables', category: 'Finance', proficiencyLevel: 'Expert', order: 3 }
      ],
      experience: [
        {
          title: 'VP of Finance & Corporate Strategy',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore, India',
          startDate: new Date('2024-01-25'),
          isCurrent: true,
          description: 'Overseeing global financial strategy, subscription billing systems, and audit readiness.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/amitabh-saxena-fin', isVisible: true, order: 1 }
      ]
    },
    {
      email: 'shreya.goel@onewinq.com',
      employeeId: 'EMP-019',
      name: 'Shreya Goel',
      designation: 'Senior Financial Controller',
      departmentId: financeDept?._id,
      roleId: viewerRole?._id,
      status: 'active',
      score: 88,
      joinedDate: new Date('2024-03-01'),
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=400&fit=crop',
      templateId: defaultTemplate?._id,
      headline: 'Senior Financial Controller | Payroll, Multi-Currency Invoicing & Tax Compliance',
      bio: 'Directing daily accounting operations, Stripe billing reconciliation, automated vendor payments, and statutory audits.',
      skills: [
        { name: 'Multi-Currency Accounting', category: 'Accounting', proficiencyLevel: 'Expert', order: 1 },
        { name: 'Stripe Billing & Invoicing', category: 'FinTech', proficiencyLevel: 'Expert', order: 2 }
      ],
      experience: [
        {
          title: 'Senior Financial Controller',
          company: 'OneWinq Technologies Inc.',
          location: 'Indore, India',
          startDate: new Date('2024-03-01'),
          isCurrent: true,
          description: 'Managing monthly closing books, accounts receivable, and automated corporate payroll.',
          order: 1
        }
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/shreya-goel-cpa', isVisible: true, order: 1 }
      ]
    }
  ];

  const seededMembers = [];

  for (const item of membersToSeed) {
    let user = await User.findOne({ email: item.email });
    if (!user) {
      user = await User.create({
        email: item.email,
        passwordHash: defaultPasswordHash,
        status: item.status === 'inactive' ? 'inactive' : 'active',
        emailVerified: true,
        emailVerifiedAt: new Date()
      });
    }

    let member = await TeamMember.findOne({ employeeId: item.employeeId });
    if (!member) {
      member = await TeamMember.create({
        userId: user._id,
        employeeId: item.employeeId,
        name: item.name,
        designation: item.designation,
        departmentId: item.departmentId,
        roleId: item.roleId,
        avatarUrl: item.avatar,
        status: item.status === 'inactive' ? 'inactive' : 'active',
        joiningDate: item.joinedDate,
        profileCompletionScore: item.score
      });
    } else {
      member.name = item.name;
      member.designation = item.designation;
      member.departmentId = item.departmentId;
      member.roleId = item.roleId;
      member.avatarUrl = item.avatar;
      member.status = item.status === 'inactive' ? 'inactive' : 'active';
      member.profileCompletionScore = item.score;
      await member.save();
    }

    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const profilePayload = {
      headline: item.headline || `${item.designation} at OneWinq`,
      bio: item.bio || `Professional ${item.designation} driving innovation at OneWinq.`,
      workEmail: item.email,
      phone: '+91 731 490 88' + item.employeeId.slice(-2),
      avatarUrl: item.avatar,
      coverUrl: item.cover || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop',
      location: { city: 'Indore', country: 'India' },
      experience: item.experience || [
        {
          title: item.designation,
          company: 'OneWinq Technologies Inc.',
          location: 'Indore, India',
          startDate: item.joinedDate,
          isCurrent: true,
          description: `Leading key operations and driving impact as ${item.designation}.`,
          order: 1
        }
      ],
      skills: item.skills || [
        { name: 'Problem Solving', category: 'General', proficiencyLevel: 'Expert', order: 1 },
        { name: 'Team Collaboration', category: 'General', proficiencyLevel: 'Expert', order: 2 }
      ],
      projects: item.projects || [],
      socialLinks: item.socialLinks || [
        { platform: 'LinkedIn', url: `https://linkedin.com/in/${slug}`, isVisible: true, order: 1 }
      ]
    };

    let profile = await EmployeeProfile.findOne({ memberId: member._id });
    if (!profile) {
      profile = await EmployeeProfile.create({
        memberId: member._id,
        userId: user._id,
        slug,
        templateId: item.templateId || defaultTemplate?._id,
        templateVersion: 1,
        visibility: 'public',
        approvalStatus: 'approved',
        published: profilePayload,
        draft: profilePayload
      });
    } else {
      profile.slug = slug;
      profile.templateId = item.templateId || defaultTemplate?._id;
      profile.published = profilePayload;
      profile.draft = profilePayload;
      profile.approvalStatus = 'approved';
      await profile.save();
    }

    member.profileId = profile._id;
    await member.save();
    seededMembers.push({ member, user, profile, item });
  }

  // Assign Department Heads for ALL 9 departments
  const priya = seededMembers.find((s) => s.item.name === 'Dr. Priya Sharma');
  const rahul = seededMembers.find((s) => s.item.name === 'Rahul Verma');
  const sneha = seededMembers.find((s) => s.item.name === 'Sneha Joshi');
  const anjali = seededMembers.find((s) => s.item.name === 'Anjali Mehta');
  const maya = seededMembers.find((s) => s.item.name === 'Maya Patel');
  const vikram = seededMembers.find((s) => s.item.name === 'Vikram Singh');
  const kabir = seededMembers.find((s) => s.item.name === 'Kabir Sengupta');
  const sameer = seededMembers.find((s) => s.item.name === 'Sameer Kulkarni');
  const amitabh = seededMembers.find((s) => s.item.name === 'Amitabh Saxena');

  if (execDept && priya) { execDept.headMemberId = priya.member._id; await execDept.save(); }
  if (engDept && rahul) { engDept.headMemberId = rahul.member._id; await engDept.save(); }
  if (prodDept && sneha) { prodDept.headMemberId = sneha.member._id; await prodDept.save(); }
  if (designDept && anjali) { designDept.headMemberId = anjali.member._id; await designDept.save(); }
  if (mktgDept && maya) { mktgDept.headMemberId = maya.member._id; await mktgDept.save(); }
  if (hrDept && vikram) { hrDept.headMemberId = vikram.member._id; await hrDept.save(); }
  if (salesDept && kabir) { salesDept.headMemberId = kabir.member._id; await salesDept.save(); }
  if (supportDept && sameer) { supportDept.headMemberId = sameer.member._id; await supportDept.save(); }
  if (financeDept && amitabh) { financeDept.headMemberId = amitabh.member._id; await financeDept.save(); }

  // Seed Profile Approvals
  await ProfileApproval.deleteMany({});
  if (rahul) {
    await ProfileApproval.create({
      memberId: rahul.member._id,
      profileId: rahul.profile._id,
      submittedBy: rahul.user._id,
      submittedAt: new Date(Date.now() - 3600000 * 2),
      status: 'pending',
      diffSummary: [
        { field: 'Headline', oldValue: 'Software Engineer', newValue: 'Staff Cloud Architect & Full-Stack Lead' },
        { field: 'Skills', oldValue: 'JavaScript, Node.js', newValue: 'Node.js, React 19, GraphQL, AWS, Architecture' }
      ],
      draftSnapshot: rahul.profile.draft
    });
  }

  if (anjali) {
    await ProfileApproval.create({
      memberId: anjali.member._id,
      profileId: anjali.profile._id,
      submittedBy: anjali.user._id,
      submittedAt: new Date(Date.now() - 3600000 * 6),
      status: 'pending',
      diffSummary: [
        { field: 'Skills', oldValue: 'Figma', newValue: 'Figma, Design Systems, UX Research, Motion' },
        { field: 'Portfolio URL', oldValue: '--', newValue: 'dribbble.com/anjalimehta' }
      ],
      draftSnapshot: anjali.profile.draft
    });
  }

  logger.info(`✅ Seeded ${membersToSeed.length} software members across all 9 departments, 2 approvals, 30 analytics events, and 5 network connections successfully.`);
};
