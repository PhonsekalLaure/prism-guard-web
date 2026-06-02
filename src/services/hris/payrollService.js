import axios from 'axios';
import authService from '@services/authService';
import { buildApiUrl } from '@services/apiConfig';

const api = axios.create({
  baseURL: buildApiUrl('/api/web/hris/payroll'),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function listPayrollRuns(params = {}) {
  const { data } = await api.get('/runs', { params });
  return data;
}

async function previewPayrollRun(payload) {
  const { data } = await api.post('/runs/preview', payload);
  return data;
}

async function createPayrollRun(payload) {
  const { data } = await api.post('/runs', payload);
  return data;
}

async function getPayrollRunById(id) {
  const { data } = await api.get(`/runs/${id}`);
  return data;
}

async function recalculatePayrollRun(id) {
  const { data } = await api.post(`/runs/${id}/recalculate`);
  return data;
}

async function approvePayrollRun(id) {
  const { data } = await api.post(`/runs/${id}/approve`);
  return data;
}

async function markPayrollRunPaid(id) {
  const { data } = await api.post(`/runs/${id}/mark-paid`);
  return data;
}

export default {
  approvePayrollRun,
  createPayrollRun,
  getPayrollRunById,
  listPayrollRuns,
  markPayrollRunPaid,
  previewPayrollRun,
  recalculatePayrollRun,
};
