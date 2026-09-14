'use strict';

const { loadCmp } = require('./support/load-cmp');
const core = require('../core.js');

describe('library exports', () => {
  test('exposes the class, an alias and the factory', () => {
    expect(typeof core.createOpenConsent).toBe('function');
    expect(core.OpenConsent).toBe(core.RSCMP);

    const instance = core.createOpenConsent();
    expect(typeof instance.init).toBe('function');
    expect(typeof instance.getConsent).toBe('function');
    expect(typeof instance.getStatus).toBe('function');
  });

  test('module.exports matches the documented shape', () => {
    for (const key of [
      'OpenConsent',
      'RSCMP',
      'createOpenConsent',
      'ConsentStorage',
      'ConsentManager',
      'ScriptBlocker',
      'GoogleConsentMode',
      'BannerUI'
    ]) {
      expect(core[key]).toBeDefined();
    }
  });
});

describe('v2 storage migration (rs-cmp-consent -> openconsent)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = 'openconsent=; max-age=0; path=/';
    document.cookie = 'rs-cmp-consent=; max-age=0; path=/';
  });

  test('reads and migrates consent stored under the legacy key', () => {
    const legacy = JSON.stringify({
      categories: { necessary: true, analytics: true, marketing: false, preferences: false },
      timestamp: new Date().toISOString(),
      version: '1.0'
    });
    localStorage.setItem('rs-cmp-consent', legacy);

    const storage = loadCmp().consentStorage;

    expect(storage.getConsent().categories.analytics).toBe(true);
    expect(localStorage.getItem('rs-cmp-consent')).toBeNull();
    expect(localStorage.getItem('openconsent')).not.toBeNull();
  });

  test('does not migrate an expired legacy consent', () => {
    const expired = JSON.stringify({
      categories: { necessary: true, analytics: true, marketing: true, preferences: true },
      timestamp: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      version: '1.0'
    });
    localStorage.setItem('rs-cmp-consent', expired);

    const storage = loadCmp().consentStorage;

    expect(storage.getConsent()).toBeNull();
  });

  test('clearConsent removes both the new and the legacy keys', () => {
    localStorage.setItem('openconsent', '{"a":1}');
    localStorage.setItem('rs-cmp-consent', '{"a":1}');

    loadCmp().consentStorage.clearConsent();

    expect(localStorage.getItem('openconsent')).toBeNull();
    expect(localStorage.getItem('rs-cmp-consent')).toBeNull();
  });
});
