import axios from 'axios';
import authService from '@services/authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE}/api/web/deployed-guards`,
  headers: { 'Content-Type': 'application/json' },
});

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetch a paginated list of deployed guards.
 * @param {number} page
 * @param {number} limit
 * @param {Object} filters  – { search, status, shift }
 * @returns {{ data: Array, metadata: Object }}
 */
async function getAllDeployedGuards(page = 1, limit = 6, filters = {}) {
  const { data } = await api.get('/', {
    params: {
      page,
      limit,
      ...filters,
    },
  });
  // Backend returns { data: [...], metadata: { total, page, limit, totalPages } }
  return data;
}

/**
 * Fetch stats for the Deployed Guards dashboard.
 * @returns {{ totalDeployed, onDuty, onLeave, tempReplaced }}
 */
async function getDeployedGuardsStats() {
  const { data } = await api.get('/stats');
  return data;
}

/**
 * Fetch full details for a single deployed guard (by deployment ID).
 * @param {string} deploymentId
 * @returns {Object}
 */
async function getDeployedGuardDetails(deploymentId) {
  const { data } = await api.get(`/${deploymentId}`);
  return data;
}

export default {
  getAllDeployedGuards,
  getDeployedGuardsStats,
  getDeployedGuardDetails,
};
