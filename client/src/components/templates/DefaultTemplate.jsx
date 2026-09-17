import React from 'react';
import { IdentityFlowSections } from './IdentityFlowSections';

export const DefaultTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false,
  activeScreen,
  onNavigate
}) => {
  const primaryColor = profile.themeOverrides?.primaryColor || profile.template?.themeOverrides?.primaryColor || profile.template?.layoutConfig?.colorPalette?.primary || '#7c3aed';
  const secondaryColor = profile.themeOverrides?.secondaryColor || profile.template?.themeOverrides?.secondaryColor || profile.template?.layoutConfig?.colorPalette?.secondary || '#4f46e5';
  const accentColor = profile.themeOverrides?.accentColor || profile.template?.themeOverrides?.accentColor || profile.template?.layoutConfig?.colorPalette?.accent || '#a855f7';

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

export default DefaultTemplate;
