import React from 'react';
import { IdentityFlowSections } from './IdentityFlowSections';

export const EngineeringTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#0284c7';
  const accentColor = profile.template?.layoutConfig?.colorPalette?.accent || '#38bdf8';

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

export default EngineeringTemplate;
