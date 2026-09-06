import React, { useEffect, useState } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { companyProfileService } from '../../../services'
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
  name: 'OneWinq',
  tagline: 'The Enterprise Digital Identity & People Platform',
  description: 'OneWinq unifies company branding, employee digital identities, and verified credentials into a seamless, modern platform.',
  industry: 'Enterprise Software / SaaS',
  website: 'https://onewinq.com',
  location: { city: 'San Francisco', state: 'CA', country: 'United States' },
  contact: { email: 'contact@onewinq.com', supportEmail: 'support@onewinq.com' },
  about: {
    aboutCompany: 'OneWinq is on a mission to modernize how enterprises represent their brand and empower their workforce with verified, elegant digital identity tools.',
    mission: 'Empowering companies and their people with seamless digital presence and trusted identity infrastructure.',
    vision: 'To be the standard digital identity fabric for progressive enterprises worldwide.',
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
        const data = await companyProfileService.get()
        if (mounted) {
          setCompany(data || {})
          setForm(data || {})
        }
      } catch (err) {
        if (mounted) setError(err?.response?.data?.message || 'We could not load the company profile.')
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
      setSaveError(err?.response?.data?.message || 'Your changes could not be saved. Please try again.')
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

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Company profile</h1>
        <p className="mt-1 text-sm text-slate-500">Tell your team and community what makes your company different.</p>
      </div>
      <Dashboard
        profile={editing ? form : viewProfile}
        header={companyData.header}
        stats={companyData.stats}
        editing={editing}
        saving={saving}
        onEdit={() => { setSaveError(''); setEditing(true) }}
        onCancel={handleCancel}
        onSave={handleSave}
        onChange={updateField}
      />
      {saveError && <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle size={16} />{saveError}</div>}
      <Tabs activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'overview' && <Overview {...sectionProps} data={companyData.overview} />}
      {activeTab === 'about' && <About {...sectionProps} data={companyData.about} />}
      {activeTab === 'services' && <Services data={companyData.services} />}
      {activeTab === 'team' && <Team data={companyData.team} />}
      {activeTab === 'projects' && <Projects data={companyData.projects} />}
      {activeTab === 'achievements' && <Achievements data={companyData.achievements} />}
      {activeTab === 'media' && <Media data={companyData.media} />}
      {activeTab === 'contact' && <ContactConnect {...sectionProps} data={companyData.contact} />}
    </div>
  )
}
