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

export default {
  getAllEmployees,
  getEmployeeDetails,
};
