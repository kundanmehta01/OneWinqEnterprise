import { Template } from './template.model.js';
import { Department } from '../departments/department.model.js';
import { Role } from '../roles/role.model.js';

/**
 * Keyword tables for role/designation/department-based template resolution.
 * Templates resolve dynamically: Role -> Designation -> Department -> Fallback.
 */
const DEPARTMENT_KEYWORD_MAP = [
  {
    key: 'executive',
    name: 'Executive Leadership Profile',
    terms: [
      'executive', 'leadership', 'board', 'c-suite', 'founder', 'ceo office',
      'directorate', 'management committee', 'general management', 'governance'
    ]
  },
  {
    key: 'product',
    name: 'Product Profile',
    terms: [
      'product', 'product management', 'program management',
      'project management', 'product operations', 'prod'
    ]
  },
  {
    key: 'engineering',
    name: 'Engineering Profile',
    terms: [
      'engineering', 'developer', 'software', 'tech', 'technology',
      'devops', 'infrastructure', 'platform', 'qa', 'quality assurance',
      'systems', 'r&d', 'research & development'
    ]
  },
  {
    key: 'sales',
    name: 'Enterprise Sales Profile',
    terms: [
      'sales', 'business development', 'bd', 'revenue', 'revops',
      'revenue operations', 'commercial', 'account management'
    ]
  },
  {
    key: 'marketing',
    name: 'Marketing & Creative Profile',
    terms: [
      'marketing', 'brand', 'creative', 'design', 'growth',
      'content', 'pr', 'public relations', 'communications', 'media'
    ]
  },
  {
    key: 'hr',
    name: 'Human Resources Profile',
    terms: [
      'hr', 'human resources', 'talent', 'people', 'culture',
      'recruitment', 'talent acquisition', 'people operations'
    ]
  },
  {
    key: 'management',
    name: 'Manager Profile',
    terms: [
      'operations', 'administration', 'general operations'
    ]
  }
];

/** Returns the matching { key, name } for the given department text, or null. */
const matchDepartmentKeyword = (text) => {
  const lower = (text || '').toLowerCase().trim();
  if (!lower) return null;
  for (const entry of DEPARTMENT_KEYWORD_MAP) {
    for (const term of entry.terms) {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
      if (regex.test(lower)) {
        return { key: entry.key, name: entry.name };
      }
    }
  }
  return null;
};

/**
 * Template color defaults per category key.
 */
const PRIMARY_COLORS = {
  executive: '#4f46e5',
  hr: '#0891b2',
  engineering: '#0284c7',
  sales: '#d97706',
  marketing: '#7c3aed',
  product: '#6366f1',
  management: '#2563eb'
};

