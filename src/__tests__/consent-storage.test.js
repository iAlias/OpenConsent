'use strict';

const { loadCmp } = require('./support/load-cmp');

const STORAGE_KEY = 'openconsent';

function clearCookies() {
  document.cookie = 'openconsent=; max-age=0; path=/';
  document.cookie = 'rs-cmp-consent=; max-age=0; path=/';
}

describe('ConsentStorage', () => {
  let storage;

  beforeEach(() => {
    localStorage.clear();
    clearCookies();
    storage = loadCmp().consentStorage;
  });

  test('returns null when nothing was stored', () => {
    expect(storage.getConsent()).toBeNull();
  });

  test('saves consent and reads back categories, timestamp and version', () => {
    const data = {
      categories: { necessary: true, analytics: true, marketing: false, preferences: true },
      timestamp: new Date().toISOString(),
      version: '1.0',
    };

    storage.saveConsent(data);
    const stored = storage.getConsent();

    expect(stored.categories).toEqual(data.categories);
    expect(stored.version).toBe('1.0');
    expect(typeof stored.timestamp).toBe('string');
  });

  test('writes a minimal consent cookie (just "1")', () => {
    storage.saveConsent({
      categories: { necessary: true, analytics: false, marketing: false, preferences: false },
      timestamp: new Date().toISOString(),
      version: '1.0',
    });

    expect(document.cookie).toContain('openconsent=1');
  });

  test('clearConsent wipes both localStorage and the cookie', () => {
    storage.saveConsent({
      categories: { necessary: true, analytics: true, marketing: true, preferences: true },
      timestamp: new Date().toISOString(),
      version: '1.0',
    });

    storage.clearConsent();

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(storage.getConsent()).toBeNull();
    expect(document.cookie).not.toContain('openconsent=1');
  });

  test('treats consent older than 12 months as expired', () => {
    const oldTimestamp = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        categories: { necessary: true, analytics: true, marketing: true, preferences: true },
        timestamp: oldTimestamp,
        version: '1.0',
      })
    );

    expect(storage.getConsent()).toBeNull();
  });
});
