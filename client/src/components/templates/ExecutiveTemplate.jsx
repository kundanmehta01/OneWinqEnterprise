import React from 'react';
import { IdentityFlowSections } from './IdentityFlowSections';

export const ExecutiveTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false,
  activeScreen,
  onNavigate
}) => {
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#0f172a';
  const accentColor = profile.template?.layoutConfig?.colorPalette?.accent || '#64748b';

  return (
    <IdentityFlowSections
      profile={profile}
      onConnectClick={onConnectClick}
      onQrClick={onQrClick}
      onDownloadVCard={onDownloadVCard}
      onShareClick={onShareClick}
      isCompact={isCompact}
      activeScreen={activeScreen}
      onNavigate={onNavigate}
      theme={{ primary: primaryColor, accent: accentColor }}
    />
  );
};

export default ExecutiveTemplate;
