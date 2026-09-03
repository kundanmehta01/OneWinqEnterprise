export const checkPermission = (userPermissions = [], requiredPermission) => {
  if (!requiredPermission) return true;
  if (userPermissions.includes('*')) return true;
  return userPermissions.includes(requiredPermission);
};

export const checkAnyPermission = (userPermissions = [], requiredPermissions = []) => {
  if (!requiredPermissions.length) return true;
  if (userPermissions.includes('*')) return true;
  return requiredPermissions.some((perm) => userPermissions.includes(perm));
};
