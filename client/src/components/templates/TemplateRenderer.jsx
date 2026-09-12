import React from 'react';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { HRTemplate } from './HRTemplate';
import { EngineeringTemplate } from './EngineeringTemplate';
import { SalesTemplate } from './SalesTemplate';
import { MarketingTemplate } from './MarketingTemplate';
import { ProductTemplate } from './ProductTemplate';
import { DefaultTemplate } from './DefaultTemplate';

/**
 * Dynamic Template Renderer
 * Selects and renders the appropriate visual profile template based on the backend-resolved templateKey.
 */
export const TemplateRenderer = ({
  templateKey,
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  if (!profile) return null;

  const key = (
    templateKey ||
    profile?.template?.key ||
    profile?.template?.id ||
    profile?.template?.category ||
    'default'
  ).toLowerCase().trim();

  const props = {
    profile,
    onConnectClick,
    onQrClick,
    onDownloadVCard,
    onShareClick,
    isCompact
  };

  switch (key) {
    case 'product':
    case 'product-profile':
    case 'manager':
    case 'management':
      return <ProductTemplate {...props} />;

    case 'executive':
    case 'founder':
    case 'ceo':
    case 'leadership':
      return <ExecutiveTemplate {...props} />;

    case 'hr':
    case 'human-resources':
    case 'people':
      return <HRTemplate {...props} />;

    case 'engineering':
    case 'tech':
    case 'developer':
      return <EngineeringTemplate {...props} />;

    case 'sales':
    case 'business-development':
      return <SalesTemplate {...props} />;

    case 'marketing':
    case 'creative':
    case 'design':
      return <MarketingTemplate {...props} />;

    case 'default':
    case 'employee':
    default:
      return <DefaultTemplate {...props} />;
  }
};

export default TemplateRenderer;
