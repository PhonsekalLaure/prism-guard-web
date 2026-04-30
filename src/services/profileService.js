import axios from 'axios';
import authService from './authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE}/api/web/profile`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token to every request
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetch the full profile for the currently authenticated client.
 * @returns {Promise<Object>} profile
 */
async function getProfile() {
  const { data } = await api.get('/me');
  return data;
}

/**
 * Update contact person / representative fields.
 * @param {{ firstName?, lastName?, middleName?, phone? }} updateData
 * @returns {Promise<{ message: string }>}
 */
async function updateContactPerson(updateData) {
  const { data } = await api.patch('/me', updateData);
  return data;
}

/**
 * Change the authenticated user's password.
 * @param {{ currentPassword: string, newPassword: string, confirmPassword: string }} passwords
 * @returns {Promise<{ message: string }>}
 */
async function changePassword(passwords) {
  const { data } = await api.post('/change-password', passwords);
  return data;
}

export default { getProfile, updateContactPerson, changePassword };
