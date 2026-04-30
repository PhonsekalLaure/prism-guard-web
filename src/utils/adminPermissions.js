export const ADMIN_ROLE_LABELS = {
  president: 'President',
  operations_manager: 'Operations Manager',
  finance_manager: 'Finance Manager',
  secretary: 'Secretary',
};

export const ADMIN_ROLE_PERMISSIONS = {
  president: [
    'clients.read',
    'clients.write',
    'employees.read',
    'employees.write',
    'profile.self.read',
    'profile.self.write',
    'admins.manage',
  ],
  operations_manager: [
    'clients.read',
    'clients.write',
    'employees.read',
    'employees.write',
    'profile.self.read',
    'profile.self.write',
  ],
  finance_manager: [
    'clients.read',
    'clients.write',
    'employees.read',
    'employees.write',
    'profile.self.read',
    'profile.self.write',
  ],
  secretary: [
    'clients.read',
    'clients.write',
    'employees.read',
    'employees.write',
    'profile.self.read',
    'profile.self.write',
  ],
};

export function hasPermission(profile, permission) {
  if (!profile || profile.role !== 'admin') {
    return false;
  }

  const permissions = Array.isArray(profile.permissions) ? profile.permissions : [];
  return permissions.includes(permission);
}

export function hasAllPermissions(profile, permissions = []) {
  return permissions.every((permission) => hasPermission(profile, permission));
}

export function getAdminRoleLabel(adminRole, fallback = 'Administrator') {
  return ADMIN_ROLE_LABELS[adminRole] || fallback;
}

export function getAdminRolePermissions(adminRole) {
  return ADMIN_ROLE_PERMISSIONS[adminRole] || [];
}
