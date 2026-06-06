import axios from 'axios';
import authService from '@services/authService';
import { buildApiUrl } from '@services/apiConfig';

const api = axios.create({
  baseURL: buildApiUrl('/api/web/hris/billings'),
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

async function generateStatements(payload) {
  const { data } = await api.post('/generate', payload);
  return data;
}

async function previewStatements(payload) {
  const { data } = await api.post('/preview', payload);
  return data;
}

async function generateStatement(id) {
  const { data } = await api.post(`/${id}/statement/generate`);
  return data;
}

async function previewStatement(id) {
  const { data } = await api.post(`/${id}/statement/preview`);
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

function getDownloadFilename(headers, fallback) {
  const disposition = headers?.['content-disposition'] || '';
  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1]);
  const match = disposition.match(/filename="?([^"]+)"?/i);
  return match?.[1] || fallback;
}

async function downloadStatement(id) {
  const response = await api.get(`/${id}/statement/download`, { responseType: 'blob' });
  return {
    blob: response.data,
    filename: getDownloadFilename(response.headers, 'billing-statement.pdf'),
  };
}

async function downloadReceipt(billingId, receiptId) {
  const response = await api.get(`/${billingId}/receipts/${receiptId}/download`, { responseType: 'blob' });
  return {
    blob: response.data,
    filename: getDownloadFilename(response.headers, 'payment-receipt'),
  };
}

async function approveReceipt(billingId, receiptId, payload = {}) {
  const { data } = await api.patch(`/${billingId}/receipts/${receiptId}/approve`, payload);
  return data;
}

async function rejectReceipt(billingId, receiptId, payload = {}) {
  const { data } = await api.patch(`/${billingId}/receipts/${receiptId}/reject`, payload);
  return data;
}

export default {
  approveReceipt,
  createHoliday,
  deleteHoliday,
  downloadReceipt,
  downloadStatement,
  generateStatement,
  generateStatements,
  previewStatement,
  previewStatements,
  getBilling,
  getBillings,
  getHolidays,
  getStatementUrl,
  getStats,
  rejectReceipt,
  updateHoliday,
};
