import React from 'react';
import { IdentityFlowSections } from './IdentityFlowSections';

export const ProductTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#0f766e';
  const accentColor = profile.template?.layoutConfig?.colorPalette?.accent || '#14b8a6';

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

export default ProductTemplate;
