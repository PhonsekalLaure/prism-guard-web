import axios from 'axios';
import authService from './authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE}/api/web/clients`,
  headers: { 'Content-Type': 'application/json' },
});

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function getAllClients(page = 1, limit = 6, filters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  const { data } = await api.get(`/?${params}`);
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

async function getClientsList() {
  const { data } = await api.get('/list');
  return data;
}

async function createClient(clientData) {
  const { data } = await api.post('/', clientData);
  return data;
}

async function updateClient(id, clientData) {
  const { data } = await api.patch(`/${id}`, clientData);
  return data;
}

async function getClientsList() {
  const { data } = await api.get('/list');
  return data || [];
}

async function getAllSitesList() {
  const { data } = await api.get('/sites');
  return data || [];
}


export default {
  getAllClients,
  getClientDetails,
  getClientStats,
  getClientsList,
  createClient,
  updateClient
  getClientsList,
  getAllSitesList
};
