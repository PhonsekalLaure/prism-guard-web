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

async function getPayrollCutoffReadiness(params = {}) {
  const { data } = await api.get('/readiness', { params });
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

async function markGovernmentRemittance(runId, agency, payload) {
  const formData = new FormData();
  formData.append('reference_number', payload.referenceNumber);
  formData.append('remittance_date', payload.remittanceDate);
  if (payload.receiptFile) formData.append('receipt', payload.receiptFile);

  const { data } = await api.post(
    `/runs/${runId}/remittances/${agency}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
}

async function getGovernmentRemittanceContext(runId) {
  const { data } = await api.get(`/runs/${runId}/remittances`);
  return data;
}

async function downloadGovernmentReport(runId, agency) {
  const response = await api.get(
    `/runs/${runId}/government-reports/${agency}`,
    { responseType: 'blob' }
  );
  const disposition = response.headers?.['content-disposition'] || '';
  const filenamePart = disposition.split('filename=')[1]?.split(';')[0]?.trim();
  return {
    blob: response.data,
    filename: filenamePart?.replaceAll(String.fromCharCode(34), '')
      || `${agency}-government-remittance-report`,
  };
}

async function downloadGovernmentRemittanceReceipt(runId, agency) {
  const response = await api.get(
    `/runs/${runId}/remittances/${agency}/receipt`,
    { responseType: 'blob' }
  );
  const disposition = response.headers?.['content-disposition'] || '';
  const filenamePart = disposition.split('filename=')[1]?.split(';')[0]?.trim();
  return {
    blob: response.data,
    filename: filenamePart?.replaceAll(String.fromCharCode(34), '')
      || `${agency}-remittance-receipt`,
  };
}

export default {
  approvePayrollRun,
  createHoliday,
  createPayrollRun,
  deleteHoliday,
  downloadGovernmentReport,
  downloadGovernmentRemittanceReceipt,
  getHolidays,
  getGovernmentRemittanceContext,
  getPayrollCutoffReadiness,
  getPayrollRunById,
  listPayrollRuns,
  markGovernmentRemittance,
  markPayrollRecordPaid,
  recalculatePayrollRun,
  updateHoliday,
};
