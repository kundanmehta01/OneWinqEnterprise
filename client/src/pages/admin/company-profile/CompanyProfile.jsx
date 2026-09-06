import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Award,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Globe2,
  Image as ImageIcon,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  PieChart,
  ShieldCheck,
  Sparkles,
  Trophy,
  UsersRound,
  Verified,
  Youtube,
  ContactIcon,
  Loader2,
  Contact2
} from "lucide-react";
import { companyData } from "./companyData.js";
import {
  companyProfileService,
  teamMemberService,
  analyticsService,
  mediaService,
} from "../../../services";
import EditSectionModal from "./common/EditSectionModal";
import companyLogo from "../../../assets/logos/onewingimage.png";
import ContactConnectSection from "./sections/ContactConnect";

const fallbackImage = "/onewinq-office.png";
const tabs = [
  ["overview", "Overview", Sparkles],
  ["about", "About Company", Building2],
  ["services", "Products / Services", BriefcaseBusiness],
  ["team", "Team", UsersRound],
  ["projects", "Projects / Work", BriefcaseBusiness],
  ["achievements", "Achievements", Trophy],
  ["media", "Media / Updates", ImageIcon],
  ["contact", "Contact & Connect", Contact2],
];
const fallbackCopy = {
  description:
    "OneWinq Enterprise gives businesses and professionals a trusted identity layer to connect, collaborate, and grow with momentum in the digital world.",
  about:
    "OneWinq builds the identity layer behind modern professional relationships. Our platform helps organizations create, share, and manage connected profiles with the trust, clarity, and momentum enterprise teams expect.",
};
const unwrapList = (value) =>
  Array.isArray(value)
    ? value
    : value?.data || value?.members || value?.assets || [];
const safeText = (value, fallback = '') => {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map((item) => safeText(item)).filter(Boolean).join(' ');
  if (value && typeof value === 'object') return safeText(value.text || value.description || value.content || value.value, fallback);
  return fallback;
};
const findSection = (sections, type) =>
  sections.find(
    (section) => section.type === type && section.isVisible !== false,
  );

const profileStyles = `
.profile-dashboard{min-height:100vh;background:linear-gradient(180deg,#fbfbfe 0%,#f7f8fc 34%,#f4f5fa 100%);font-family:'Plus Jakarta Sans',sans-serif;color:#27223c}.profile-topbar{height:56px;border-bottom:1px solid #ecebf3;background:rgba(255,255,255,.88);backdrop-filter:blur(18px)}.profile-page-wrap{max-width:1380px;margin:0 auto;padding:18px 24px 28px}.profile-display{font-family:'Space Grotesk',sans-serif}.profile-banner{background:linear-gradient(100deg,#25105f 0%,#4e17ae 48%,#7f3be4 100%)}.profile-card{background:rgba(255,255,255,.94);border:1px solid rgba(228,226,239,.82);box-shadow:0 8px 24px rgba(61,45,115,.055);border-radius:14px}.profile-card-hover{transition:transform 180ms cubic-bezier(.23,1,.32,1),box-shadow 180ms ease,border-color 180ms ease}.profile-card-hover:hover{transform:translateY(-2px);box-shadow:0 15px 32px rgba(61,45,115,.11);border-color:#ded7f3}.profile-anchor{scroll-margin-top:108px}.profile-muted-label{font-size:10px;line-height:1.2;letter-spacing:.01em;color:#868297}.thin-profile-scrollbar{scrollbar-width:thin;scrollbar-color:#dcd3f1 transparent}.thin-profile-scrollbar::-webkit-scrollbar{height:5px}.thin-profile-scrollbar::-webkit-scrollbar-thumb{background:#ddd3f1;border-radius:999px}@media(max-width:900px){.profile-page-wrap{padding:14px 16px 24px}}@media(max-width:640px){.profile-topbar{height:52px}.profile-page-wrap{padding:12px 12px 22px}.profile-card{border-radius:12px}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`;

function CardTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[12px] font-bold text-[#37314e]">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-[#f0ebff] text-[#6340c4]">
          <Icon size={13} />
        </span>
        {title}
      </div>
      <MoreHorizontal size={16} className="text-[#aaa6b5]" />
    </div>
  );
}
function ViewLink({ children = "View Details" }) {
  return (
    <button
      type="button"
      className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-[#5b22c8] transition hover:gap-2"
    >
      {children}
      <ChevronRight size={12} />
    </button>
  );
}

function Header({ company, onEdit }) {
  const name = company?.name || "OneWinq Enterprise";
  const tagline =
    safeText(company?.tagline, "Trusted identity • Enterprise systems • Growth partner");
  const website = safeText(company?.website, "www.onewinq.in");
  const location = company?.location?.city
    ? `${company.location.city}, ${company.location.country || "India"}`
    : "Indore, Madhya Pradesh, India";
  const email = safeText(company?.email, "contact@onewinq.in");
  return (
    <section className="profile-banner relative overflow-hidden rounded-[15px] px-4 py-4 text-white shadow-[0_12px_28px_rgba(78,23,174,.18)] sm:px-5 sm:py-5">
      <div className="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-[-100px] right-[24%] h-40 w-64 rounded-full bg-[#b988ff]/20 blur-3xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <div className="relative grid h-[72px] w-[72px] shrink-0 place-items-center overflow-hidden rounded-[13px] border border-white/60 bg-[#17113d] p-2 shadow-lg sm:h-[84px] sm:w-[84px]">
            <img
              src={company?.branding?.logoUrl || companyLogo}
              alt="OneWinq wing mark"
              className="h-full w-full object-contain"
            />
            <span className="absolute bottom-1 text-[6px] font-extrabold tracking-[.28em] text-white/80">
              ONEWINQ
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h1 className="profile-display truncate text-[20px] font-bold tracking-[-.04em] sm:text-[24px]">
                  {name}
                </h1>
                <span className="text-[8px] font-extrabold tracking-[.22em] text-white/65 sm:text-[9px]">
                  ONEWING
                </span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[9px] font-semibold">
                <Verified size={11} /> Verified
              </span>
            </div>
            <p className="mt-1 text-[10px] text-white/75 sm:text-[11px]">
              {tagline}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[9px] text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <Globe2 size={11} /> {website}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={11} /> {location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail size={11} /> {email}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="flex shrink-0 items-center justify-center gap-3 self-start rounded-md bg-white px-4 py-2 text-[10px] font-bold text-[#5b22c8] shadow-sm transition hover:bg-[#f1eaff] active:scale-[.97] sm:self-center"
        >
          Edit Profile <ChevronDown size={13} />
        </button>
      </div>
    </section>
  );
}
function Stats({ stats }) {
  const values = [
    [
      "Total Members",
      stats.members || 128,
      "+12 this month",
      UsersRound,
      "#eee6ff",
      "#6840cf",
    ],
    [
      "Projects Completed",
      stats.projects || 24,
      "+5 this month",
      BriefcaseBusiness,
      "#e7faf2",
      "#27af70",
    ],
    [
      "Achievements",
      stats.achievements || 15,
      "+3 this month",
      Trophy,
      "#fff6dc",
      "#e4a51c",
    ],
    [
      "Profile Views",
      stats.views || "4,892",
      "+18.6% this month",
      PieChart,
      "#ffeaf4",
      "#df4d95",
    ],
    [
      "Connected Profiles",
      stats.profiles || "1,256",
      "+22.4% this month",
      ContactIcon,
      "#e9f2ff",
      "#4684dc",
    ],
  ];
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
      {values.map(([label, value, delta, Icon, bg, color]) => (
        <div
          key={label}
          className="profile-card profile-card-hover flex min-h-[91px] items-start justify-between p-3.5"
        >
          <div>
            <div className="profile-muted-label">{label}</div>
            <div className="profile-display mt-2 text-[20px] font-bold text-[#302a4a]">
              {value}
            </div>
            <div className="mt-1 text-[9px] font-medium text-[#8a879a]">
              {delta}
            </div>
          </div>
          <div
            className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px]"
            style={{ background: bg, color }}
          >
            <Icon size={15} />
          </div>
        </div>
      ))}
    </div>
  );
}
function Tabs({ active, onSelect }) {
  return (
    <nav
      className="thin-profile-scrollbar -mx-1 flex gap-1 overflow-x-auto border-b border-[#ebe9f1] px-1"
      aria-label="Company profile sections"
    >
      {tabs.map(([id, label, Icon]) => (
        <button
          type="button"
          key={id}
          onClick={() => onSelect(id)}
          className={`flex shrink-0 items-center gap-1.5 border-b-2 px-2.5 py-3 text-[10px] font-semibold transition ${active === id ? "border-[#642bd1] text-[#5b22c8]" : "border-transparent text-[#716d82] hover:text-[#5b22c8]"}`}
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
    </nav>
  );
}
function About({ company }) {
  return (
    <div
      id="about"
      className="profile-anchor profile-card profile-card-hover p-3.5"
    >
      <CardTitle icon={Building2} title="About Company" />
      <p className="mt-3 text-[10px] leading-[1.65] text-[#747084]">
        {safeText(company?.about, fallbackCopy.about)}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          ["Founded", company?.foundedYear || "2023"],
          ["Company Type", company?.companyType || "Private Limited"],
          ["Industry Type", company?.industry || "Technology"],
          ["Company Size", company?.companySize || "51–200 Employees"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md bg-[#faf9fc] p-2.5">
            <div className="text-[9px] text-[#9691a4]">{label}</div>
            <div className="mt-1 text-[10px] font-bold text-[#46405d]">
              {value}
            </div>
          </div>
        ))}
      </div>
      <ViewLink>View More</ViewLink>
    </div>
  );
}
function Overview({ company }) {
  return (
    <div
      id="overview"
      className="profile-anchor grid gap-3 lg:grid-cols-[1.05fr_1fr]"
    >
      <div className="profile-card profile-card-hover p-3.5">
        <CardTitle icon={Building2} title="Company Overview" />
        <img
          src={company?.branding?.coverImage || fallbackImage}
          alt="OneWinq Enterprise office building"
          className="mt-3 h-[134px] w-full rounded-lg object-cover"
        />
        <p className="mt-3 text-[10px] leading-[1.65] text-[#747084]">
          {safeText(company?.description, fallbackCopy.description)}
        </p>
        <ViewLink />
      </div>
      <About company={company} />
    </div>
  );
}
function Services() {
  const products = [
    ["OneWinq", "Digital ID", ShieldCheck, "#f0eaff"],
    ["Business", "Profiles", CircleUserRound, "#edf4ff"],
    ["Team", "Collaboration", UsersRound, "#e8faf1"],
    ["Analytics", "Dashboard", BarChart3, "#fff5dc"],
  ];
  return (
    <div
      id="services"
      className="profile-anchor profile-card profile-card-hover p-3.5"
    >
      <CardTitle icon={BriefcaseBusiness} title="Products / Services" />
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {products.map(([a, b, Icon, bg]) => (
          <div
            key={b}
            className="flex min-h-[78px] flex-col items-center justify-center rounded-lg"
            style={{ background: bg }}
          >
            <Icon size={18} className="mb-2 text-[#6040c5]" />
            <div className="text-[10px] font-bold text-[#403950]">{a}</div>
            <div className="text-[9px] text-[#858092]">{b}</div>
          </div>
        ))}
      </div>
      <ViewLink>View All Services</ViewLink>
    </div>
  );
}
function Team({ members = [] }) {
  return (
    <div
      id="team"
      className="profile-anchor profile-card profile-card-hover p-3.5"
    >
      <CardTitle icon={UsersRound} title="Team" />
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex -space-x-2">
          {["#c58b70", "#e9b18e", "#6b4638", "#b9a081"].map((color, index) => (
            <div
              key={index}
              className="grid h-9 w-9 place-items-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-sm"
              style={{ background: color }}
            >
              {members[index]?.firstName?.[0] || "OW"}
            </div>
          ))}
          <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-[#eee5ff] text-[10px] font-bold text-[#6436c5]">
            +23
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-[9px] text-[#9691a4]">Total Members</div>
            <div className="mt-1 text-[16px] font-bold text-[#403951]">
              {members.length || 128}
            </div>
          </div>
          <div>
            <div className="text-[9px] text-[#9691a4]">Departments</div>
            <div className="mt-1 text-[16px] font-bold text-[#403951]">8</div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-[10px] text-[#817d90]">
        Meet the professionals building the identity layer behind trusted
        enterprise relationships.
      </p>
      <ViewLink>View All Members</ViewLink>
    </div>
  );
}
function Projects({ items = [] }) {
  const projects = items.length
    ? items
        .slice(0, 2)
        .map((item, index) => ({
          name: item.title || item.name || `OneWinq Project ${index + 1}`,
          description:
            item.description ||
            "Enterprise identity workflow with a clear, connected experience.",
          status: item.status || (index ? "Completed" : "In Progress"),
          progress: item.status === "Completed" ? "100%" : "76%",
        }))
    : [
        {
          name: "OneWinq Platform Redesign",
          description:
            "Trusted identity experience with modern UI and improved performance.",
          status: "In Progress",
          progress: "76%",
        },
        {
          name: "Mobile App Development",
          description:
            "Cross-platform identity management for connected teams.",
          status: "Completed",
          progress: "100%",
        },
      ];
  return (
    <div
      id="projects"
      className="profile-anchor profile-card profile-card-hover p-3.5"
    >
      <CardTitle icon={BriefcaseBusiness} title="Projects / Work" />
      <div className="mt-3 space-y-3">
        {projects.map((project) => (
          <div key={project.name} className="flex gap-2.5">
            <img
              src={fallbackImage}
              alt=""
              className="h-11 w-11 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="truncate text-[10px] font-bold text-[#403951]">
                  {project.name}
                </div>
                <span
                  className={`shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-semibold ${project.status === "Completed" ? "bg-[#e4f9ee] text-[#24a569]" : "bg-[#eee9ff] text-[#7447d1]"}`}
                >
                  {project.status}
                </span>
              </div>
              <div className="mt-1 truncate text-[8px] text-[#9793a4]">
                {project.description}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eeeaf5]">
                  <div
                    className="h-full rounded-full bg-[#672ed2]"
                    style={{ width: project.progress }}
                  />
                </div>
                <span className="text-[8px] font-bold text-[#6b667c]">
                  {project.progress}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ViewLink>View All Projects</ViewLink>
    </div>
  );
}
function Achievements({ items = [] }) {
  const awards = items.length
    ? items
        .slice(0, 3)
        .map((item) => [
          item.title || item.name || "Enterprise Recognition",
          item.description || "Digital identity excellence",
        ])
    : [
        ["Best Digital Identity Platform", "Tech Excellence Awards 2024"],
        ["Startup of the Year", "Business Leaders Summit 2024"],
        ["Innovation in Technology", "Digital India Awards 2023"],
      ];
  return (
    <div
      id="achievements"
      className="profile-anchor profile-card profile-card-hover p-3.5"
    >
      <CardTitle icon={Trophy} title="Achievements" />
      <div className="mt-3 space-y-3">
        {awards.map(([name, description]) => (
          <div key={name} className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#fff2c9]">
              <Award size={14} className="text-[#dba21b]" />
            </span>
            <div>
              <div className="text-[10px] font-bold text-[#403951]">{name}</div>
              <div className="mt-0.5 text-[8px] text-[#9290a0]">
                {description}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ViewLink>View All Achievements</ViewLink>
    </div>
  );
}
function Media({ assets = [] }) {
  const media = assets.length
    ? assets
        .slice(0, 4)
        .map((asset) => asset.url || asset.fileUrl || fallbackImage)
    : [fallbackImage, fallbackImage, fallbackImage, fallbackImage];
  return (
    <div
      id="media"
      className="profile-anchor profile-card profile-card-hover p-3.5"
    >
      <CardTitle icon={ImageIcon} title="Media / Updates" />
      <div className="mt-3 grid grid-cols-2 gap-2">
        {media.map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt="OneWinq update"
            className="h-[74px] w-full rounded-lg object-cover"
          />
        ))}
      </div>
      <ViewLink>View All Media</ViewLink>
    </div>
  );
}


function Dashboard({ company, members, assets, stats, onEdit }) {
  const [active, setActive] = useState("overview");
  const sections = company?.sections || company?.dynamicSections || [];
  const projectItems = findSection(sections, "projects")?.content?.items || [];
  const achievementItems =
    findSection(sections, "achievements")?.content?.items || [];
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0.05, 0.2, 0.5] },
    );
    tabs.forEach(([id]) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);
  const selectTab = (id) => {
    setActive(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="profile-dashboard">
      <style>{profileStyles}</style>
      
      <main className="profile-page-wrap">
        <div className="mb-3 flex items-center gap-1 px-1 text-[10px] text-[#9995a6]">
          <span>Home</span>
          <ChevronRight size={11} />
          <span className="font-semibold text-[#6e687f]">Company Profile</span>
        </div>
        <Header company={company} onEdit={onEdit} />
        <div className="mt-3">
          <Stats stats={stats} />
        </div>
        <div className="sticky top-0 z-20 mt-3 bg-[#f7f8fc]/95 pt-1 backdrop-blur-md">
          <Tabs active={active} onSelect={selectTab} />
        </div>
        <div className="mt-3 space-y-3">
          <Overview company={company} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Services />
            <Team members={members} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.05fr_.8fr_.8fr]">
         <Projects
  items={projectItems}
  projectImages={company.projectImages}
/>
            <Achievements items={achievementItems} />
            <Media assets={assets} />
          </div>
          <div className="sm:max-w-[calc(50%-6px)] lg:w-full lg:max-w-none">
            <ContactConnectSection company={company} />
          </div>
        </div>
        <footer className="mt-5 flex flex-col gap-2 border-t border-[#e8e6ef] px-1 pt-4 text-[9px] text-[#9a96a5] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2025 OneWinq Enterprise. All rights reserved.</span>
          <span className="inline-flex items-center gap-1">
            Made with <Sparkles size={11} className="text-[#7445d0]" /> for
            digital identity
          </span>
        </footer>
      </main>
    </div>
  );
}

export default function CompanyProfile() {
  const [company, setCompany] = useState(null);
  const [members, setMembers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const results = await Promise.allSettled([
        companyProfileService.get(),
        teamMemberService.getAll({ limit: 100 }),
        analyticsService.getOverview(),
        mediaService.getAll({ limit: 20 }),
      ]);
      if (!active) return;
      const [companyResult, membersResult, analyticsResult, mediaResult] =
        results;
      if (companyResult.status === "fulfilled") setCompany(companyResult.value);
      else
        setError(
          companyResult.reason?.response?.data?.message ||
            "Unable to load company profile. Showing fallback content.",
        );
      if (membersResult.status === "fulfilled")
        setMembers(unwrapList(membersResult.value));
      if (analyticsResult.status === "fulfilled")
        setAnalytics(analyticsResult.value);
      if (mediaResult.status === "fulfilled")
        setAssets(unwrapList(mediaResult.value));
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, []);
  const sections = company?.sections || company?.dynamicSections || [];
  const stats = useMemo(
    () => ({
      members: members.length,
      projects: (
        findSection(sections, "projects")?.content?.items ||
        findSection(sections, "projects")?.content ||
        []
      ).length,
      achievements: (
        findSection(sections, "achievements")?.content?.items ||
        findSection(sections, "achievements")?.content ||
        []
      ).length,
      views: analytics?.kpis?.profileViews || analytics?.profileViews || 0,
      profiles: members.filter((member) => member.profileId || member.profile)
        .length,
    }),
    [members, sections, analytics],
  );
  const save = async (data) => {
    setSaving(true);
    try {
      const updated = await companyProfileService.update(data);
      setCompany(updated);
      setEditOpen(false);
    } catch (saveError) {
      setError(
        saveError.response?.data?.message || "Unable to save company profile.",
      );
    } finally {
      setSaving(false);
    }
  };
  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
      </div>
    );
  return (
    <div className="relative">
      {error && (
        <div className="mx-4 mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="mr-2 inline h-4 w-4" />
          {error}
        </div>
      )}
    <Dashboard
  company={{
    ...company,
    projectImages: companyData.projectImages,
    mediaImages: companyData.mediaImages,
    teamImages: companyData.teamImages,
    achievementImages: companyData.achievementImages,
    productsImages: companyData.productsImages,
  }}
  members={members}
  assets={assets}
  stats={stats}
  onEdit={() => setEditOpen(true)}
/>
      <EditSectionModal
        open={editOpen}
        company={company}
        onClose={() => setEditOpen(false)}
        onSave={save}
        saving={saving}
      />
    </div>
  );
}
