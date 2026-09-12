import React from 'react';
import { IdentityFlowSections } from './IdentityFlowSections';

export const HRTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#0d9488';
  const accentColor = profile.template?.layoutConfig?.colorPalette?.accent || '#2dd4bf';

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

export default HRTemplate;
