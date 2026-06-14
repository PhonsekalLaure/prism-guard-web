import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getSafeDocumentUrl,
  getSafeInternalPath,
  getSafePortalPath,
  isAllowedDocumentFile,
  isSafePreviewMimeType,
  isSameOriginUrl,
} from './security.js';

const APP_ORIGIN = 'https://portal.example.com';

test('document URLs allow safe web and relative URLs', () => {
  assert.equal(getSafeDocumentUrl('/api/files/1', APP_ORIGIN), '/api/files/1');
  assert.equal(
    getSafeDocumentUrl('https://res.cloudinary.com/demo/file.pdf', APP_ORIGIN),
    'https://res.cloudinary.com/demo/file.pdf'
  );
  assert.equal(getSafeDocumentUrl('http://localhost:3000/file.pdf', APP_ORIGIN), 'http://localhost:3000/file.pdf');
});

test('document URLs reject script and insecure remote protocols', () => {
  assert.equal(getSafeDocumentUrl('javascript:alert(1)', APP_ORIGIN), null);
  assert.equal(getSafeDocumentUrl('data:text/html,<script>alert(1)</script>', APP_ORIGIN), null);
  assert.equal(getSafeDocumentUrl('http://attacker.example/file.pdf', APP_ORIGIN), null);
  assert.equal(
    getSafeDocumentUrl('https://attacker.example/file.pdf', APP_ORIGIN),
    'https://attacker.example/file.pdf'
  );
});

test('internal paths reject external and malformed redirects', () => {
  assert.equal(getSafeInternalPath('/dashboard?tab=1', '/login'), '/dashboard?tab=1');
  assert.equal(getSafeInternalPath('//attacker.example', '/login'), '/login');
  assert.equal(getSafeInternalPath('https://attacker.example', '/login'), '/login');
  assert.equal(getSafeInternalPath('/safe\\evil', '/login'), '/login');
});

test('portal paths cannot cross between HRIS and CMS', () => {
  assert.equal(getSafePortalPath('/cms/billing', 'cms'), '/cms/billing');
  assert.equal(getSafePortalPath('/billing', 'cms'), '/cms/notifications');
  assert.equal(getSafePortalPath('/billing', 'hris'), '/billing');
  assert.equal(getSafePortalPath('/cms/billing', 'hris'), '/notifications');
});

test('same-origin checks do not trust arbitrary HTTPS hosts', () => {
  assert.equal(isSameOriginUrl('/api/files/1', APP_ORIGIN), true);
  assert.equal(isSameOriginUrl('https://portal.example.com/api/files/1', APP_ORIGIN), true);
  assert.equal(isSameOriginUrl('https://attacker.example/file.pdf', APP_ORIGIN), false);
});

test('preview and upload checks reject active image formats', () => {
  assert.equal(isSafePreviewMimeType('application/pdf'), true);
  assert.equal(isSafePreviewMimeType('image/png'), true);
  assert.equal(isSafePreviewMimeType('image/svg+xml'), false);
  assert.equal(isSafePreviewMimeType('text/html'), false);

  assert.equal(isAllowedDocumentFile({ type: 'image/jpeg', name: 'photo.jpg' }), true);
  assert.equal(isAllowedDocumentFile({ type: 'application/pdf', name: 'contract.pdf' }), true);
  assert.equal(isAllowedDocumentFile({ type: 'image/svg+xml', name: 'payload.svg' }), false);
  assert.equal(isAllowedDocumentFile({ type: 'text/html', name: 'payload.html' }), false);
});
