import React, { useState, useEffect } from 'react';
import {
  Download,
  Share2,
  Copy,
  Check,
  RotateCw,
  QrCode,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building2,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Sparkles,
  User
} from 'lucide-react';
import { QRCode } from '../components/QRCode';
import { useAuth } from '../../hooks/useAuth';
import { employeeProfileService } from '../../services/employeeProfileService';

const formatLoc = (loc) => {
  if (!loc) return '';
  if (typeof loc === 'string') return loc;
  if (typeof loc === 'object') return [loc.city, loc.country].filter(Boolean).join(', ');
  return '';
};

export default function DigitalCard() {
  const { user } = useAuth();
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    employeeProfileService.getMyProfile()
      .then((res) => { if (res) setProfileData(res); })
      .catch(() => {});
  }, []);

  const employee = {
    name: profileData?.fullName || profileData?.name || user?.name || 'Team Member',
    role: profileData?.designation || profileData?.role || user?.designation || 'Team Member',
    department: profileData?.department?.name || profileData?.departmentId?.name || user?.department || '',
    employeeId: profileData?.employeeId || profileData?._id || '',
    company: profileData?.companyId?.name || user?.company || 'OneWinq Enterprise',
    email: profileData?.email || user?.email || '',
    phone: profileData?.phone || profileData?.contactNumber || '',
    location: formatLoc(profileData?.location),
    website: profileData?.socialLinks?.portfolio || profileData?.website || 'https://onewinq.com',
    avatar: profileData?.avatar || profileData?.profileImage || null,
    slug: profileData?.slug || ''
  };

  const cardShareUrl = employee.slug
    ? `${window.location.origin}/p/${employee.slug}`
    : `${window.location.origin}/card/${employee.employeeId || 'me'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(cardShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadVcf = () => {
    const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${employee.name}\nORG:${employee.company}\nTITLE:${employee.role}\nEMAIL:${employee.email}\nTEL:${employee.phone}\nURL:${employee.website}\nNOTE:OneWinq Enterprise Verified Identity - ID: ${employee.employeeId}\nEND:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${employee.name.replace(/\s+/g, '_')}_contact.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Digital Identity Card</h1>
          <p className="text-sm text-gray-500 mt-0.5">Your official verifiable enterprise NFC business card.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            <RotateCw className="w-4 h-4 text-indigo-600" />
            <span>Flip Card ({isFlipped ? 'Back' : 'Front'})</span>
          </button>
          <button
            onClick={handleDownloadVcf}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Contact (.vcf)</span>
          </button>
        </div>
      </div>

      {/* Main Card Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
        {/* Card Render Frame (7 cols) */}
        <div className="lg:col-span-7 flex justify-center perspective-[1000px]">
          <div
            className={`w-full max-w-sm sm:max-w-md h-[460px] rounded-3xl p-6 sm:p-7 relative transition-all duration-700 shadow-2xl overflow-hidden cursor-pointer select-none ${
              isFlipped
                ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30'
                : 'bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-800 text-white border border-white/20'
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.28)'
            }}
          >
            {/* Background Decorative Mesh */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            {!isFlipped ? (
              /* FRONT FACE */
              <div className="h-full flex flex-col justify-between relative z-10">
                {/* Top Row: Logo & Chip */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-base font-black tracking-tight leading-none block">onewinq</span>
                      <span className="text-[8px] tracking-[0.25em] text-white/70 uppercase font-semibold">ENTERPRISE</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-8 h-6 rounded-md bg-amber-400/90 border border-amber-300 shadow-xs flex items-center justify-center">
                      <span className="w-4 h-3 border border-amber-600/40 rounded-sm" />
                    </span>
                    <span className="text-xs text-white/70 font-mono">NFC</span>
                  </div>
                </div>

                {/* Center Row: Photo & Role */}
                <div className="space-y-4 my-auto">
                  <div className="flex items-center gap-4">
                    {employee.avatar ? (
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <div
                      className="w-20 h-20 rounded-2xl ring-4 ring-white/30 shadow-lg bg-indigo-800 text-white items-center justify-center font-extrabold text-2xl"
                      style={{ display: employee.avatar ? 'none' : 'flex' }}
                    >
                      {employee.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-xl font-bold tracking-tight text-white">{employee.name}</h2>
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      </div>
                      <p className="text-xs font-semibold text-indigo-200 mt-0.5">{employee.role}</p>
                      <p className="text-[11px] text-white/60">{employee.department} Dept.</p>
                      <p className="text-[10px] text-indigo-300 font-mono mt-1">ID: {employee.employeeId}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Quick Meta & Flip prompt */}
                <div className="pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70">
                  <div className="space-y-0.5">
                    <p className="font-medium text-white">{employee.company}</p>
                    <p className="text-[10px] text-white/50">{employee.location}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-indigo-200 font-semibold bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                    <RotateCw className="w-3 h-3" />
                    <span>Tap to view QR</span>
                  </div>
                </div>
              </div>
            ) : (
              /* BACK FACE */
              <div className="h-full flex flex-col justify-between items-center text-center relative z-10">
                <div className="w-full flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-white/80">Scan Contact Info</span>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Live Card
                  </span>
                </div>

                {/* QR Code Container */}
                <div className="p-4 bg-white rounded-2xl shadow-xl inline-block my-auto">
                  <QRCode value={cardShareUrl} size={150} />
                </div>

                {/* Contact text */}
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-white">{employee.email}</p>
                  <p className="text-indigo-300 text-[11px]">{employee.phone}</p>
                  <p className="text-[10px] text-white/50">{employee.website}</p>
                </div>

                <div className="pt-2 text-[10px] text-white/40">
                  Tap card to flip back to front
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card Sharing & Export Options (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Share Link Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Share Public Link</h3>
            <p className="text-xs text-gray-500">
              Share your digital business profile with clients, partners, and colleagues.
            </p>

            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200">
              <input
                type="text"
                readOnly
                value={cardShareUrl}
                className="flex-1 bg-transparent text-xs text-gray-700 font-mono outline-none truncate px-1"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Wallet Cards Integration Preview */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Add to Mobile Wallets</h3>
            <p className="text-xs text-gray-500">
              Carry your OneWinq verified badge directly inside Apple Wallet or Google Pay.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 p-3 bg-black text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors">
                <Smartphone className="w-4 h-4" />
                <span>Apple Wallet</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-3 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-colors">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span>Google Wallet</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/40 rounded-3xl border border-indigo-100/60 p-5 space-y-3">
            <h4 className="text-xs font-bold text-gray-900">Instant Quick Actions</h4>
            <div className="flex flex-wrap gap-2">
              <a
                href={`mailto:?subject=${encodeURIComponent(`Contact info for ${employee.name}`)}&body=${encodeURIComponent(`Hi,\n\nHere is my OneWinq Digital Card: ${cardShareUrl}`)}`}
                className="px-3 py-1.5 bg-white border border-indigo-100 rounded-xl text-xs font-medium text-gray-700 hover:bg-indigo-50 transition-colors inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>Email Card</span>
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out my verified digital employee card: ${cardShareUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-white border border-indigo-100 rounded-xl text-xs font-medium text-gray-700 hover:bg-indigo-50 transition-colors inline-flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
