import React, { useEffect, useState } from 'react'
import { companyProfileService } from '../../services'

const defaultSections = [
  { id: 'overview', title: 'Company Overview', content: 'OneWinq empowers modern enterprises with digital identity, profile experiences, and team collaboration tooling.' },
  { id: 'about', title: 'About Company', content: 'We help organizations build trust and visibility through elegant digital profiles, workflows, and people-first automation.' },
  { id: 'services', title: 'Products & Services', content: 'Profile management, workforce solutions, enterprise identity, communication, and analytics.' },
  { id: 'team', title: 'Team', content: 'Cross-functional teams across engineering, design, people operations, and customer success.' },
  { id: 'projects', title: 'Projects / Work', content: 'Customer-facing profile experiences, digital onboarding, and employee engagement experiences.' },
  { id: 'achievements', title: 'Achievements', content: 'Focused on enterprise adoption, growth, and high-impact digital transformation programs.' },
  { id: 'updates', title: 'Media / Updates', content: 'Regular company stories, product launches, and impact highlights from the broader team.' },
  { id: 'contact', title: 'Contact / Connect', content: 'Reach out via the corporate channels below for partnerships, hiring, and product conversations.' },
]

export default function CompanyProfile() {
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await companyProfileService.get()
        setCompany(data)
        setForm(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleSave = async () => {
    try {
      const updated = await companyProfileService.update(form)
      setCompany(updated)
      setForm(updated)
      setEditing(false)
    } catch (err) {
      console.error(err)
    }
  }

  const sections = company?.dynamicSections?.length ? company.dynamicSections : defaultSections

  if (loading) return <div className="rounded-xl border bg-white p-8 text-slate-600">Loading company profile...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Company Profile</h1>
          <p className="text-sm text-slate-600">Manage your company overview, leadership identity, and public profile content.</p>
        </div>
        {!editing && (
          <button type="button" onClick={() => setEditing(true)} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
            Edit profile
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 p-6 text-white md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-violet-100">OneWinq Enterprise</div>
              <h2 className="mt-2 text-3xl font-semibold">{company?.name || 'OneWinq'}</h2>
              <p className="mt-2 max-w-xl text-sm text-violet-100">{company?.tagline || 'Next-Generation Enterprise Digital Identity Platform'}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="text-xs uppercase tracking-[0.2em] text-violet-100">Industry</div>
              <div className="mt-1 text-sm font-medium">{company?.industry || 'Technology'}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.55fr,0.95fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-900">Founder Overview</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{company?.about?.aboutCompany || 'OneWinq is built to bring clarity, trust, and modern digital presence into the enterprise employee experience.'}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {sections.map((section) => (
                <div key={section.sectionId || section.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h4 className="text-base font-semibold text-slate-900">{section.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{section.content || section.description || 'No content yet.'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-900">Founder / Admin profile</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-2"><span>Founder</span><span className="font-medium text-slate-900">Super Admin</span></div>
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-2"><span>About Founder</span><span className="font-medium text-slate-900">Leadership & strategy</span></div>
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-2"><span>Journey</span><span className="font-medium text-slate-900">Mission-driven growth</span></div>
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-2"><span>Impact</span><span className="font-medium text-slate-900">Enterprise transformation</span></div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-slate-900">Contact & Connect</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div>Email: {company?.contact?.email || 'contact@onewinq.com'}</div>
                <div>Phone: {company?.contact?.phone || '+1 (415) 555-0188'}</div>
                <div>Location: {company?.location?.city || 'San Francisco'}, {company?.location?.country || 'United States'}</div>
                <div>Website: {company?.website || 'https://onewinq.com'}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-slate-900">QR Code</h3>
              <div className="mt-4 flex justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-white text-3xl shadow-sm">◼️</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-900">Basic company information</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-700">
              <span className="mb-1 block font-medium">Company name</span>
              <input type="text" value={form.name || ''} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-violet-500" />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-1 block font-medium">Tagline</span>
              <input type="text" value={form.tagline || ''} onChange={(event) => setForm((current) => ({ ...current, tagline: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-violet-500" />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-1 block font-medium">Industry</span>
              <input type="text" value={form.industry || ''} onChange={(event) => setForm((current) => ({ ...current, industry: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-violet-500" />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-1 block font-medium">Website</span>
              <input type="text" value={form.website || ''} onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-violet-500" />
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Cancel</button>
            <button type="button" onClick={handleSave} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">Save changes</button>
          </div>
        </div>
      )}
    </div>
  )
}
