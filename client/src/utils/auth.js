/**
 * Authentication and Session Management Helpers
 */
export function getStoredUser() {
  try {
    const userStr = localStorage.getItem('rh_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem('rh_token');
}

export function setSession(token, user) {
  localStorage.setItem('rh_token', token);
  localStorage.setItem('rh_user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('rh_token');
  localStorage.removeItem('rh_user');
}

export function isAuthenticated() {
  return !!getStoredToken();
}

export function hasPermission(user, moduleKey) {
  if (!user) return false;
  if (user.role === 'SUPERADMIN' || user.role === 'ADMIN') return true;
  if (Array.isArray(user.allowedModules)) {
    return user.allowedModules.includes(moduleKey) || user.allowedModules.includes('all');
  }
  if (user.permissions) {
    return user.permissions[moduleKey] === true || user.permissions.all === true;
  }
  return false;
}

export function isSuperAdmin(user) {
  return user && user.role === 'SUPERADMIN';
}
