import React from 'react';
import { Input } from '../common/Input';
import { Share2 } from 'lucide-react';

export const SocialLinks = ({ links = {}, onChange }) => {
  const platforms = ['linkedin', 'twitter', 'github', 'instagram', 'facebook'];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
        <Share2 className="w-4 h-4 text-indigo-600" />
        Social & Network Presence
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {platforms.map((platform) => (
          <Input
            key={platform}
            label={platform.charAt(0).toUpperCase() + platform.slice(1)}
            value={links[platform] || ''}
            onChange={(e) => onChange(platform, e.target.value)}
            placeholder={`https://${platform}.com/company`}
          />
        ))}
      </div>
    </div>
  );
};
