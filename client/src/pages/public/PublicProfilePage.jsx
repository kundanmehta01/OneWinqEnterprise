import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicProfileService } from '../../services/publicProfileService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  MapPin, Mail, Phone, Globe, Linkedin, Github, Twitter,
  Briefcase, BookOpen, Code2, Award, QrCode, Download,
  ExternalLink, CheckCircle
} from 'lucide-react';

export const PublicProfilePage = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await publicProfileService.getProfileBySlug(slug);
        setProfile(data);
        // Fire a view telemetry event
        publicProfileService.recordEvent({
          eventType: 'VIEW',
          targetType: 'EMPLOYEE',
          targetId: data._id || data.profileId,
          slug,
          templateId: data.templateId
        });
      } catch (err) {
        setError('This profile is not publicly available or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProfile();
  }, [slug]);

  const handleVCardDownload = () => {
    if (!profile) return;

    const vcf = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${profile.memberId?.name || ''}`,
      `TITLE:${profile.headline || ''}`,
      `EMAIL:${profile.memberId?.email || ''}`,
      `TEL:${profile.memberId?.phone || ''}`,
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vcf], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.vcf`;
    a.click();
    URL.revokeObjectURL(url);

    publicProfileService.recordEvent({ eventType: 'VCARD_DOWNLOAD', targetType: 'EMPLOYEE', targetId: profile._id, slug });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-slate-900">Profile Not Found</h2>
          <p className="text-sm text-slate-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const p = profile || {};
  const name = p.memberId?.name || 'Team Member';
  const email = p.memberId?.email || '';
  const phone = p.memberId?.phone || '';
  const designation = p.memberId?.designation || '';
  const primaryColor = p.templateId?.layoutConfig?.colorPalette?.primary || '#6366F1';
  const qrUrl = publicProfileService.getQrCodeUrl(slug);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner */}
      <div
        className="h-40 sm:h-52 w-full relative"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Card Container */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 -mt-16 relative pb-12">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Profile Header */}
          <div className="px-6 sm:px-8 pt-4 pb-6 border-b border-slate-100">
            <div className="flex items-end justify-between gap-4 -mt-10 mb-4">
              <div
                className="w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-white text-3xl font-extrabold flex-shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                {p.memberId?.avatarUrl ? (
                  <img src={p.memberId.avatarUrl} alt={name} className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  name.charAt(0)
                )}
              </div>

              {/* QR + Download Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  title="View QR Code"
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  onClick={() => {
                    setShowQr(!showQr);
                    publicProfileService.recordEvent({ eventType: 'QR_SCAN', targetType: 'EMPLOYEE', targetId: p._id, slug });
                  }}
                >
                  <QrCode className="w-4 h-4" />
                </button>
                <button
                  onClick={handleVCardDownload}
                  title="Download vCard"
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Name + Headline */}
            <div className="flex items-start gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">{name}</h1>
              <CheckCircle className="w-4 h-4 text-indigo-600 fill-indigo-600 text-white mt-1 flex-shrink-0" />
            </div>
            {designation && <p className="text-xs font-semibold text-slate-500 mt-0.5">{designation}</p>}
            {p.headline && <p className="text-sm text-slate-600 mt-1">{p.headline}</p>}

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
              {p.memberId?.departmentId?.name && (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> {p.memberId.departmentId.name}
                </span>
              )}
              {p.memberId?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {p.memberId.location}
                </span>
              )}
            </div>

            {/* QR Code popup */}
            {showQr && (
              <div className="mt-4 p-3 rounded-2xl border border-slate-200 flex flex-col items-center gap-2">
                <img src={qrUrl} alt="QR Code" className="w-32 h-32 rounded-xl" />
                <p className="text-[11px] text-slate-400 font-medium">Scan to view profile</p>
              </div>
            )}
          </div>

          {/* Bio */}
          {p.bio && (
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">About</h2>
              <p className="text-sm text-slate-700 leading-relaxed">{p.bio}</p>
            </div>
          )}

          {/* Skills */}
          {p.skills && p.skills.length > 0 && (
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {p.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                    style={{
                      backgroundColor: `${primaryColor}15`,
                      borderColor: `${primaryColor}30`,
                      color: primaryColor
                    }}
                  >
                    {skill.name || skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {p.experience && p.experience.length > 0 && (
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Experience</h2>
              <div className="space-y-4">
                {p.experience.map((exp, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{exp.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{exp.company}</p>
                      {exp.description && <p className="text-xs text-slate-400 mt-1">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Links */}
          <div className="px-6 sm:px-8 py-5">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Contact & Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {email && (
                <a
                  href={`mailto:${email}`}
                  onClick={() => publicProfileService.recordEvent({ eventType: 'LINK_CLICK', targetType: 'EMPLOYEE', targetId: p._id, slug, metadata: { linkType: 'email' } })}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition text-sm font-medium text-slate-700"
                >
                  <Mail className="w-4 h-4 text-indigo-500" />
                  <span className="truncate">{email}</span>
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition text-sm font-medium text-slate-700"
                >
                  <Phone className="w-4 h-4 text-indigo-500" />
                  {phone}
                </a>
              )}
              {p.socialLinks?.linkedin && (
                <a
                  href={p.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => publicProfileService.recordEvent({ eventType: 'LINK_CLICK', targetType: 'EMPLOYEE', targetId: p._id, slug, metadata: { linkType: 'linkedin' } })}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition text-sm font-medium text-slate-700"
                >
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  LinkedIn
                </a>
              )}
              {p.socialLinks?.github && (
                <a
                  href={p.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition text-sm font-medium text-slate-700"
                >
                  <Github className="w-4 h-4 text-slate-800" />
                  GitHub
                </a>
              )}
              {p.socialLinks?.website && (
                <a
                  href={p.socialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition text-sm font-medium text-slate-700"
                >
                  <Globe className="w-4 h-4 text-indigo-500" />
                  Website
                  <ExternalLink className="w-3 h-3 ml-auto text-slate-300" />
                </a>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400 py-6">
          Powered by <span className="font-bold text-indigo-600">OneWinq Enterprise</span>
        </p>
      </div>
    </div>
  );
};
