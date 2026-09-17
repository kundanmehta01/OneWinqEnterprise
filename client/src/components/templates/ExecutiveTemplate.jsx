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
  const primaryColor = profile.themeOverrides?.primaryColor || profile.template?.themeOverrides?.primaryColor || profile.template?.layoutConfig?.colorPalette?.primary || '#0f172a';
  const secondaryColor = profile.themeOverrides?.secondaryColor || profile.template?.themeOverrides?.secondaryColor || profile.template?.layoutConfig?.colorPalette?.secondary || '#1e293b';
  const accentColor = profile.themeOverrides?.accentColor || profile.template?.themeOverrides?.accentColor || profile.template?.layoutConfig?.colorPalette?.accent || '#64748b';

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
      theme={{ primary: primaryColor, secondary: secondaryColor, accent: accentColor }}
    />
  );
};

export default ExecutiveTemplate;
