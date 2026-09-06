import companyMark from '../../../assets/images/company-mark.svg'
import companyCover from '../../../assets/images/company-cover.svg'
import aboutStory from '../../../assets/images/about-story.svg'
import avaMorgan from '../../../assets/images/team-ava.svg'
import noorPatel from '../../../assets/images/team-noor.svg'
import mateoSilva from '../../../assets/images/team-mateo.svg'
import productCards from '../../../assets/images/product-cards.svg'
import productWorkspace from '../../../assets/images/product-workspace.svg'
import productVerification from '../../../assets/images/product-verification.svg'
import productBrand from '../../../assets/images/product-brand.svg'
import identityCards from '../../../assets/images/project-identity.svg'
import identityHub from '../../../assets/images/project-hub.svg'
import verifiedCredentials from '../../../assets/images/project-credentials.svg'
import productLaunch from '../../../assets/images/media-launch.svg'
import teamOffsite from '../../../assets/images/media-team.svg'
import futureSummit from '../../../assets/images/media-summit.svg'

export const headerData = {
  coverImage: companyCover,
  logo: companyMark,
  badge: 'Verified company',
  category: 'Enterprise software',
}

export const statsData = [
  { label: 'Team members', value: '126', detail: '+18% this year' },
  { label: 'Years building', value: '08', detail: 'Since 2016' },
  { label: 'Countries reached', value: '24', detail: 'Across 4 regions' },
  { label: 'Projects shipped', value: '48', detail: 'And counting' },
]

export const overviewData = {
  eyebrow: 'At a glance',
  title: 'The trusted identity layer for modern teams',
  description:
    'OneWinq unifies company branding, employee digital identities, and verified credentials into a seamless, modern platform.',
  highlights: [
    { title: 'One place to belong', description: 'Give every team member a polished, consistent digital presence.', icon: 'layers' },
    { title: 'Verified by design', description: 'Make credentials easy to trust with secure, flexible verification.', icon: 'shield' },
    { title: 'Built for momentum', description: 'Move from first hello to meaningful connection in fewer clicks.', icon: 'sparkles' },
  ],
}

export const aboutData = {
  eyebrow: 'Our story',
  title: 'Digital presence should feel human',
  paragraphs: [
    'OneWinq is on a mission to modernize how enterprises represent their brand and empower their workforce with verified, elegant digital identity tools.',
    'Our team brings together deep experience in identity, security, and thoughtful product design to make every business connection more meaningful.',
  ],
  mission: 'Empowering companies and their people with seamless digital presence and trusted identity infrastructure.',
  vision: 'To be the standard digital identity fabric for progressive enterprises worldwide.',
  images: [aboutStory],
  values: [
    { title: 'Customer obsession', description: 'We build every feature with relentless care for user experience.', icon: 'heart' },
    { title: 'Security first', description: 'Enterprise privacy and zero-trust security are in our DNA.', icon: 'shield' },
    { title: 'Radical transparency', description: 'Clear communication, open standards, and verified information.', icon: 'eye' },
  ],
}

export const servicesData = {
  eyebrow: 'What we do',
  title: 'Everything your company identity needs',
  description: 'Simple, connected tools that help your people show up as the best version of your brand.',
  items: [
    { title: 'OneWinq Digital Cards', description: 'Instant NFC and QR-enabled employee smart cards.', icon: 'scan', image: productCards },
    { title: 'Enterprise Identity Hub', description: 'A centralized directory with access governance built in.', icon: 'grid', image: productWorkspace },
    { title: 'Verified Credentials', description: 'Cryptographically secured identity proofs that travel with your people.', icon: 'badge', image: productVerification },
    { title: 'Brand Workspace', description: 'Keep every touchpoint on-brand with one living source of truth.', icon: 'palette', image: productBrand },
  ],
}

export const teamData = {
  eyebrow: 'Meet the team',
  title: 'A small team with a big point of view',
  members: [
    { name: 'Ava Morgan', role: 'Chief Executive Officer', location: 'San Francisco', image: avaMorgan },
    { name: 'Noor Patel', role: 'VP, Product & Design', location: 'London', image: noorPatel },
    { name: 'Mateo Silva', role: 'VP, Engineering', location: 'Lisbon', image: mateoSilva },
  ],
}

export const projectsData = {
  eyebrow: 'Selected work',
  title: 'Ideas made useful',
  items: [
    { title: 'Digital Identity Cards', category: 'Product platform', year: '2024', description: 'A new standard for sharing who you are at work.', image: identityCards },
    { title: 'Identity Hub', category: 'Enterprise systems', year: '2023', description: 'One connected home for every team identity.', image: identityHub },
    { title: 'Verified Credentials', category: 'Trust infrastructure', year: '2023', description: 'Proof that keeps up with people and their careers.', image: verifiedCredentials },
  ],
}

export const achievementsData = {
  eyebrow: 'Milestones',
  title: 'Progress worth sharing',
  items: [
    { year: '2024', title: 'Series A funded', description: 'Raised $12M to make trusted identity accessible to every team.', icon: 'rocket' },
    { year: '2023', title: '1 million connections', description: 'People used OneWinq to make their next introduction count.', icon: 'users' },
    { year: '2022', title: 'SOC 2 Type II', description: 'Earned the trust of ambitious enterprises around the world.', icon: 'award' },
  ],
}

export const mediaData = {
  eyebrow: 'In the press',
  title: 'A closer look at OneWinq',
  items: [
    { title: 'Launching a more human company identity', source: 'OneWinq Journal', date: 'May 14, 2024', image: productLaunch },
    { title: 'The people behind the platform', source: 'Inside OneWinq', date: 'Feb 08, 2024', image: teamOffsite },
    { title: 'Building trust into every introduction', source: 'Future of Work Summit', date: 'Oct 21, 2023', image: futureSummit },
  ],
}

export const contactData = {
  eyebrow: 'Keep in touch',
  title: 'Let’s build what’s next',
  description: 'Have a question, an idea, or a team ready for a better company identity? We would love to hear from you.',
  officeHours: 'Monday – Friday, 9:00 AM – 6:00 PM PST',
  socialLinks: [
    { label: 'LinkedIn', href: 'https://linkedin.com/company/onewinq' },
    { label: 'X', href: 'https://x.com/onewinq' },
    { label: 'GitHub', href: 'https://github.com/onewinq' },
  ],
}

export const companyData = {
  header: headerData,
  stats: statsData,
  overview: overviewData,
  about: aboutData,
  services: servicesData,
  team: teamData,
  projects: projectsData,
  achievements: achievementsData,
  media: mediaData,
  contact: contactData,
}

export const aboutImages = [aboutStory]
export const productImages = [productCards, productWorkspace, productVerification, productBrand]

export default companyData
