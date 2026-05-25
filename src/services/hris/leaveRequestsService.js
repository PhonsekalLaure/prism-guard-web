import axios from 'axios';
import authService from '@services/authService';
import { buildApiUrl } from '@services/apiConfig';

const api = axios.create({
  baseURL: buildApiUrl('/api/web/hris/leave-requests'),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

async function getLeaveRequests(params = {}) {
  const { data } = await api.get('/', { params });
  return data;
}

async function getStats() {
  const { data } = await api.get('/stats');
  return data;
}

async function getLeaveRequestById(id) {
  const { data } = await api.get(`/${id}`);
  return data;
}

async function getReplacementGuards(id) {
  const { data } = await api.get(`/${id}/replacement-guards`);
  return data?.data || [];
}

async function approveLeaveRequest(id, payload = {}) {
  const requestPayload = payload.deploymentOrderFile instanceof File
    ? (() => {
      const formData = new FormData();
      formData.append('relieverEmployeeId', payload.relieverEmployeeId || '');
      formData.append('reviewNotes', payload.reviewNotes || '');
      formData.append('document_deployment_order', payload.deploymentOrderFile);
      return formData;
    })()
    : payload;

  const { data } = await api.patch(`/${id}/approve`, requestPayload);
  return data;
}

async function cancelLeaveRequest(id, reviewNotes = '') {
  const { data } = await api.patch(`/${id}/cancel`, { reviewNotes });
  return data;
}

async function rejectLeaveRequest(id, reviewNotes = '') {
  const { data } = await api.patch(`/${id}/reject`, { reviewNotes });
  return data;
}

async function openSupportingDocument(id) {
  const { data } = await api.get(`/${id}/document`);
  if (data?.url) {
    window.open(data.url, '_blank', 'noopener,noreferrer');
  }
  return data;
}

export default {
  cancelLeaveRequest,
  getLeaveRequestById,
  getLeaveRequests,
  getStats,
  getReplacementGuards,
  openSupportingDocument,
  approveLeaveRequest,
  rejectLeaveRequest,
};
