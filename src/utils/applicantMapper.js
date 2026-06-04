import {
  FaCheckCircle,
  FaClock,
  FaStar,
  FaExclamationCircle,
} from 'react-icons/fa';

function formatDate(value) {
  if (!value) return 'N/A';
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function calculateAge(dateValue) {
  if (!dateValue) return null;
  const birthday = new Date(dateValue);
  const now = new Date();
  let age = now.getFullYear() - birthday.getFullYear();
  const monthDiff = now.getMonth() - birthday.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthday.getDate())) age -= 1;
  return age;
}

function getFullName(applicant) {
  return [applicant.first_name, applicant.middle_name, applicant.last_name, applicant.suffix]
    .filter(Boolean)
    .join(' ');
}

function getInitials(applicant) {
  return `${applicant.first_name?.[0] || ''}${applicant.last_name?.[0] || ''}`.toUpperCase() || 'AP';
}

function formatPhone(phone) {
  if (!phone) return 'N/A';
  return phone.replace(/^\+63(\d{3})(\d{3})(\d{4})$/, '+63 $1 $2 $3');
}

function buildTags(applicant) {
  const tags = [];
  const age = calculateAge(applicant.date_of_birth);

  if (applicant.has_security_license) {
    tags.push({ label: 'License Declared', color: 'tag-green', icon: FaCheckCircle });
  } else {
    tags.push({ label: 'No License Yet', color: 'tag-yellow', icon: FaClock });
  }

  if (Number(applicant.years_experience) > 0) {
    tags.push({ label: `${Number(applicant.years_experience)} yr exp`, color: 'tag-blue', icon: FaStar });
  }

  if (age !== null && age < 18) {
    tags.push({ label: 'Under 18', color: 'tag-red', icon: FaExclamationCircle });
  }

  return tags.slice(0, 3);
}

export function mapApplicantForDisplay(applicant) {
  const age = calculateAge(applicant.date_of_birth);
  const height = applicant.height_cm ? `${applicant.height_cm} cm` : 'Height N/A';

  return {
    ...applicant,
    initials: getInitials(applicant),
    avatarUrl: applicant.profile_photo_url || null,
    name: getFullName(applicant),
    applied: `Applied ${formatDate(applicant.applied_at)}`,
    appliedDate: formatDate(applicant.applied_at),
    interviewDate: applicant.interview_scheduled_at ? formatDate(applicant.interview_scheduled_at) : null,
    status: applicant.status || 'pending',
    position: applicant.position_applied || 'Security Guard',
    phone: formatPhone(applicant.phone_number),
    email: applicant.email,
    license: applicant.license_number || 'Not declared',
    physical: `${height} - Age: ${age ?? 'N/A'}`,
    age,
    height,
    tags: buildTags(applicant),
  };
}
