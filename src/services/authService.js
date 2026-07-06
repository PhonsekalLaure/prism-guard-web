import axios from 'axios';
import supabase from '@services/supabaseBrowserClient';
import { buildApiUrl, getApiBaseUrl } from '@services/apiConfig';
import {
  getSafeDocumentUrl,
  isSafePreviewMimeType,
  isSameOriginUrl,
} from '@utils/security';

const api = axios.create({
  baseURL: buildApiUrl('/api/web/auth'),
  headers: { 'Content-Type': 'application/json' },
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
let inflightRefreshSessionPromise = null;
let cachedAuthData = null;
let cachedAuthToken = null;
let lastAuthFetchTime = 0;

function resetAuthCache() {
  inflightAuthPromise = null;
  inflightRefreshSessionPromise = null;
  cachedAuthData = null;
  cachedAuthToken = null;
  lastAuthFetchTime = 0;
}

function clearTokens() {
  removeStoredAuthState();
  resetAuthCache();
}

function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
}

function isTokenExpiringSoon(token, skewSeconds = 60) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now() + (skewSeconds * 1000);
}

function setProfile(profile) {
  if (!profile || typeof profile !== 'object') {
    localStorage.removeItem('user_profile');
    sessionStorage.removeItem('user_profile');
    return;
  }

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

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem('user_profile');
    sessionStorage.removeItem('user_profile');
    return null;
  }
}

function isCloudinaryUrl(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return hostname === 'cloudinary.com' || hostname.endsWith('.cloudinary.com');
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

  const safeUrl = getSafeDocumentUrl(url);
  if (!safeUrl) {
    throw new Error('The file URL is not allowed.');
  }

  const requestUrl = safeUrl.startsWith('/') ? buildApiUrl(safeUrl) : safeUrl;
  if (isCloudinaryUrl(requestUrl)) {
    return requestUrl;
  }

  const apiOrigin = new URL(getApiBaseUrl()).origin;
  if (!isSameOriginUrl(requestUrl, apiOrigin)) {
    return requestUrl;
  }

  const token = getToken();
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const { data } = await axios.get(requestUrl, {
    responseType: 'blob',
    headers,
  });

  if (!isSafePreviewMimeType(data?.type)) {
    throw new Error('This file type cannot be previewed safely.');
  }

  return URL.createObjectURL(data);
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

async function updatePassword({
  password,
  confirmPassword,
  clearMustChangePassword = false,
  acceptedPolicies = [],
  accessToken,
}) {
  const token = accessToken || getToken();

  if (!token) {
    throw new Error('Your password session is invalid or expired.');
  }

  const { data } = await api.post(
    '/update-password',
    {
      password,
      confirmPassword,
      clearMustChangePassword,
      acceptedPolicies,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return data;
}

async function refreshStoredSession() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  if (inflightRefreshSessionPromise) {
    return inflightRefreshSessionPromise;
  }

  inflightRefreshSessionPromise = (async () => {
    const rememberMe = getRememberPreference();
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      return null;
    }

    setTokens(data.session, rememberMe);
    return data.session.access_token;
  })();

  try {
    return await inflightRefreshSessionPromise;
  } finally {
    inflightRefreshSessionPromise = null;
  }
}

async function getValidToken() {
  const token = getToken();
  if (!token) return null;
  if (!isTokenExpiringSoon(token)) return token;
  return await refreshStoredSession() || token;
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
      await api.post('/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Ignore errors — we clear local state regardless
    }
  }

  clearTokens();
}

export default { login, logout, forgotPassword, updatePassword, getMe, getToken, getValidToken, refreshStoredSession, getProfile, updateProfile, clearTokens, openFileUrl, getFileObjectUrl };
