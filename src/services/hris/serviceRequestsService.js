import axios from 'axios';
import authService from '@services/authService';
import { buildApiUrl } from '@services/apiConfig';

const api = axios.create({
  baseURL: buildApiUrl('/api/web/hris/service-requests'),
  headers: { 'Content-Type': 'application/json' },
});

function withMultipartFormData(formData) {
  const headers = { ...api.defaults.headers.common };

  return {
    headers,
    transformRequest: [(payload, requestHeaders) => {
      delete requestHeaders['Content-Type'];
      delete requestHeaders['content-type'];
      delete requestHeaders.common;
      return payload;
    }],
    data: formData,
  };
}

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function getServiceRequests(params = {}) {
  const { data } = await api.get('/', { params });
  return data;
}

async function getStats() {
  const { data } = await api.get('/stats');
  return data;
}

async function getClients() {
  const { data } = await api.get('/clients');
  return data;
}

async function getServiceRequestById(id) {
  const { data } = await api.get(`/${id}`);
  return data;
}

async function updateStatus(id, status, resolutionNotes) {
  const { data } = await api.patch(`/${id}/status`, { status, resolutionNotes });
  return data;
}

async function sendMessage(id, message) {
  const { data } = await api.post(`/${id}/messages`, { message });
  return data;
}

async function deployAdditionalGuard(id, payload) {
  if (payload instanceof FormData) {
    const config = withMultipartFormData(payload);
    const { data } = await api.post(`/${id}/additional-guard/deploy`, config.data, config);
    return data;
  }

  const { data } = await api.post(`/${id}/additional-guard/deploy`, payload);
  return data;
}

async function fulfillGuardReplacement(id, payload) {
  if (payload instanceof FormData) {
    const config = withMultipartFormData(payload);
    const { data } = await api.post(`/${id}/guard-replacement/fulfill`, config.data, config);
    return data;
  }

  const { data } = await api.post(`/${id}/guard-replacement/fulfill`, payload);
  return data;
}

export default {
  getServiceRequests,
  getStats,
  getClients,
  getServiceRequestById,
  updateStatus,
  sendMessage,
  deployAdditionalGuard,
  fulfillGuardReplacement,
};
