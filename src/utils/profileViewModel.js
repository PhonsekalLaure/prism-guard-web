import { getAdminRoleLabel } from './adminPermissions';

export function getProfileFullName(profile) {
  const nameParts = [
    profile?.first_name,
    profile?.middle_name ? `${profile.middle_name.charAt(0)}.` : '',
    profile?.last_name,
    profile?.suffix,
  ].filter(Boolean);

  return nameParts.length > 0 ? nameParts.join(' ') : 'Not provided';
}

export function getProfilePositionLabel(profile) {
  if (profile?.role === 'admin') {
    return getAdminRoleLabel(profile?.admin_role, profile?.role || 'Administrator');
  }

  return profile?.position || profile?.role || 'Client';
}

export function getProfileEmailLabel(profile) {
  if (profile?.pending_contact_email) {
    return `${profile.contact_email || 'Not provided'} (pending: ${profile.pending_contact_email})`;
  }

  return profile?.contact_email || 'Not provided';
}

export function getEditableEmail(profile) {
  return profile?.pending_contact_email || profile?.contact_email || '';
}

export function getPhoneDisplayValue(profile) {
  return profile?.phone_number || 'Not provided';
}

export function getPhoneInputValue(phoneNumber) {
  return phoneNumber ? phoneNumber.replace(/^\+63/, '') : '';
}

export function getPhilippineMobileDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

export function formatPhilippineMobile(value) {
  const digits = getPhilippineMobileDigits(value);
  return digits ? `+63${digits}` : null;
}

export function validatePhilippineMobile(value) {
  const digits = getPhilippineMobileDigits(value);

  if (!digits) {
    return 'Mobile number is required.';
  }

  if (digits.length !== 10) {
    return 'Mobile number must be exactly 10 digits (excluding +63).';
  }

  return null;
}
