export const PASSWORD_REQUIREMENTS = [
  {
    key: 'length',
    label: 'At least 8 characters',
    shortLabel: 'At least 8 chars',
    test: (password) => password.length >= 8,
  },
  {
    key: 'uppercase',
    label: 'At least one uppercase letter',
    shortLabel: '1 Uppercase',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    key: 'lowercase',
    label: 'At least one lowercase letter',
    shortLabel: '1 Lowercase',
    test: (password) => /[a-z]/.test(password),
  },
  {
    key: 'number',
    label: 'At least one number',
    shortLabel: '1 Number',
    test: (password) => /[0-9]/.test(password),
  },
  {
    key: 'symbol',
    label: 'At least one special character',
    shortLabel: '1 Symbol',
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export const PASSWORD_POLICY_MESSAGE =
  'Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.';

export function getPasswordRequirementStatus(password = '') {
  return PASSWORD_REQUIREMENTS.map((requirement) => ({
    ...requirement,
    isMet: requirement.test(password),
  }));
}

export function validatePassword(password = '') {
  const requirements = getPasswordRequirementStatus(password);
  return {
    isValid: requirements.every((requirement) => requirement.isMet),
    requirements,
  };
}

export function getPasswordPolicyError(password = '') {
  return validatePassword(password).isValid || PASSWORD_POLICY_MESSAGE;
}

export function getPasswordStrength(password = '') {
  if (!password) return { score: 0, label: '', cls: '' };

  const metCount = validatePassword(password).requirements.filter((requirement) => requirement.isMet).length;
  const score = Math.min(4, metCount + (password.length >= 12 ? 1 : 0));

  if (score <= 1) return { score, label: 'Weak', cls: 'weak' };
  if (score === 2) return { score, label: 'Fair', cls: 'fair' };
  if (score === 3) return { score, label: 'Good', cls: 'good' };
  return { score, label: 'Strong', cls: 'strong' };
}
