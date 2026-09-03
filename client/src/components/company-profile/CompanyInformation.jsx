import React from 'react';
import { Input } from '../common/Input';
import { Building2, Globe, Mail, Phone, MapPin } from 'lucide-react';

export const CompanyInformation = ({ form, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
        General Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Company Name"
          value={form.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Acme Enterprise"
          icon={Building2}
        />
        <Input
          label="Tagline"
          value={form.tagline || ''}
          onChange={(e) => onChange('tagline', e.target.value)}
          placeholder="Innovating Digital Identities"
        />
        <Input
          label="Website"
          value={form.website || ''}
          onChange={(e) => onChange('website', e.target.value)}
          placeholder="https://company.com"
          icon={Globe}
        />
        <Input
          label="Industry"
          value={form.industry || ''}
          onChange={(e) => onChange('industry', e.target.value)}
          placeholder="Software & Technology"
        />
        <Input
          label="Contact Email"
          value={form.contact?.email || ''}
          onChange={(e) => onChange('contact', { ...form.contact, email: e.target.value })}
          placeholder="contact@company.com"
          icon={Mail}
        />
        <Input
          label="Phone Number"
          value={form.contact?.phone || ''}
          onChange={(e) => onChange('contact', { ...form.contact, phone: e.target.value })}
          placeholder="+1 (555) 000-0000"
          icon={Phone}
        />
      </div>
    </div>
  );
};
