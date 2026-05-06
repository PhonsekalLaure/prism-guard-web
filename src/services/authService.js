import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const api = axios.create({
  baseURL: `${API_BASE}/api/web/auth`,
  headers: { 'Content-Type': 'application/json' },
});

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

const AUTH_STORAGE_KEYS = ['access_token', 'refresh_token', 'user_profile'];

// ─── Storage helpers ──────────────────────────────────────────
// If the access_token is in localStorage the user checked "Remember Me".
// Otherwise it lives in sessionStorage (cleared when the tab closes).

function getActiveStorage() {
  return localStorage.getItem('access_token') ? localStorage : sessionStorage;
}

// ─── Token helpers ────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
}

function getRefreshToken() {
  return localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
}

function getRememberPreference() {
  return Boolean(localStorage.getItem('access_token') || localStorage.getItem('refresh_token'));
}

function removeStoredAuthState() {
  AUTH_STORAGE_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

function setTokens(session, rememberMe = false) {
  const storage = rememberMe ? localStorage : sessionStorage;
  removeStoredAuthState();
  storage.setItem('access_token', session.access_token);
  storage.setItem('refresh_token', session.refresh_token);
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
  removeStoredAuthState();
  resetAuthCache();
}

function setProfile(profile) {
  getActiveStorage().setItem('user_profile', JSON.stringify(profile));
}

function updateProfile(profileUpdates) {
  const currentProfile = getProfile() || {};
  const nextProfile = { ...currentProfile, ...profileUpdates };
  setProfile(nextProfile);

  if (cachedAuthData?.profile) {
    cachedAuthData = {
      ...cachedAuthData,
      profile: {
        ...cachedAuthData.profile,
        ...profileUpdates,
      },
    };
  }

  return nextProfile;
}

function getProfile() {
  const raw = localStorage.getItem('user_profile') || sessionStorage.getItem('user_profile');
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
async function login(email, password, rememberMe = false) {
  const { data } = await api.post('/login', { email, password });

  setTokens(data.session, rememberMe);
  setProfile(data.profile);
  cachedAuthData = data;
  cachedAuthToken = data.session.access_token;
  lastAuthFetchTime = Date.now();

  return data;
}

/**
 * Send a password-reset email for the given address.
 * Always resolves — the backend never reveals whether the email is registered.
 *
 * @param {string} email
 */
async function forgotPassword(email) {
  await api.post('/forgot-password', { email });
}

async function refreshStoredSession() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const rememberMe = getRememberPreference();
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.session) {
    return null;
  }

  setTokens(data.session, rememberMe);
  return data.session.access_token;
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
    } catch (error) {
      if (error.response?.status === 401) {
        const refreshedToken = await refreshStoredSession();

        if (refreshedToken) {
          try {
            const { data } = await api.get('/me', {
              headers: { Authorization: `Bearer ${refreshedToken}` },
            });
            setProfile(data.profile);
            cachedAuthData = data;
            cachedAuthToken = refreshedToken;
            lastAuthFetchTime = Date.now();
            return data;
          } catch {
            // Fall through to clear stale state below.
          }
        }
      }

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

export default { login, logout, forgotPassword, getMe, getToken, getProfile, updateProfile, clearTokens, openFileUrl, getFileObjectUrl };
