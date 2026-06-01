import axios from 'axios';
import authService from '@services/authService';
import { buildApiUrl } from '@services/apiConfig';

const api = axios.create({
  baseURL: buildApiUrl('/api/web/hris/cash-advances'),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function getCashAdvances(params = {}) {
  const { data } = await api.get('/', { params });
  return data;
}

async function getStats() {
  const { data } = await api.get('/stats');
  return data;
}

async function getCashAdvanceById(id) {
  const { data } = await api.get(`/${id}`);
  return data;
}

async function approveCashAdvance(id, payload = {}) {
  const { data } = await api.patch(`/${id}/approve`, payload);
  return data;
}

async function rejectCashAdvance(id, reviewNotes = '') {
  const { data } = await api.patch(`/${id}/reject`, { reviewNotes });
  return data;
}

async function releaseCashAdvance(id, releaseNotes = '') {
  const { data } = await api.patch(`/${id}/release`, { releaseNotes });
  return data;
}

async function settleCashAdvance(id, settlementNotes = '') {
  const { data } = await api.patch(`/${id}/settle`, { settlementNotes });
  return data;
}

export default {
  approveCashAdvance,
  getCashAdvanceById,
  getCashAdvances,
  getStats,
  rejectCashAdvance,
  releaseCashAdvance,
  settleCashAdvance,
};
