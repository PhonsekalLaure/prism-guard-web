import axios from 'axios';
import authService from '@/services/authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE}/api/web/service-requests`,
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
 * Fetch a paginated, filtered list of service requests.
 *
 * @param {Object} params – { page, limit, status, type, urgency }
 * @returns {Promise<{ data: Array, metadata: Object }>}
 */
async function getServiceRequests(params = {}) {
  const { data } = await api.get('/', { params });
  return data;
}

/**
 * Fetch stat counts (open, in_progress, resolved, cancelled, total).
 *
 * @returns {Promise<Object>}
 */
async function getStats() {
  const { data } = await api.get('/stats');
  return data;
}

/**
 * Fetch the client's active sites for the site dropdown in NewRequestModal.
 *
 * @returns {Promise<Array<{ id, site_name, site_address }>>}
 */
async function getSites() {
  const { data } = await api.get('/sites');
  return data;
}

/**
 * Fetch full details of a single service request.
 *
 * @param {string} id
 * @returns {Promise<Object>}
 */
async function getServiceRequestById(id) {
  const { data } = await api.get(`/${id}`);
  return data;
}

/**
 * Submit a new service request.
 *
 * @param {{ ticketType, siteId?, priority, subject?, description }} payload
 * @returns {Promise<{ id: string, message: string }>}
 */
async function createServiceRequest(payload) {
  const { data } = await api.post('/', payload);
  return data;
}

/**
 * Cancel an open/in-progress service request.
 *
 * @param {string} id
 * @returns {Promise<{ message: string }>}
 */
async function cancelServiceRequest(id) {
  const { data } = await api.patch(`/${id}/cancel`);
  return data;
}

export default {
  getServiceRequests,
  getStats,
  getSites,
  getServiceRequestById,
  createServiceRequest,
  cancelServiceRequest,
};
