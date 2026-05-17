export const DEFAULT_DEPLOY_FORM = {
  siteId: '',
  baseSalary: '',
  contractStartDate: '',
  contractEndDate: '',
  daysOfWeek: [],
  shiftStart: '',
  shiftEnd: '',
  deploymentOrderFile: null,
};

export function isEarlierDate(start, end) {
  return start && end && new Date(end) < new Date(start);
}

export function isAfterDate(date, maxDate) {
  return date && maxDate && new Date(date) > new Date(maxDate);
}

export function getSiteCoordinatesParams(site) {
  if (!site || site.latitude == null || site.longitude == null) return {};
  return {
    siteLatitude: site.latitude,
    siteLongitude: site.longitude,
  };
}
