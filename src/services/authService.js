import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE}/api/web/auth`,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Token helpers ───────────────────────────────────────────

function getToken() {
  return localStorage.getItem('access_token');
}

function setTokens(session) {
  localStorage.setItem('access_token', session.access_token);
  localStorage.setItem('refresh_token', session.refresh_token);
}

function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_profile');
}

function setProfile(profile) {
  localStorage.setItem('user_profile', JSON.stringify(profile));
}

function getProfile() {
  const raw = localStorage.getItem('user_profile');
  return raw ? JSON.parse(raw) : null;
}

// ─── Auth API calls ──────────────────────────────────────────

/**
 * Login with email and password.
 * Stores session tokens and profile on success.
 *
 * @param {string} email
 * @param {string} password
 * @returns {{ user, session, profile, redirect }}
 */
async function login(email, password) {
  const { data } = await api.post('/login', { email, password });

  setTokens(data.session);
  setProfile(data.profile);

  return data;
}

/**
 * Validate the current session by checking the stored access token.
 * Returns the user profile and redirect path if valid.
 *
 * @returns {{ user, profile, redirect } | null}
 */
async function getMe() {
  const token = getToken();
  if (!token) return null;

  try {
    const { data } = await api.get('/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProfile(data.profile);
    return data;
  } catch {
    clearTokens();
    return null;
  }
}

/**
 * Log the user out — invalidates the session server-side and clears local storage.
 */
async function logout() {
  const token = getToken();

  if (token) {
    try {
      await api.post('/logout', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Ignore errors — we clear local state regardless
    }
  }

  clearTokens();
}

export default { login, logout, getMe, getToken, getProfile, clearTokens };