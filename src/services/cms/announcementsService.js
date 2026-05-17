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

export default {
  getAnnouncements,
};
