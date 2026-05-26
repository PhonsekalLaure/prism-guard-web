export const NOTIFICATION_PREFIXES = {
  serviceRequest: ['service_request_'],
  serviceReview: ['service_review_'],
  leave: ['leave_'],
  applicant: ['applicant_'],
  incident: ['incident_'],
  announcement: ['announcement_'],
};

export const NOTIFICATION_SECTIONS = [
  {
    portal: 'hris',
    paths: ['/service-request', '/service-requests'],
    prefixes: NOTIFICATION_PREFIXES.serviceRequest,
  },
  {
    portal: 'hris',
    paths: ['/service-reviews'],
    prefixes: NOTIFICATION_PREFIXES.serviceReview,
  },
  {
    portal: 'hris',
    paths: ['/leaves'],
    prefixes: NOTIFICATION_PREFIXES.leave,
  },
  {
    portal: 'hris',
    paths: ['/applicants'],
    prefixes: NOTIFICATION_PREFIXES.applicant,
  },
  {
    portal: 'hris',
    paths: ['/incidents'],
    prefixes: NOTIFICATION_PREFIXES.incident,
  },
  {
    portal: 'hris',
    paths: ['/announcements'],
    prefixes: NOTIFICATION_PREFIXES.announcement,
  },
  {
    portal: 'cms',
    paths: ['/cms/service-requests'],
    prefixes: NOTIFICATION_PREFIXES.serviceRequest,
  },
  {
    portal: 'cms',
    paths: ['/cms/incident-reports'],
    prefixes: NOTIFICATION_PREFIXES.incident,
  },
  {
    portal: 'cms',
    paths: ['/cms/announcements'],
    prefixes: NOTIFICATION_PREFIXES.announcement,
  },
  {
    portal: 'cms',
    paths: ['/cms/reviews'],
    prefixes: NOTIFICATION_PREFIXES.serviceReview,
  },
];

export const SECTION_NOTIFICATION_PREFIXES = [
  ...new Set(NOTIFICATION_SECTIONS.flatMap((section) => section.prefixes)),
];

export function getNotificationPrefixesForPath(pathname, portal) {
  return NOTIFICATION_SECTIONS
    .filter((section) => !portal || section.portal === portal)
    .find((section) => section.paths.some((path) => (
      pathname === path || pathname.startsWith(`${path}/`)
    )))?.prefixes || [];
}
