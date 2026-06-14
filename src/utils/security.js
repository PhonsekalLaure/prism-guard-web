const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]']);

const SAFE_PREVIEW_MIME_TYPES = new Set([
  'application/octet-stream',
  'application/pdf',
  'image/avif',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const SAFE_DOCUMENT_MIME_TYPES = new Set([
  'application/pdf',
  'image/avif',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const SAFE_DOCUMENT_EXTENSIONS = /\.(?:avif|bmp|gif|jpe?g|pdf|png|webp)$/i;

function getBaseOrigin(baseOrigin) {
  if (baseOrigin) return baseOrigin;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'http://localhost';
}

function hasUnsafeUrlCharacters(value) {
  if (value.includes('\\')) return true;
  return [...value].some((character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127;
  });
}

export function getSafeDocumentUrl(value, baseOrigin) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || hasUnsafeUrlCharacters(trimmed)) return null;

  const origin = getBaseOrigin(baseOrigin);

  try {
    const parsed = new URL(trimmed, origin);
    const isSameOrigin = parsed.origin === new URL(origin).origin;
    const isLocalHttp = parsed.protocol === 'http:' && LOCAL_HOSTNAMES.has(parsed.hostname);

    if (parsed.protocol !== 'https:' && !isSameOrigin && !isLocalHttp) {
      return null;
    }

    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }

    return parsed.href;
  } catch {
    return null;
  }
}

export function getSafeInternalPath(value, fallback = '/') {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();

  if (
    !trimmed.startsWith('/')
    || trimmed.startsWith('//')
    || hasUnsafeUrlCharacters(trimmed)
  ) {
    return fallback;
  }

  try {
    const parsed = new URL(trimmed, 'https://app.invalid');
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function getSafePortalPath(value, portal, fallback) {
  const safeFallback = fallback || (portal === 'cms' ? '/cms/notifications' : '/notifications');
  const path = getSafeInternalPath(value, safeFallback);

  if (portal === 'cms') {
    return path.startsWith('/cms/') ? path : safeFallback;
  }

  return path.startsWith('/cms/') ? safeFallback : path;
}

export function isSameOriginUrl(value, origin) {
  const safeUrl = getSafeDocumentUrl(value, origin);
  if (!safeUrl) return false;

  try {
    return new URL(safeUrl, getBaseOrigin(origin)).origin === new URL(getBaseOrigin(origin)).origin;
  } catch {
    return false;
  }
}

export function isSafePreviewMimeType(mimeType) {
  return SAFE_PREVIEW_MIME_TYPES.has(String(mimeType || '').toLowerCase());
}

export function isAllowedDocumentFile(file) {
  if (!file) return false;
  const mimeType = String(file.type || '').toLowerCase();
  return SAFE_DOCUMENT_MIME_TYPES.has(mimeType)
    || (!mimeType && SAFE_DOCUMENT_EXTENSIONS.test(String(file.name || '')));
}
