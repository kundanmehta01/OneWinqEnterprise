import React from 'react';
import { IdentityFlowSections } from './IdentityFlowSections';

export const ExecutiveTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#4f46e5';
  const accentColor = profile.template?.layoutConfig?.colorPalette?.accent || '#6366f1';

  return (
    <IdentityFlowSections
      profile={profile}
      onConnectClick={onConnectClick}
      onQrClick={onQrClick}
      onDownloadVCard={onDownloadVCard}
      onShareClick={onShareClick}
      isCompact={isCompact}
      theme={{ primary: primaryColor, accent: accentColor }}
    />
  );
};

export default ExecutiveTemplate;
