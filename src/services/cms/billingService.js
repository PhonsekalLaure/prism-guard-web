import axios from 'axios';
import authService from '@/services/authService';
import { buildApiUrl } from '@/services/apiConfig';

const api = axios.create({
  baseURL: buildApiUrl('/api/web/billings'),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

async function getBillings(params = {}) {
  const { data } = await api.get('/', { params });
  return data;
}

async function getStats() {
  const { data } = await api.get('/stats');
  return data;
}

async function getPaymentHistory(params = {}) {
  const { data } = await api.get('/history', { params });
  return data;
}

async function getBilling(id) {
  const { data } = await api.get(`/${id}`);
  return data;
}

async function getStatementUrl(id, download = false) {
  const { data } = await api.get(`/${id}/statement`, { params: { download } });
  return data;
}

async function submitReceipt(id, formData) {
  const { data } = await api.post(`/${id}/receipt`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export default {
  getBilling,
  getBillings,
  getPaymentHistory,
  getStatementUrl,
  getStats,
  submitReceipt,
};
