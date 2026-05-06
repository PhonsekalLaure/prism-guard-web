import axios from 'axios';
import authService from '@/services/authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE}/api/web/dashboard`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token to every request
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetch the complete dashboard summary for the authenticated client.
 *
 * Returns:
 *  - company_name
 *  - stats: { deployed_guards, pending_requests, today_incidents, outstanding_payments }
 *  - recent_incidents: Array (up to 5)
 *  - recent_service_requests: Array (up to 3)
 *  - upcoming_billing: Object | null
 *  - contract_overview: Object
 *
 * @returns {Promise<Object>}
 */
async function getDashboardSummary() {
  const { data } = await api.get('/summary');
  return data;
}

export default { getDashboardSummary };
