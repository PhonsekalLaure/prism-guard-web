import { numeric } from './payrollFormatters.js';

export const GOVERNMENT_AGENCIES = [
  { key: 'sss', label: 'SSS + EC' },
  { key: 'philhealth', label: 'PhilHealth' },
  { key: 'pagibig', label: 'Pag-IBIG' },
];

export function buildGovernmentRemittanceSummary(context) {
  return GOVERNMENT_AGENCIES.map((agency) => {
    const agencyContext = context?.agencies?.find((item) => item.agency === agency.key);
    const employeeShare = numeric(agencyContext?.employee_share);
    const employerShare = numeric(agencyContext?.employer_share);
    const ecAmount = numeric(agencyContext?.ec_amount);

    return {
      ...agency,
      employeeShare,
      employerShare,
      ecAmount,
      totalAmount: numeric(
        agencyContext?.total_amount ?? employeeShare + employerShare + ecAmount
      ),
      remittance: agencyContext?.remittance || null,
    };
  });
}

export function formatContributionMonth(value) {
  if (!value) return '';
  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString('en-PH', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Manila',
  });
}

export function getManilaDateKey() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}
