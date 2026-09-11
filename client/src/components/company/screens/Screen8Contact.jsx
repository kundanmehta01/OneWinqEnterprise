import React, { useState } from 'react';
import { MapPin, Mail, Phone, Globe, Clock, ArrowLeft, Send, CheckCircle2, Navigation } from 'lucide-react';

export const Screen8Contact = ({
  profile,
  onBack,
  isEditable = false,
  onUpdateField = () => {}
}) => {
  const contact = profile?.contact || {};
  const location = profile?.location || {};
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const fullAddress = [
    location.address,
    location.city,
    location.state,
    location.country,
  ]
    .filter(Boolean)
    .join(', ');

  const handleSendInquiry = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">Contact & Inquiries</h3>
            <p className="text-xs text-slate-500">Corporate Headquarters, Support & Direct Message</p>
          </div>
        </div>

        {isEditable && (
          <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full font-bold">
            Directly Editable
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Contact Details Column */}
        <div className="space-y-3.5">
          {/* Head Office Address */}
          <div className="clean-card p-5 bg-white border border-slate-100 rounded-3xl flex items-start gap-4 shadow-2xs">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 mt-0.5 shadow-2xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Head Office</p>
              {isEditable ? (
                <div className="space-y-1.5 pt-1">
                  <input
                    type="text"
                    value={location.address || ''}
                    onChange={(e) => onUpdateField('location.address', e.target.value)}
                    placeholder="Street Address"
                    className="w-full text-xs text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 outline-none"
                  />
                  <div className="grid grid-cols-3 gap-1.5">
                    <input
                      type="text"
                      value={location.city || ''}
                      onChange={(e) => onUpdateField('location.city', e.target.value)}
                      placeholder="City"
                      className="w-full text-xs text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 outline-none"
                    />
                    <input
                      type="text"
                      value={location.state || ''}
                      onChange={(e) => onUpdateField('location.state', e.target.value)}
                      placeholder="State"
                      className="w-full text-xs text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 outline-none"
                    />
                    <input
                      type="text"
                      value={location.country || ''}
                      onChange={(e) => onUpdateField('location.country', e.target.value)}
                      placeholder="Country"
                      className="w-full text-xs text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 outline-none"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm font-bold text-slate-900 leading-snug">{fullAddress || 'Address not specified'}</p>
              )}
            </div>
          </div>

          {/* Corporate Email */}
          <div className="clean-card p-5 bg-white border border-slate-100 rounded-3xl flex items-center gap-4 shadow-2xs">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-2xs">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Corporate Email</p>
              {isEditable ? (
                <input
                  type="email"
                  value={contact.email || ''}
                  onChange={(e) => onUpdateField('contact.email', e.target.value)}
                  placeholder="contact@onewinq.com"
                  className="w-full text-sm font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 outline-none"
                />
              ) : (
                <a href={`mailto:${contact.email}`} className="text-sm font-bold text-slate-900 hover:text-purple-600 transition-colors truncate block">
                  {contact.email || 'None'}
                </a>
              )}
            </div>
          </div>

          {/* Direct Line */}
          <div className="clean-card p-5 bg-white border border-slate-100 rounded-3xl flex items-center gap-4 shadow-2xs">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-2xs">
              <Phone className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Direct Line</p>
              {isEditable ? (
                <input
                  type="tel"
                  value={contact.phone || ''}
                  onChange={(e) => onUpdateField('contact.phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-sm font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 outline-none"
                />
              ) : (
                <a href={`tel:${contact.phone}`} className="text-sm font-bold text-slate-900 hover:text-purple-600 transition-colors truncate block">
                  {contact.phone || 'None'}
                </a>
              )}
            </div>
          </div>

          {/* Official Website */}
          <div className="clean-card p-5 bg-white border border-slate-100 rounded-3xl flex items-center gap-4 shadow-2xs">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-2xs">
              <Globe className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Official Portal</p>
              {isEditable ? (
                <input
                  type="url"
                  value={profile?.website || ''}
                  onChange={(e) => onUpdateField('website', e.target.value)}
                  placeholder="https://onewinq.com"
                  className="w-full text-sm font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 outline-none"
                />
              ) : (
                <a href={profile?.website} target="_blank" rel="noreferrer" className="text-sm font-bold text-slate-900 hover:text-purple-600 transition-colors truncate block">
                  {profile?.website || 'None'}
                </a>
              )}
            </div>
          </div>

          {/* Business Hours */}
          <div className="clean-card p-5 bg-white border border-slate-100 rounded-3xl flex items-center gap-4 shadow-2xs">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 flex-1">
              <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Business Hours</p>
              {isEditable ? (
                <input
                  type="text"
                  value={contact.workingHours || ''}
                  onChange={(e) => onUpdateField('contact.workingHours', e.target.value)}
                  placeholder="Mon - Fri: 9:00 AM - 6:00 PM IST"
                  className="w-full text-sm font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 outline-none"
                />
              ) : (
                <p className="text-sm font-bold text-slate-900">{contact.workingHours || 'Mon - Fri: 9:00 AM - 6:00 PM'}</p>
              )}
            </div>
          </div>

          <a
            href={contact.directionsUrl || `https://maps.google.com/?q=${encodeURIComponent(fullAddress || 'OneWinq')}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 px-5 rounded-full btn-purple text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
          >
            <Navigation className="w-4 h-4" />
            <span>Open Office in Google Maps</span>
          </a>
        </div>

        {/* Inquiry Form Column */}
        <div className="clean-card p-6 sm:p-8 bg-white border border-slate-100 rounded-3xl space-y-4 shadow-2xs flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-600" />
              Send Direct Message
            </h4>
            <p className="text-xs text-slate-500">
              Submit your inquiry or partnership request directly to our team.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 my-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-emerald-800">Message Received Successfully!</p>
              <p className="text-xs text-emerald-600">Our enterprise team will respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSendInquiry} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Email</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                <textarea
                  placeholder="How can we help your organization?"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 resize-none transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-full btn-purple text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

