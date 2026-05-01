import axios from 'axios';
import authService from './authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE}/api/web/clients`,
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

async function getAllClients(page = 1, limit = 6, filters = {}) {
  const { data } = await api.get('/', {
    params: {
      page,
      limit,
      ...filters,
    }
  });
  return data;
}

async function getClientDetails(id) {
  const { data } = await api.get(`/${id}`);
  return data;
}

async function getClientStats() {
  const { data } = await api.get('/stats');
  return data;
}

async function createClient(clientData) {
  if (clientData instanceof FormData) {
    const config = withMultipartFormData(clientData);
    const { data } = await api.post('/', config.data, config);
    return data;
  }

  const { data } = await api.post('/', clientData);
  return data;
}

async function updateClient(id, clientData) {
  if (clientData instanceof FormData) {
    const config = withMultipartFormData(clientData);
    const { data } = await api.patch(`/${id}`, config.data, config);
    return data;
  }

  const { data } = await api.patch(`/${id}`, clientData);
  return data;
}

async function deactivateClient(id) {
  const { data } = await api.post(`/${id}/deactivate`);
  return data;
}

async function relieveAllClientGuards(id, payload = {}) {
  const { data } = await api.post(`/${id}/relieve-all`, payload);
  return data;
}

async function getClientsList() {
  const { data } = await api.get('/list');
  return data || [];
}

async function getAllSitesList(params = {}) {
  const { data } = await api.get('/sites', { params });
  return data || [];
}

export default {
  getAllClients,
  getClientDetails,
  getClientStats,
  getClientsList,
  createClient,
  updateClient,
  deactivateClient,
  relieveAllClientGuards,
  getAllSitesList
};
