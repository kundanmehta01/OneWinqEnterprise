import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  QrCode,
  Edit3,
  Share2,
  CheckCircle2,
  Lock,
  ExternalLink,
  Linkedin,
  Github,
  Twitter,
  Globe,
  Download
} from 'lucide-react';
import { QRCode } from '../components/QRCode';
import { useAuth } from '../../hooks/useAuth';
import { employeeProfileService } from '../../services/employeeProfileService';

const formatLocation = (loc) => {
  if (!loc) return '';
  if (typeof loc === 'string') return loc;
  if (typeof loc === 'object') return [loc.city, loc.country].filter(Boolean).join(', ');
  return '';
};

export default function MyProfile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await employeeProfileService.getMyProfile();
        if (res) {
          setProfileData(res);
        }
      } catch (err) {
        console.error('Failed to load profile data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const employee = {
    name: profileData?.fullName || profileData?.name || user?.name || 'Team Member',
    email: profileData?.email || user?.email || '',
    role: profileData?.designation || profileData?.role || user?.designation || 'Team Member',
    department: profileData?.department?.name || profileData?.departmentId?.name || user?.department || 'General',
    employeeId: profileData?.employeeId || profileData?._id || '',
    location: formatLocation(profileData?.location) || 'Headquarters',
    joinedDate: profileData?.joinedAt ? new Date(profileData.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '',
    avatar: profileData?.avatar || profileData?.profileImage || null,
    phone: profileData?.phone || profileData?.contactNumber || '',
    bio: profileData?.bio || profileData?.about || '',
    completionRate: profileData?.completionPercentage || 0,
    slug: profileData?.slug || ''
  };

  const skills = profileData?.skills?.length ? profileData.skills : [];

  const experience = profileData?.experience?.length ? profileData.experience : [];

  const education = profileData?.education?.length ? profileData.education : [];

  const socialLinks = profileData?.socialLinks || {};

  const publicCardUrl = employee.slug
    ? `${window.location.origin}/p/${employee.slug}`
    : `${window.location.origin}/card/${employee.employeeId || ''}`;


  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Cover Gradient */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Verified Identity
            </span>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar */}
            <div className="relative">
              {employee.avatar ? (
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white shadow-md bg-indigo-50"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl ring-4 ring-white shadow-md bg-indigo-600 text-white items-center justify-center font-extrabold text-3xl"
                style={{ display: employee.avatar ? 'none' : 'flex' }}
              >
                {employee.name.charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <Link
                to="/user/edit-profile"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold shadow-xs transition-all"
              >
                <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                <span>Edit Profile</span>
              </Link>
              <Link
                to="/user/digital-card"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Card</span>
              </Link>
            </div>
          </div>

          {/* Name & Title */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{employee.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                {employee.role}
              </span>
              <span className="text-xs text-gray-400 font-mono">ID: {employee.employeeId}</span>
            </div>

            <p className="text-xs text-gray-600 max-w-3xl leading-relaxed">{employee.bio}</p>

            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                {employee.department} Department
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                {employee.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Joined {employee.joinedDate}
              </span>
            </div>
          </div>

          {/* Profile Completeness Progress Bar */}
          <div className="mt-5 p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                {employee.completionRate}%
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Profile Completeness</p>
                <p className="text-[11px] text-gray-500">Add certifications & work achievements to reach 100%</p>
              </div>
            </div>
            <div className="w-full sm:w-48 bg-white h-2 rounded-full overflow-hidden border border-indigo-100">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${employee.completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 sm:px-8 border-t border-gray-100 flex items-center gap-6 overflow-x-auto scrollbar-none">
          {['Overview', 'Experience & Education', 'Skills & Projects', 'Digital Card QR'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3.5 text-xs font-bold transition-all border-b-2 -mb-[2px] whitespace-nowrap ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Contact & Locked Admin Fields */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Contact Details</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
                    <Mail className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Email</p>
                    <p className="font-medium truncate">{employee.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
                    <Phone className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Phone</p>
                    <p className="font-medium">{employee.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Office</p>
                    <p className="font-medium">{employee.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Locked Corporate Metadata */}
            <div className="bg-slate-50/80 rounded-3xl border border-slate-200/70 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <h4 className="text-xs font-bold">Enterprise Managed Fields</h4>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  Locked
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Department, Employee ID, official designation and corporate emails are managed by your HR Administrator.
              </p>
            </div>
          </div>

          {/* Right 2 Columns: Summary, Skills Preview, Highlights */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Card */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Technical Skills & Competencies</h3>
                <span className="text-xs text-gray-400">{skills.length} skills listed</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-indigo-50/70 text-indigo-700 rounded-xl text-xs font-semibold border border-indigo-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Quick View */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Work Experience</h3>
                <button
                  onClick={() => setActiveTab('Experience & Education')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{exp.role}</h4>
                      <p className="text-[11px] text-indigo-600 font-medium">{exp.company} • {exp.period}</p>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{exp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Experience & Education' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Experience */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Professional Experience</span>
            </h3>
            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div key={idx} className="border-l-2 border-indigo-200 pl-4 space-y-1">
                  <h4 className="text-xs font-bold text-gray-900">{exp.role}</h4>
                  <p className="text-xs font-medium text-indigo-600">{exp.company}</p>
                  <p className="text-[11px] text-gray-400">{exp.period}</p>
                  <p className="text-xs text-gray-600 pt-1 leading-relaxed">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Education</span>
            </h3>
            <div className="space-y-6">
              {education.map((edu, idx) => (
                <div key={idx} className="border-l-2 border-purple-200 pl-4 space-y-1">
                  <h4 className="text-xs font-bold text-gray-900">{edu.degree}</h4>
                  <p className="text-xs font-medium text-purple-600">{edu.institution}</p>
                  <p className="text-[11px] text-gray-400">{edu.period} • {edu.grade}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Skills & Projects' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Endorsed Skills</h3>
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-2 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs font-semibold text-indigo-700 flex items-center gap-2"
                >
                  <span>{skill}</span>
                  <span className="w-4 h-4 rounded-full bg-indigo-200/80 text-indigo-800 text-[10px] font-bold flex items-center justify-center">
                    ✓
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Enterprise Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900">OneWinq Digital ID Platform</h4>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Active
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Interactive employee card generator, instant QR sharing, and organizational network directories.
                </p>
                <div className="flex gap-1.5 pt-1">
                  <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-600">React</span>
                  <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-600">Tailwind</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900">Nexisparkx Global Design Tokens</h4>
                  <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Completed
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Unified component tokens and accessibility patterns across mobile and web client dashboards.
                </p>
                <div className="flex gap-1.5 pt-1">
                  <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-600">Figma</span>
                  <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-600">Storybook</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Digital Card QR' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xs max-w-md mx-auto text-center space-y-5">
          <h3 className="text-base font-bold text-gray-900">Your Live Digital Card QR</h3>
          <p className="text-xs text-gray-500">
            Anyone scanning this code will open your verified OneWinq employee identity card.
          </p>
          <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 inline-block shadow-inner">
            <QRCode value={publicCardUrl} size={180} />
          </div>
          <div className="space-y-2 pt-2">
            <p className="text-xs font-mono text-gray-400 truncate">{publicCardUrl}</p>
            <div className="flex justify-center gap-3">
              <Link
                to="/user/digital-card"
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs"
              >
                Open Full Card View
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
