const DEFAULT_API_BASE_URL = 'http://localhost:3000';

export function getApiBaseUrl() {
  return (import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, '');
}

export function buildApiUrl(path = '') {
  const normalizedPath = String(path).replace(/^\/+/, '');
  return normalizedPath ? `${getApiBaseUrl()}/${normalizedPath}` : getApiBaseUrl();
}
