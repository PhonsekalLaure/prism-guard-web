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

let inflightAuthPromise = null;
let cachedAuthData = null;
let cachedAuthToken = null;
let lastAuthFetchTime = 0;

function resetAuthCache() {
  inflightAuthPromise = null;
  cachedAuthData = null;
  cachedAuthToken = null;
  lastAuthFetchTime = 0;
}

function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_profile');
  resetAuthCache();
}

function setProfile(profile) {
  localStorage.setItem('user_profile', JSON.stringify(profile));
}

function getProfile() {
  const raw = localStorage.getItem('user_profile');
  return raw ? JSON.parse(raw) : null;
}

function isCloudinaryUrl(url) {
  try {
    return new URL(url).hostname.includes('res.cloudinary.com');
  } catch {
    return false;
  }
}

function isAbsoluteUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

async function openFileUrl(url) {
  if (!url) {
    throw new Error('No file URL provided');
  }

  const resolvedUrl = await getFileObjectUrl(url);
  window.open(resolvedUrl, '_blank', 'noopener,noreferrer');

  if (resolvedUrl !== url) {
    window.setTimeout(() => URL.revokeObjectURL(resolvedUrl), 60000);
  }
}

async function getFileObjectUrl(url) {
  if (!url) {
    throw new Error('No file URL provided');
  }

  const token = getToken();
  const headers = {};

  if (!isCloudinaryUrl(url) && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!isAbsoluteUrl(url)) {
    return url;
  }

  try {
    const { data } = await axios.get(url, {
      responseType: 'blob',
      headers,
    });

    return URL.createObjectURL(data);
  } catch (error) {
    if (isCloudinaryUrl(url)) {
      return url;
    }

    throw error;
  }
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
  cachedAuthData = data;
  cachedAuthToken = data.session.access_token;
  lastAuthFetchTime = Date.now();

  return data;
}

/**
 * Validate the current session by checking the stored access token.
 * Returns the user profile and redirect path if valid.
 * Caches the result for 10 seconds to prevent redundant checks on nested routes.
 *
 * @returns {{ user, profile, redirect } | null}
 */
async function getMe(forceRefresh = false) {
  const token = getToken();
  if (!token) return null;

  if (cachedAuthToken && cachedAuthToken !== token) {
    resetAuthCache();
  }

  if (!forceRefresh && cachedAuthData && cachedAuthToken === token && (Date.now() - lastAuthFetchTime < 10000)) {
    return cachedAuthData;
  }

  if (inflightAuthPromise) {
    return inflightAuthPromise;
  }

  inflightAuthPromise = (async () => {
    try {
      const { data } = await api.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(data.profile);
      cachedAuthData = data;
      cachedAuthToken = token;
      lastAuthFetchTime = Date.now();
      return data;
    } catch {
      clearTokens();
      return null;
    } finally {
      inflightAuthPromise = null;
    }
  })();

  return inflightAuthPromise;
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

export default { login, logout, getMe, getToken, getProfile, clearTokens, openFileUrl, getFileObjectUrl };
