import React from 'react';
import { Mail, Phone, Globe, Linkedin, Github } from 'lucide-react';

export const ContactSection = ({ email, phone, socialLinks = {} }) => {
  return (
    <div className="py-4 border-t border-slate-100">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Contact &amp; Connect</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {email && (
          <a href={`mailto:${email}`} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 text-xs font-medium text-slate-700 hover:border-indigo-200">
            <Mail className="w-4 h-4 text-indigo-500" />
            <span className="truncate">{email}</span>
          </a>
        )}
        {phone && (
          <a href={`tel:${phone}`} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 text-xs font-medium text-slate-700 hover:border-indigo-200">
            <Phone className="w-4 h-4 text-indigo-500" />
            <span>{phone}</span>
          </a>
        )}
      </div>
    </div>
  );
};
