import axios from 'axios';
import authService from '@services/authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE}/api/web/hris/attendance`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function getAttendanceRecords(params = {}) {
  const { data } = await api.get('/', { params });
  return data;
}

async function getStats(params = {}) {
  const { data } = await api.get('/stats', { params });
  return data;
}

async function getClients() {
  const { data } = await api.get('/clients');
  return data;
}

export default {
  getAttendanceRecords,
  getStats,
  getClients,
};
