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

async function getHolidays(params = {}) {
  const { data } = await api.get('/holidays', { params });
  return data;
}

async function createHoliday(payload) {
  const { data } = await api.post('/holidays', payload);
  return data;
}

async function updateHoliday(id, payload) {
  const { data } = await api.patch(`/holidays/${id}`, payload);
  return data;
}

async function deleteHoliday(id) {
  const { data } = await api.delete(`/holidays/${id}`);
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

async function markPayrollRecordPaid(runId, recordId) {
  const { data } = await api.post(`/runs/${runId}/records/${recordId}/mark-paid`);
  return data;
}

export default {
  approvePayrollRun,
  createHoliday,
  createPayrollRun,
  deleteHoliday,
  getHolidays,
  getPayrollRunById,
  listPayrollRuns,
  markPayrollRecordPaid,
  recalculatePayrollRun,
  updateHoliday,
};
