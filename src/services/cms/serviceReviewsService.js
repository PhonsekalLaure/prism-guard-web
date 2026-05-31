import axios from 'axios';
import authService from '@/services/authService';
import { buildApiUrl } from '@/services/apiConfig';

const api = axios.create({
  baseURL: buildApiUrl('/api/web/service-reviews'),
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
 * Fetch the client's active sites for the site dropdown.
 *
 * @returns {Promise<Array<{ id, site_name, site_address }>>}
 */
async function getSites() {
  const { data } = await api.get('/sites');
  return data;
}

async function getMonthlyStatus() {
  const { data } = await api.get('/monthly-status');
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
 *   reviewedEmployeeId?: string,
 *   period?: string,
 *   submissionType?: 'ad_hoc' | 'monthly_required',
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
  getSites,
  getMonthlyStatus,
  createServiceReview,
};
