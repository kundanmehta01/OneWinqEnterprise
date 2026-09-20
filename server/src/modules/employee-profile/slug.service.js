import { EmployeeProfile } from './employeeProfile.model.js';
import { ProfileSlugHistory } from './profileSlugHistory.model.js';

export const RESERVED_SLUGS = new Set([
  'company',
  'admin',
  'api',
  'auth',
  'login',
  'logout',
  'register',
  'dashboard',
  'settings',
  'profile',
  'profiles',
  'support',
  'help',
  'app',
  'about',
  'contact',
  'privacy',
  'terms',
  'pricing',
  'search',
  'discover',
  'feed',
  'connections',
  'organization',
  'organizations',
  'team',
  'teams',
  'invite',
  'invitation',
  'invitations',
  'null',
  'undefined',
  'public',
  'card',
  'cards',
  'events',
  'event',
  'me',
  'user',
  'users',
  'root',
  'system',
  'home',
  'status',
  'health'
]);

class SlugService {
  /**
   * Normalizes a raw string into a predictable, clean URL slug.
   * - Lowercase
   * - Converts spaces and special characters into hyphens
   * - Collapses multiple consecutive hyphens
   * - Trims leading and trailing hyphens
   */
  normalizeSlug(raw) {
    if (!raw || typeof raw !== 'string') return '';
    return raw
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .slice(0, 100);
  }

  /**
   * Checks whether a slug is reserved for system routes or resources.
   */
  isReservedSlug(slug) {
    if (!slug || typeof slug !== 'string') return false;
    const normalized = slug.trim().toLowerCase();
    return RESERVED_SLUGS.has(normalized);
  }

  /**
   * Generates a base slug from a person's display or full name.
   * Full name is preferred (e.g. "Kundan Kumar" -> "kundan-kumar").
   */
  generateBaseSlug(name) {
    const normalized = this.normalizeSlug(name);
    return normalized && normalized.length >= 2 ? normalized : 'member';
  }

  /**
   * Checks whether a slug is available for a profile.
   * Verifies format, reserved keywords, current active profiles, and historical slugs.
   */
  async isSlugAvailable(slug, excludeProfileId = null) {
    const normalized = this.normalizeSlug(slug);

    if (!normalized || normalized.length < 2) {
      return {
        available: false,
        reason: 'Slug must be at least 2 characters long and contain only lowercase letters, numbers, and hyphens.'
      };
    }

    if (normalized.length > 100) {
      return {
        available: false,
        reason: 'Slug cannot exceed 100 characters.'
      };
    }

    if (!/^[a-z0-9-]+$/.test(normalized)) {
      return {
        available: false,
        reason: 'Slug can only contain lowercase alphanumeric characters and hyphens.'
      };
    }

    // Reserved keyword check (applies to new or updated vanity slugs)
    if (this.isReservedSlug(normalized)) {
      return {
        available: false,
        reason: `'${normalized}' is a reserved system keyword and cannot be used as a profile handle.`
      };
    }

    // Check active EmployeeProfiles
    const profileQuery = { slug: normalized };
    if (excludeProfileId) {
      profileQuery._id = { $ne: excludeProfileId };
    }
    const existingProfile = await EmployeeProfile.findOne(profileQuery).select('_id').lean();
    if (existingProfile) {
      return {
        available: false,
        reason: `The profile URL handle '${normalized}' is already in use by another member.`
      };
    }

    // Check ProfileSlugHistory (historical slugs cannot be stolen or reassigned)
    const historyQuery = { slug: normalized };
    if (excludeProfileId) {
      historyQuery.profileId = { $ne: excludeProfileId };
    }
    const existingHistory = await ProfileSlugHistory.findOne(historyQuery).select('_id profileId').lean();
    if (existingHistory) {
      return {
        available: false,
        reason: `The profile URL handle '${normalized}' is permanently reserved in history for another member.`
      };
    }

    return {
      available: true,
      normalized
    };
  }

  /**
   * Generates a guaranteed unique slug for a new profile.
   * If base slug is taken, appends incrementing counter (-2, -3, etc.).
   */
  async generateUniqueSlug(name, options = {}) {
    const { excludeProfileId = null, customBaseSlug = null } = options;

    const baseSlug = customBaseSlug ? this.normalizeSlug(customBaseSlug) : this.generateBaseSlug(name);
    const validBase = baseSlug && baseSlug.length >= 2 ? baseSlug : 'member';

    // First, check the clean base slug
    const firstCheck = await this.isSlugAvailable(validBase, excludeProfileId);
    if (firstCheck.available) {
      return validBase;
    }

    // If taken, follow production convention: base-2, base-3, base-4...
    let counter = 2;
    let candidate = `${validBase}-${counter}`;

    while (true) {
      const check = await this.isSlugAvailable(candidate, excludeProfileId);
      if (check.available) {
        return candidate;
      }
      counter++;
      candidate = `${validBase}-${counter}`;
    }
  }

  /**
   * Helper to check availability and return detailed info for UI controllers.
   */
  async checkAvailabilityWithDetails(slug, excludeProfileId = null) {
    return await this.isSlugAvailable(slug, excludeProfileId);
  }
}

export const slugService = new SlugService();
