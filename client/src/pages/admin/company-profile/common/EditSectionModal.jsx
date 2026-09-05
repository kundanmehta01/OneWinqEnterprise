import React, { useEffect, useState } from 'react';

export default function EditSectionModal({ open, company, onClose, onSave, saving }) {
  const [form, setForm] = useState({ name: '', tagline: '', description: '', industry: '', website: '', email: '', phone: '', city: '', country: '' });
  useEffect(() => {
    setForm({
      name: company?.name || '', tagline: company?.tagline || '', description: company?.description || '',
      industry: company?.industry || '', website: company?.website || '', email: company?.contact?.email || '',
      phone: company?.contact?.phone || '', city: company?.location?.city || '', country: company?.location?.country || ''
    });
  }, [company, open]);
  if (!open) return null;
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <form onSubmit={(event) => { event.preventDefault(); onSave({ name: form.name, tagline: form.tagline, description: form.description, industry: form.industry, website: form.website, contact: { ...company?.contact, email: form.email, phone: form.phone }, location: { ...company?.location, city: form.city, country: form.country } }); }} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-slate-900">Edit company profile</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {['name', 'tagline', 'industry', 'website', 'email', 'phone', 'city', 'country'].map((key) => (
            <label key={key} className="text-xs font-semibold capitalize text-slate-600">
              {key}
              <input value={form[key]} onChange={(event) => set(key, event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-indigo-500" />
            </label>
          ))}
          <label className="text-xs font-semibold text-slate-600 sm:col-span-2">Description
            <textarea rows={4} value={form.description} onChange={(event) => set('description', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-indigo-500" />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
          <button disabled={saving} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save changes'}</button>
        </div>
      </form>
    </div>
  );
}
