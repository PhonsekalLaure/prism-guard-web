import axios from 'axios';
import authService from '@services/authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE}/api/web/employees`,
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

async function getAllEmployees(page = 1, limit = 6, filters = {}) {
  const { data } = await api.get('/', {
    params: {
      page,
      limit,
      ...filters
    }
  });
  return data;
}

async function getEmployeeDetails(id) {
  const { data } = await api.get(`/${id}`);
  return data;
}

async function getEmployeeStats() {
  const { data } = await api.get('/stats');
  return data;
}

async function getDeployableEmployees(params = {}) {
  const { data } = await api.get('/deployable', { params });
  return data || [];
}

async function createEmployee(formData) {
  const config = withMultipartFormData(formData);
  const { data } = await api.post('/', config.data, config);
  return data;
}

async function getNextEmployeeId() {
  const { data } = await api.get('/next-id');
  return data.nextId;
}

async function updateEmployee(id, formData) {
  const config = withMultipartFormData(formData);
  const { data } = await api.patch(`/${id}`, config.data, config);
  return data;
}

async function deactivateEmployee(id) {
  const { data } = await api.post(`/${id}/deactivate`);
  return data;
}

async function deployEmployee(id, payload) {
  if (payload instanceof FormData) {
    const config = withMultipartFormData(payload);
    const { data } = await api.post(`/${id}/deploy`, config.data, config);
    return data;
  }

  const { data } = await api.post(`/${id}/deploy`, payload);
  return data;
}

async function transferEmployeeAssignment(id, payload) {
  if (payload instanceof FormData) {
    const config = withMultipartFormData(payload);
    const { data } = await api.post(`/${id}/transfer`, config.data, config);
    return data;
  }

  const { data } = await api.post(`/${id}/transfer`, payload);
  return data;
}

async function relieveEmployeeAssignment(id, payload = {}) {
  const { data } = await api.post(`/${id}/relieve`, payload);
  return data;
}

export default {
  getAllEmployees,
  getEmployeeDetails,
  getEmployeeStats,
  getDeployableEmployees,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
  deployEmployee,
  transferEmployeeAssignment,
  relieveEmployeeAssignment,
  getNextEmployeeId
};
