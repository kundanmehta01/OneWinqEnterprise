import React, { useEffect, useState } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { companyProfileService, teamMemberService } from '../../../services'
import companyData from './companyData'
import About from './sections/About'
import Achievements from './sections/Achievements'
import ContactConnect from './sections/ContactConnect'
import Dashboard from './Dashboard'
import Media from './sections/Media'
import Overview from './sections/Overview'
import Projects from './sections/Projects'
import Services from './sections/Services'
import Tabs from './sections/Tabs'
import Team from './sections/Team'

const defaultProfile = {
  name: 'OneWinq Technologies Pvt. Ltd.',
  tagline: 'One Identity, Infinite Possibilities.',
  description: 'Company Identity First. Role Identity Always. Represents the company as a brand and its complete digital presence.',
  industry: 'Technology / SaaS / AI',
  website: 'https://onewinq.in',
  location: { address: 'Scheme No. 78', city: 'Indore', state: 'Madhya Pradesh', country: 'India', zipCode: '452010' },
  contact: { email: 'hello@onewinq.in', supportEmail: 'support@onewinq.in', phone: '+91 731 123 4507' },
  about: {
    aboutCompany: 'OneWinq Technologies is on a mission to revolutionize digital presence by bridging company branding with individual role identity.',
    mission: 'To empower every individual and organization with a digital identity that creates value, trust and growth.',
    vision: "To become the world's most trusted identity and networking platform for people and businesses.",
  },
}

function buildViewProfile(profile) {
  return {
    ...defaultProfile,
    ...profile,
    location: { ...defaultProfile.location, ...(profile?.location || {}) },
    contact: { ...defaultProfile.contact, ...(profile?.contact || {}) },
    about: { ...defaultProfile.about, ...(profile?.about || {}) },
  }
}

function buildUpdatePayload(form) {
  const payload = {}
  const fields = ['name', 'tagline', 'description', 'industry', 'website', 'isPublic']
  fields.forEach((field) => {
    if (form[field] !== undefined) payload[field] = form[field]
  })
  if (form.location) payload.location = form.location
  if (form.contact) payload.contact = form.contact
  if (form.about) payload.about = form.about
  if (form.branding) payload.branding = form.branding
  if (form.dynamicSections) payload.dynamicSections = form.dynamicSections
  if (form.navigation) payload.navigation = form.navigation
  if (form.socialLinks) payload.socialLinks = form.socialLinks
  return payload
}

