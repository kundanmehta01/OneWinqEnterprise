import React from 'react';
import { IdentityFlowSections } from './IdentityFlowSections';

export const EngineeringTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false,
  activeScreen,
  onNavigate
}) => {
  const primaryColor = profile.themeOverrides?.primaryColor || profile.template?.themeOverrides?.primaryColor || profile.template?.layoutConfig?.colorPalette?.primary || '#0284c7';
  const secondaryColor = profile.themeOverrides?.secondaryColor || profile.template?.themeOverrides?.secondaryColor || profile.template?.layoutConfig?.colorPalette?.secondary || '#0c4a6e';
  const accentColor = profile.themeOverrides?.accentColor || profile.template?.themeOverrides?.accentColor || profile.template?.layoutConfig?.colorPalette?.accent || '#38bdf8';

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

export default EngineeringTemplate;
