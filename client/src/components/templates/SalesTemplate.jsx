import React from 'react';
import { IdentityFlowSections } from './IdentityFlowSections';

export const SalesTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#2563eb';
  const accentColor = profile.template?.layoutConfig?.colorPalette?.accent || '#60a5fa';

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

export default SalesTemplate;
