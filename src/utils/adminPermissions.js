export const ADMIN_ROLE_LABELS = {
  president: 'President',
  operations_manager: 'Operations Manager',
  finance_manager: 'Finance Manager',
  secretary: 'Secretary',
};

export const ADMIN_ROLE_PERMISSIONS = {
  president: [
    'announcements.read',
    'announcements.write',
    'clients.read',
    'clients.write',
    'deployments.write',
    'incidents.read',
    'incidents.write',
    'employees.read',
    'employees.write',
    'profile.self.read',
    'profile.self.write',
    'admins.manage',
    'billing.read',
    'billing.write',
    'servicerequests.read',
    'servicerequests.write',
    'servicereviews.read',
    'servicereviews.write',
    'attendance.read',
    'attendance.write',
    'leaves.read',
    'leaves.write',
    'cashadvance.read',
    'cashadvance.write',
    'payroll.read',
    'payroll.write',
    'applicants.read',
    'applicants.write',
    'notifications.read',
    'notifications.write',
    'promocarousel.read',
    'promocarousel.write',
  ],
  operations_manager: [
    'clients.read',
    'clients.write',
    'deployments.write',
    'servicerequests.read',
    'servicerequests.write',
    'employees.read',
    'employees.write',
    'attendance.read',
    'attendance.write',
    'leaves.read',
    'leaves.write',
    'applicants.read',
    'applicants.write',
    'notifications.read',
    'notifications.write',
    'incidents.read',
    'incidents.write',
    'announcements.read',
    'announcements.write',
    'profile.self.read',
    'profile.self.write',
  ],
  finance_manager: [
    'clients.read',
    'clients.write',
    'billing.read',
    'billing.write',
    'employees.read',
    'employees.write',
    'cashadvance.read',
    'cashadvance.write',
    'payroll.read',
    'payroll.write',
    'notifications.read',
    'notifications.write',
    'announcements.read',
    'announcements.write',
    'profile.self.read',
    'profile.self.write',
  ],
  secretary: [
    'clients.read',
    'clients.write',
    'billing.read',
    'billing.write',
    'servicerequests.read',
    'servicerequests.write',
    'servicereviews.read',
    'servicereviews.write',
    'employees.read',
    'employees.write',
    'attendance.read',
    'attendance.write',
    'leaves.read',
    'leaves.write',
    'cashadvance.read',
    'cashadvance.write',
    'payroll.read',
    'payroll.write',
    'applicants.read',
    'applicants.write',
    'notifications.read',
    'notifications.write',
    'announcements.read',
    'announcements.write',
    'promocarousel.read',
    'promocarousel.write',
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
