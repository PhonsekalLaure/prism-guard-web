import axios from 'axios';
import authService from '@services/authService';
import { buildApiUrl } from '@services/apiConfig';

const api = axios.create({
  baseURL: buildApiUrl('/api/web/hris/attendance'),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function getAttendanceRecords(params = {}) {
  const { data } = await api.get('/', { params });
  return data;
}

async function getStats(params = {}) {
  const { data } = await api.get('/stats', { params });
  return data;
}

async function getClients() {
  const { data } = await api.get('/clients');
  return data;
}

async function getAttendanceReviews(params = {}) {
  const { data } = await api.get('/reviews', { params });
  return data;
}


async function getAttendanceContests(params = {}) {
  const { data } = await api.get('/contests', { params });
  return data;
}

async function getAttendanceContestDetails(contestId) {
  const { data } = await api.get(`/contests/${contestId}`);
  return data;
}

async function approveAttendanceContest(contestId, reviewNotes) {
  const { data } = await api.post(`/contests/${contestId}/approve`, { reviewNotes });
  return data;
}

async function rejectAttendanceContest(contestId, reviewNotes) {
  const { data } = await api.post(`/contests/${contestId}/reject`, { reviewNotes });
  return data;
}
async function getAttendanceLogDetails(attendanceLogId) {
  const { data } = await api.get(`/${attendanceLogId}`);
  return data;
}

async function approveMissedClockOutScheduledEnd(attendanceLogId, reviewNotes) {
  const { data } = await api.post(`/${attendanceLogId}/missed-clock-out/approve-scheduled-end`, {
    reviewNotes,
  });
  return data;
}

function getFilenameFromDisposition(disposition) {
  const match = /filename="?([^"]+)"?/i.exec(disposition || '');
  return match?.[1] || null;
}

async function exportReport(params = {}) {
  const response = await api.get('/export', {
    params,
    responseType: 'blob',
  });

  return {
    blob: response.data,
    filename: getFilenameFromDisposition(response.headers['content-disposition']),
  };
}

export default {
  approveAttendanceContest,
  approveMissedClockOutScheduledEnd,
  getAttendanceContestDetails,
  getAttendanceContests,
  getAttendanceRecords,
  getAttendanceReviews,
  getAttendanceLogDetails,
  getStats,
  rejectAttendanceContest,
  getClients,
  exportReport,
};
