export const REQUIRED_SETUP_POLICIES = [
  {
    policyKey: 'privacy_notice',
    policyVersion: 'v1',
    label: 'Data Privacy Notice',
    description: 'I understand how PrismGuard collects, uses, stores, and protects my personal information for account, employment, payroll, deployment, billing, attendance, and incident workflows.',
  },
  {
    policyKey: 'terms_and_conditions',
    policyVersion: 'v1',
    label: 'Terms and Conditions',
    description: 'I agree to use PrismGuard only for authorized company purposes and to keep account access, records, and confidential operational information secure.',
  },
];

export function buildAcceptedPolicies(acceptedMap = {}) {
  return REQUIRED_SETUP_POLICIES
    .filter((policy) => acceptedMap[policy.policyKey] === true)
    .map(({ policyKey, policyVersion }) => ({ policyKey, policyVersion }));
}

export function hasAcceptedAllRequiredPolicies(acceptedMap = {}) {
  return REQUIRED_SETUP_POLICIES.every((policy) => acceptedMap[policy.policyKey] === true);
}