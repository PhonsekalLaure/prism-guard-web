import axios from 'axios';
import authService from '@services/authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE}/api/web/admins`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function getAllAdmins() {
  const { data } = await api.get('/');
  return data || [];
}

async function createAdmin(adminData) {
  const { data } = await api.post('/', adminData);
  return data;
}

async function updateAdmin(id, adminData) {
  const { data } = await api.patch(`/${id}`, adminData);
  return data;
}

async function deleteAdmin(id) {
  const { data } = await api.delete(`/${id}`);
  return data;
}

export default {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
