/**
 * Recursively sanitizes an object or array by removing internal mongoose keys, ObjectIds, and timestamps.
 */
export const sanitizeForDiff = (val) => {
  if (val === null || val === undefined) return val;
  if (Array.isArray(val)) {
    return val.map((item) => sanitizeForDiff(item));
  }
  if (typeof val === 'object') {
    const cleaned = {};
    for (const [k, v] of Object.entries(val)) {
      if (
        k === '_id' ||
        k === 'id' ||
        k === '__v' ||
        k === 'createdAt' ||
        k === 'updatedAt' ||
        k === 'passwordHash' ||
        k === 'tokens' ||
        k === 'refreshTokens' ||
        k === 'tokenHash' ||
        k === 'templateVersion'
      ) {
        continue;
      }
      cleaned[k] = sanitizeForDiff(v);
    }
    return cleaned;
  }
  return val;
};

/**
 * Recursively computes diffs between two objects/arrays for audit logging and profile review
 * @param {Object} oldObj - The original/previous state
 * @param {Object} newObj - The modified/new state
 * @param {String} prefix - Path prefix for nested keys
 * @returns {Array<{ field: string, oldValue: any, newValue: any }>}
 */
export const calculateObjectDiff = (oldObj = {}, newObj = {}, prefix = '') => {
  const diffs = [];

  const oldClean = sanitizeForDiff(JSON.parse(JSON.stringify(oldObj || {})));
  const newClean = sanitizeForDiff(JSON.parse(JSON.stringify(newObj || {})));

  const allKeys = new Set([...Object.keys(oldClean), ...Object.keys(newClean)]);

  for (const key of allKeys) {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    const val1 = oldClean[key];
    const val2 = newClean[key];

    // If both are plain nested objects (and not null or array), recurse
    if (
      val1 !== null &&
      val2 !== null &&
      typeof val1 === 'object' &&
      typeof val2 === 'object' &&
      !Array.isArray(val1) &&
      !Array.isArray(val2)
    ) {
      const nestedDiffs = calculateObjectDiff(val1, val2, currentPath);
      diffs.push(...nestedDiffs);
    } else {
      // Compare primitives or arrays by sanitized JSON string comparison
      const str1 = JSON.stringify(val1 ?? null);
      const str2 = JSON.stringify(val2 ?? null);

      if (str1 !== str2) {
        diffs.push({
          field: currentPath,
          oldValue: val1 !== undefined ? val1 : null,
          newValue: val2 !== undefined ? val2 : null
        });
      }
    }
  }

  return diffs;
};

