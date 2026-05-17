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
  return Array.isArray(data) ? data : [];
}

export default {
  getAnnouncements,
};
