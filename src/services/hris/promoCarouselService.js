import axios from 'axios';
import authService from '@services/authService';
import { buildApiUrl } from '@services/apiConfig';

const api = axios.create({
  baseURL: buildApiUrl('/api/web/hris/promo-carousel'),
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function multipartConfig() {
  return {
    transformRequest: [(payload, headers) => {
      delete headers['Content-Type'];
      delete headers['content-type'];
      return payload;
    }],
  };
}

async function listSlides() {
  const { data } = await api.get('/');
  return data?.data || [];
}

async function createSlide(payload) {
  const { data } = await api.post('/', payload, multipartConfig());
  return data?.data;
}

async function updateSlide(id, payload) {
  const { data } = await api.patch(`/${id}`, payload, multipartConfig());
  return data?.data;
}

async function reorderSlides(slideIds) {
  const { data } = await api.patch('/reorder', { slideIds });
  return data?.data || [];
}

async function deleteSlide(id) {
  const { data } = await api.delete(`/${id}`);
  return data?.data;
}

export default {
  createSlide,
  deleteSlide,
  listSlides,
  reorderSlides,
  updateSlide,
};
