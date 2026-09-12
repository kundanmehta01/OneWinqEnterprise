import { Template } from './template.model.js';
import { Department } from '../departments/department.model.js';

/**
 * Keyword tables for department-based template resolution.
 * Templates are strictly resolved according to the member's DEPARTMENT (not roles).
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
   * Resolves the appropriate template for a team member strictly according to DEPARTMENT:
   * 1. Department Explicit Template Binding (deptDoc.templateId)
   * 2. Department Keyword / Slug Matching (e.g. engineering, sales, marketing, hr, executive)
   * 3. Organization Default Fallback (for members with no department or unmapped departments)
   *
   * @param {Object} context
   * @param {Object|string} [context.department] - Department document, populated object, or departmentId
   * @param {Object|string} [context.role] - Kept for signature compatibility; NOT used for template choice
   * @param {string} [context.designation] - Kept for signature compatibility; NOT used for template choice
   * @returns {Promise<Object>} { _id, templateId, key, name, category, layoutConfig, predefinedDetails }
   */
  async resolveTemplateForMember({ department = {}, role = {}, designation = '' } = {}) {
    // 1. Normalize: load full department with templateId if only an ID was provided
    let deptDoc = department;
    if (typeof deptDoc === 'string' || (deptDoc?._id && !deptDoc?.slug && !deptDoc?.name && !deptDoc?.templateId)) {
      try {
        deptDoc = await Department.findById(deptDoc?._id || deptDoc).populate('templateId').lean();
      } catch (_) {}
    }

    // Priority 1: Department explicit template binding
    if (deptDoc?.templateId) {
      try {
        let bound = deptDoc.templateId;
        // If already populated with template details
        if (typeof bound === 'object' && (bound?.category || bound?.layoutConfig || bound?.slug)) {
          return this._buildReturn(bound._id, bound.category || bound.slug, bound.name, bound);
        }
        // If templateId is an ObjectId or reference string
        if (typeof bound === 'string' || bound?._id) {
          const dbTpl = await Template.findById(bound._id || bound).lean();
          if (dbTpl) {
            return this._buildReturn(dbTpl._id, dbTpl.category || dbTpl.slug, dbTpl.name, dbTpl);
          }
        }
      } catch (_) {}
    }

    // Priority 2: Department keyword matching (slug + key + name)
    const deptText = `${deptDoc?.slug || ''} ${deptDoc?.key || ''} ${deptDoc?.name || ''}`;
    const match = matchDepartmentKeyword(deptText);

    const resolvedKey = match?.key || 'default';
    const resolvedName = match?.name || 'Enterprise Employee Profile';

    // Look up DB template for styling & layout config
    let dbTemplate = null;
    try {
      dbTemplate = await Template.findOne({
        $or: [{ slug: `${resolvedKey}-profile` }, { category: resolvedKey }, { slug: resolvedKey }],
        isActive: true,
        isArchived: false
      }).lean();

      if (!dbTemplate) {
        dbTemplate = await Template.findOne({ isDefault: true, isActive: true, isArchived: false }).lean();
      }
    } catch (_) {}

    return this._buildReturn(dbTemplate?._id, resolvedKey, dbTemplate?.name || resolvedName, dbTemplate);
  }

  /** Constructs the normalized return object */
  _buildReturn(id, key, name, dbTemplate) {
    return {
      _id: id || null,
      templateId: id || null,
      id: key,
      key,
      name: name || 'Enterprise Profile',
      category: dbTemplate?.category || key,
      layoutConfig: dbTemplate?.layoutConfig || {
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
      },
      predefinedDetails: dbTemplate?.predefinedDetails || {}
    };
  }
}

export const templateResolverService = new TemplateResolverService();
