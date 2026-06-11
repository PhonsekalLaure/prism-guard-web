import axios from 'axios';
import authService from '@/services/authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE}/api/web/announcements`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Admin announcements (published by Prism Guard admin for clients) ──────────

async function getAnnouncements(params = {}) {
  const { data } = await api.get('/', { params });
  if (Array.isArray(data)) {
    return {
      data,
      metadata: {
        total: data.length,
        page: 1,
        limit: data.length,
        totalPages: data.length ? 1 : 0,
      },
    };
  }
  return {
    data: Array.isArray(data?.data) ? data.data : [],
    metadata: data?.metadata || {
      total: 0,
      page: 1,
      limit: params.limit || 10,
      totalPages: 0,
    },
  };
}

// ── Client announcements (created by this client for their deployed guards) ───

/**
 * Fetch the calling client's own published announcements.
 */
async function getClientAnnouncements(params = {}) {
  const { data } = await api.get('/client', { params });
  return {
    data: Array.isArray(data?.data) ? data.data : [],
    metadata: data?.metadata || {
      total: 0,
      page: 1,
      limit: params.limit || 10,
      totalPages: 0,
    },
  };
}

/**
 * Create a new client-to-guard announcement.
 * @param {{ title: string, message: string }} payload
 */
async function createClientAnnouncement(payload) {
  const { data } = await api.post('/client', payload);
  return data;
}

export default {
  getAnnouncements,
  getClientAnnouncements,
  createClientAnnouncement,
};