class TemplateResolverService {
  /**
   * Resolves the appropriate template for a team member dynamically:
   * 1. ROLE Keyword Matching (e.g. 'HR Admin' -> hr, 'Content Admin' -> marketing)
   * 2. DESIGNATION Keyword Matching (e.g. 'HR Administrator' -> hr)
   * 3. Department Explicit Template Binding (deptDoc.templateId)
   * 4. Department Keyword / Slug Matching (e.g. engineering, sales, marketing, hr, executive)
   * 5. Explicit templateId fallback (e.g. previously stored profile template)
   * 6. Organization Default Fallback
   *
   * @param {Object} context
   * @param {Object|string} [context.department] - Department document, populated object, or departmentId
   * @param {Object|string} [context.role] - Role document, populated object, or roleId
   * @param {string} [context.designation] - Member designation text
   * @param {Object|string} [context.templateId] - Explicit template reference; used only as a fallback
   * @returns {Promise<Object>} { _id, templateId, key, name, category, layoutConfig, predefinedDetails }
   */
  async resolveTemplateForMember({ department = {}, role = {}, designation = '', templateId = null, themeOverrides = null } = {}) {
    // ── 1. Normalize inputs (accept docs, populated objects, or raw ids) ──
    let roleDoc = role;
    if (typeof roleDoc === 'string' || (roleDoc?._id && !roleDoc?.name && !roleDoc?.slug)) {
      try {
        roleDoc = await Role.findById(roleDoc?._id || roleDoc).lean();
      } catch (_) {}
    }

    let deptDoc = department;
    if (typeof deptDoc === 'string' || (deptDoc?._id && !deptDoc?.slug && !deptDoc?.name && !deptDoc?.templateId)) {
      try {
        deptDoc = await Department.findById(deptDoc?._id || deptDoc).populate('templateId').lean();
      } catch (_) {}
    }

    // ── 2. Resolve category key: Role -> Designation -> Department ──
    let match = null;
    let boundTemplateDoc = null;

    // Priority 1: ROLE keyword matching (e.g. 'HR Admin' -> hr)
    const roleText = `${roleDoc?.name || ''} ${roleDoc?.slug || ''}`;
    match = matchDepartmentKeyword(roleText);

    // Priority 2: DESIGNATION keyword matching (e.g. 'HR Administrator' -> hr)
    if (!match) {
      match = matchDepartmentKeyword(designation);
    }

    // Priority 3: Department explicit template binding
    if (!match && deptDoc?.templateId) {
      try {
        const bound = deptDoc.templateId;
        if (typeof bound === 'object' && (bound?.category || bound?.layoutConfig || bound?.slug)) {
          boundTemplateDoc = bound;
        } else if (typeof bound === 'string' || bound?._id) {
          boundTemplateDoc = await Template.findById(bound._id || bound).lean();
        }
      } catch (_) {}
    }

    // Priority 4: Department keyword matching
    if (!match && !boundTemplateDoc) {
      const deptText = `${deptDoc?.slug || ''} ${deptDoc?.key || ''} ${deptDoc?.name || ''}`;
      match = matchDepartmentKeyword(deptText);
    }

    // ── 3. Load DB template for the resolved key / binding ──
    const resolvedKey = match?.key || null;
    let dbTemplate = boundTemplateDoc;
    if (!dbTemplate && resolvedKey) {
      try {
        dbTemplate = await Template.findOne({
          $or: [{ slug: `${resolvedKey}-profile` }, { category: resolvedKey }, { slug: resolvedKey }],
          isActive: true,
          isArchived: false
        }).lean();
      } catch (_) {}
    }

    // Fallback A: explicit templateId (e.g. previously stored profile template)
    if (!dbTemplate && templateId) {
      try {
        const tplDoc = typeof templateId === 'object' && templateId._id
          ? templateId
          : await Template.findById(templateId).lean();
        if (tplDoc && (tplDoc.category || tplDoc.slug || tplDoc.layoutConfig)) {
          const tplKey = tplDoc.category || (tplDoc.slug ? tplDoc.slug.replace(/-profile$/, '') : 'default');
          return this._buildReturn(tplDoc._id, tplKey, tplDoc.name, tplDoc, themeOverrides);
        }
      } catch (_) {}
    }

    // Fallback B: organization default template
    if (!dbTemplate) {
      try {
        dbTemplate = await Template.findOne({ isDefault: true, isActive: true, isArchived: false }).lean();
      } catch (_) {}
    }

    const finalKey = resolvedKey
      || (boundTemplateDoc?.category || (boundTemplateDoc?.slug ? boundTemplateDoc.slug.replace(/-profile$/, '') : null))
      || 'default';

    return this._buildReturn(dbTemplate?._id, finalKey, dbTemplate?.name || match?.name, dbTemplate, themeOverrides);
  }

  /** Constructs the normalized return object */
  _buildReturn(id, key, name, dbTemplate, themeOverrides = null) {
    const layout = dbTemplate?.layoutConfig || {
      headerStyle: key === 'executive' ? 'cover_left' : 'centered',
      colorPalette: {
        primary: PRIMARY_COLORS[key] || '#2563eb',
        secondary: '#1e293b',
        accent: '#818cf8',
        background: '#ffffff',
        text: '#0f172a'
      },
      fontHeading: 'Inter',
      fontBody: 'Inter'
    };

    const colorPalette = {
      ...(layout.colorPalette || {}),
      ...(themeOverrides?.primaryColor ? { primary: themeOverrides.primaryColor } : {}),
      ...(themeOverrides?.secondaryColor ? { secondary: themeOverrides.secondaryColor } : {}),
      ...(themeOverrides?.accentColor ? { accent: themeOverrides.accentColor } : {})
    };

    return {
      _id: id || null,
      templateId: id || null,
      id: key,
      key,
      name: name || 'Enterprise Profile',
      category: dbTemplate?.category || key,
      layoutConfig: {
        ...layout,
        colorPalette,
        fontHeading: themeOverrides?.fontHeading || layout.fontHeading || 'Inter',
        fontBody: themeOverrides?.fontBody || layout.fontBody || 'Inter'
      },
      predefinedDetails: dbTemplate?.predefinedDetails || {}
    };
  }
}

export const templateResolverService = new TemplateResolverService();
