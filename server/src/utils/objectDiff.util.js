/**
 * Recursively computes diffs between two objects/arrays for audit logging and profile review
 * @param {Object} oldObj - The original/previous state
 * @param {Object} newObj - The modified/new state
 * @param {String} prefix - Path prefix for nested keys
 * @returns {Array<{ field: string, oldValue: any, newValue: any }>}
 */
export const calculateObjectDiff = (oldObj = {}, newObj = {}, prefix = '') => {
  const diffs = [];

  const oldClean = JSON.parse(JSON.stringify(oldObj || {}));
  const newClean = JSON.parse(JSON.stringify(newObj || {}));

  const allKeys = new Set([...Object.keys(oldClean), ...Object.keys(newClean)]);

  // Ignore internal mongoose/system fields
  const ignoredKeys = new Set(['_id', '__v', 'createdAt', 'updatedAt', 'passwordHash', 'tokens', 'refreshTokens', 'tokenHash']);

  for (const key of allKeys) {
    if (ignoredKeys.has(key)) continue;

    const currentPath = prefix ? `${prefix}.${key}` : key;
    const val1 = oldClean[key];
    const val2 = newClean[key];

    // If both are objects (and not null/array), recurse
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
      // Compare primitives or arrays by JSON string comparison
      const str1 = JSON.stringify(val1);
      const str2 = JSON.stringify(val2);

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