export default function CompanyProfile() {
  const [company, setCompany] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [requestKey, setRequestKey] = useState(0)

  useEffect(() => {
    let mounted = true
    const fetchCompanyProfile = async () => {
      setLoading(true)
      setError('')
      try {
        const [compData, teamData] = await Promise.all([
          companyProfileService.get().catch(() => null),
          teamMemberService.getAll({ status: 'active', limit: 50 }).catch(() => ({ members: [] }))
        ])
        if (mounted) {
          const profileResult = compData || {}
          setCompany(profileResult)
          setForm(profileResult)
          const membersList = Array.isArray(teamData?.members)
            ? teamData.members
            : Array.isArray(teamData)
              ? teamData
              : []
          setTeamMembers(membersList)
        }
      } catch (err) {
        if (mounted) setError(err?.response?.data?.message || err.message || 'We could not load the company profile.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchCompanyProfile()
    return () => { mounted = false }
  }, [requestKey])

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const handleCancel = () => {
    setForm(company || {})
    setSaveError('')
    setEditing(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError('')
    try {
      const updated = await companyProfileService.update(buildUpdatePayload(form))
      setCompany(updated || form)
      setForm(updated || form)
      setEditing(false)
    } catch (err) {
      setSaveError(err?.response?.data?.message || err.message || 'Your changes could not be saved. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500"><RefreshCw size={18} className="animate-spin text-indigo-600" />Loading company profile…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <AlertCircle size={28} className="mx-auto text-red-500" />
          <h1 className="mt-4 text-lg font-semibold text-slate-900">Unable to load profile</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>
          <button type="button" onClick={() => setRequestKey((key) => key + 1)} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"><RefreshCw size={15} />Try again</button>
        </div>
      </div>
    )
  }

  const viewProfile = buildViewProfile(company)
  const sectionProps = { profile: editing ? form : viewProfile, editing, onChange: updateField }

  // Live dynamic section payloads connected to backend data
  const liveStats = [
    { label: 'Team members', value: String(teamMembers.length || company?.overviewStats?.teamSize || '25+'), detail: 'Active personnel' },
    { label: 'Founded year', value: String(company?.overviewStats?.foundedYear || '2024'), detail: 'Established' },
    { label: 'Industry', value: company?.industry || 'Enterprise SaaS', detail: 'Primary domain' },
    { label: 'Headquarters', value: company?.location?.city || 'Indore, India', detail: company?.location?.country || 'HQ Campus' },
  ]

  const liveTeam = {
    eyebrow: 'Meet the team',
    title: 'A powerhouse team driving enterprise identity',
    members: teamMembers.length > 0
      ? teamMembers.map((m, idx) => ({
          name: m.name,
          role: m.designation,
          location: typeof m.location === 'object'
            ? `${m.location.city || ''}, ${m.location.country || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Indore, India'
            : (m.location || m.departmentId?.name || 'Indore, India'),
          image: m.profileId?.published?.avatarUrl || m.profileId?.published?.avatar || m.avatar || companyData.team.members[idx % companyData.team.members.length]?.image
        }))
      : companyData.team.members
  }

  const liveServices = {
    eyebrow: 'What we do',
    title: 'Everything your enterprise identity needs',
    description: company?.description || companyData.services.description,
    items: Array.isArray(company?.productsServices) && company.productsServices.length > 0
      ? company.productsServices.map((ps) => ({
          title: ps.title,
          description: ps.description,
          icon: ps.icon || 'scan',
          image: companyData.services.items[0]?.image
        }))
      : companyData.services.items
  }

  const liveProjects = {
    eyebrow: 'Selected work',
    title: 'Ideas made useful',
    items: Array.isArray(company?.projects) && company.projects.length > 0
      ? company.projects.map((p, idx) => ({
          title: p.title,
          category: p.category || 'Platform',
          year: '2025',
          description: p.description,
          image: companyData.projects.items[idx % companyData.projects.items.length]?.image
        }))
      : companyData.projects.items
  }

  const liveAchievements = {
    eyebrow: 'Milestones',
    title: 'Progress worth sharing',
    items: Array.isArray(company?.achievements) && company.achievements.length > 0
      ? company.achievements.map((a) => ({
          year: a.year || '2025',
          title: a.title,
          description: a.description,
          icon: a.badge ? 'award' : 'rocket'
        }))
      : companyData.achievements.items
  }

  const liveMedia = {
    eyebrow: 'Media gallery',
    title: 'Stories & press coverage',
    items: Array.isArray(company?.media) && company.media.length > 0
      ? company.media.map((m, idx) => ({
          title: m.title,
          source: m.category || 'Press Release',
          date: 'Recent',
          image: m.url || companyData.media.items[idx % companyData.media.items.length]?.image
        }))
      : companyData.media.items
  }

  const liveOverview = {
    eyebrow: 'At a glance',
    title: company?.tagline || companyData.overview.title,
    description: company?.description || companyData.overview.description,
    highlights: Array.isArray(company?.about?.values) && company.about.values.length > 0
      ? company.about.values
      : companyData.overview.highlights
  }

  const liveAbout = {
    eyebrow: 'Our story',
    title: company?.tagline || companyData.about.title,
    paragraphs: [
      company?.about?.story || company?.about?.aboutCompany || company?.description || companyData.about.paragraphs[0]
    ],
    mission: company?.about?.mission || companyData.about.mission,
    vision: company?.about?.vision || companyData.about.vision,
    images: companyData.about.images,
    values: Array.isArray(company?.about?.values) && company.about.values.length > 0
      ? company.about.values
      : companyData.about.values
  }

  const liveContact = {
    ...companyData.contact,
    ...(company?.contact || {})
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Company profile</h1>
        <p className="mt-1 text-sm text-slate-500">Tell your team and community what makes your company different.</p>
      </div>
      <Dashboard
        profile={editing ? form : viewProfile}
        header={companyData.header}
        stats={liveStats}
        editing={editing}
        saving={saving}
        onEdit={() => { setSaveError(''); setEditing(true) }}
        onCancel={handleCancel}
        onSave={handleSave}
        onChange={updateField}
      />
      {saveError && <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle size={16} />{saveError}</div>}
      <Tabs activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'overview' && <Overview {...sectionProps} data={liveOverview} />}
      {activeTab === 'about' && <About {...sectionProps} data={liveAbout} />}
      {activeTab === 'services' && <Services data={liveServices} />}
      {activeTab === 'team' && <Team data={liveTeam} />}
      {activeTab === 'projects' && <Projects data={liveProjects} />}
      {activeTab === 'achievements' && <Achievements data={liveAchievements} />}
      {activeTab === 'media' && <Media data={liveMedia} />}
      {activeTab === 'contact' && <ContactConnect {...sectionProps} data={liveContact} />}
    </div>
  )
}
