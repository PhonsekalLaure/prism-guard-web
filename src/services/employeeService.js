import axios from 'axios';
import authService from './authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE}/api/web/employees`,
  headers: { 'Content-Type': 'application/json' },
});

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
  // The backend now returns { data: [...], metadata: { ... } }
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

async function createEmployee(formData) {
  const { data } = await api.post('/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
}

async function getNextEmployeeId() {
  const { data } = await api.get('/next-id');
  return data.nextId;
}

async function updateEmployee(id, formData) {
  const { data } = await api.patch(`/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

export default {
  getAllEmployees,
  getEmployeeDetails,
  getEmployeeStats,
  createEmployee,
  updateEmployee,
  getNextEmployeeId
};
