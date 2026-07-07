import assert from 'node:assert/strict';
import test from 'node:test';
import { getDownloadFilename } from '../downloadFilename.js';

test('reads standard and encoded backup filenames from response headers', () => {
  assert.equal(
    getDownloadFilename(
      { 'content-disposition': 'attachment; filename="prism-guard-db-backup-20260707-010203Z.sql.gz"' },
      'fallback.sql.gz',
    ),
    'prism-guard-db-backup-20260707-010203Z.sql.gz',
  );

  assert.equal(
    getDownloadFilename(
      { 'content-disposition': "attachment; filename*=UTF-8''prism-guard-db-backup.sql.gz" },
      'fallback.sql.gz',
    ),
    'prism-guard-db-backup.sql.gz',
  );
});

test('falls back when the backup filename header is absent', () => {
  assert.equal(getDownloadFilename({}, 'prism-guard-db-backup.sql.gz'), 'prism-guard-db-backup.sql.gz');
});
