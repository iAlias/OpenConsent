'use strict';

const { loadCmp } = require('./support/load-cmp');

const ALL_ON = { necessary: true, analytics: true, marketing: true, preferences: true };
const ONLY_NECESSARY = { necessary: true, analytics: false, marketing: false, preferences: false };

describe('ConsentManager', () => {
  let manager;

  beforeEach(() => {
    localStorage.clear();
    document.cookie = 'rs-cmp-consent=; max-age=0; path=/';
    window.dataLayer = [];
    manager = loadCmp().consentManager;
  });

  test('acceptAll enables every category', () => {
    manager.acceptAll('v2');
    expect(manager.getConsent()).toEqual(ALL_ON);
  });

  test('rejectAll keeps only the necessary category', () => {
    manager.rejectAll('v2');
    expect(manager.getConsent()).toEqual(ONLY_NECESSARY);
  });

  test('hasConsent reflects the current state', () => {
    manager.rejectAll('v2');

    expect(manager.hasConsent('necessary')).toBe(true);
    expect(manager.hasConsent('analytics')).toBe(false);
    expect(manager.hasConsent('marketing')).toBe(false);
  });

  test('emits consentUpdated with the chosen categories', () => {
    const handler = jest.fn();
    manager.on('consentUpdated', handler);

    manager.acceptAll('v2');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0]).toMatchObject({ analytics: true, marketing: true });
  });

  test('pushes a cookie_consent_update event to the GTM dataLayer', () => {
    manager.acceptAll('v2');

    const lastPush = window.dataLayer[window.dataLayer.length - 1];
    expect(lastPush).toMatchObject({
      event: 'cookie_consent_update',
      cookie_consent_analytics: true,
      cookie_consent_marketing: true,
      cookie_consent_preferences: true,
      cookie_consent_necessary: true,
    });
  });
});
