import test from 'node:test';
import assert from 'node:assert/strict';
import { galleryQueryFlags, normalizeVersions, getUniqueVersions, getDefaultVersion } from '../src/extensionVersions.mjs';

const release = (version, prerelease, extra = {}) => ({
  version,
  lastUpdated: '2026-10-22T00:00:00Z',
  ...(prerelease === undefined ? {} : {
    properties: [{ key: 'Microsoft.VisualStudio.Code.PreRelease', value: String(prerelease) }]
  }),
  ...extra
});

test('keeps 2.1.308 as the latest stable version instead of discarding patches above 99', () => {
  const versions = normalizeVersions([release('2.1.99'), release('2.1.308')]);
  assert.deepEqual(versions.map(v => v.version), ['2.1.308', '2.1.99']);
  assert.equal(versions[0].isPrerelease, false);
  assert.equal(getDefaultVersion(versions), '2.1.308');
});

test('uses official metadata and retains prereleases alongside stable versions', () => {
  const versions = normalizeVersions([release('2.1.309', true), release('2.1.308', false)]);
  assert.deepEqual(getUniqueVersions(versions).map(v => [v.version, v.isPrerelease]), [
    ['2.1.309', true], ['2.1.308', false]
  ]);
  assert.equal(getDefaultVersion(versions), '2.1.308');
});

test('selects the latest prerelease when no stable versions exist', () => {
  assert.equal(getDefaultVersion(normalizeVersions([
    release('2.1.9', true), release('2.1.100', true)
  ])), '2.1.100');
});

test('does not infer release channels from large or date-like version numbers', () => {
  for (const version of ['2.1.308', '20261022.1.0', '1.2.3.4']) {
    assert.equal(normalizeVersions([release(version)])[0].isPrerelease, false);
  }
  assert.equal(normalizeVersions([release('2.1.308', false)])[0].isPrerelease, false);
  assert.equal(normalizeVersions([release('2.1.1', true)])[0].isPrerelease, true);
});

test('sorts versions numerically across major, minor and patch segments', () => {
  const versions = normalizeVersions(['2.9.9', '2.10.1', '3.0.0', '2.10.100'].map(v => release(v)));
  assert.deepEqual(versions.map(v => v.version), ['3.0.0', '2.10.100', '2.10.1', '2.9.9']);
});

test('deduplicates dropdown versions while preserving all platform packages and source data', () => {
  const source = [release('2.1.308', false, { targetPlatform: 'win32-x64' }),
    release('2.1.308', false, { targetPlatform: 'darwin-arm64' })];
  const original = structuredClone(source);
  const versions = normalizeVersions(source);
  assert.equal(versions.length, 2);
  assert.equal(getUniqueVersions(versions).length, 1);
  assert.deepEqual(source, original);
});

test('handles empty version lists', () => {
  assert.deepEqual(normalizeVersions(), []);
  assert.deepEqual(getUniqueVersions(), []);
  assert.equal(getDefaultVersion(), '');
});

test('requests all versions and the release-channel properties from Marketplace', () => {
  assert.ok(galleryQueryFlags & 1);
  assert.ok(galleryQueryFlags & 16);
  assert.equal(galleryQueryFlags & 512, 0);
});
