import axios from 'axios';
import authService from '@/services/authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE}/api/web/service-reviews`,
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
 * Fetch a paginated, filtered list of past reviews.
 *
 * @param {Object} params – { page, limit, category, sort }
 * @returns {Promise<{ data: Array, metadata: Object }>}
 */
async function getServiceReviews(params = {}) {
  const { data } = await api.get('/', { params });
  return data;
}

/**
 * Fetch review stats (pending, published, rejected, total, avgRating).
 *
 * @returns {Promise<Object>}
 */
async function getStats() {
  const { data } = await api.get('/stats');
  return data;
}

/**
 * Fetch the client's active sites for the site dropdown.
 *
 * @returns {Promise<Array<{ id, site_name, site_address }>>}
 */
async function getSites() {
  const { data } = await api.get('/sites');
  return data;
}

/**
 * Submit a new service review.
 *
 * @param {{
 *   overallRating: number,
 *   guardQuality?: number,
 *   punctuality?: number,
 *   communication?: number,
 *   responsiveness?: number,
 *   category: string,
 *   siteId?: string,
 *   period?: string,
 *   reviewText: string,
 * }} payload
 * @returns {Promise<{ id: string, message: string }>}
 */
async function createServiceReview(payload) {
  const { data } = await api.post('/', payload);
  return data;
}

export default {
  getServiceReviews,
  getStats,
  getSites,
  createServiceReview,
};
