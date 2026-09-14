'use strict';

const { loadCmp } = require('./support/load-cmp');

function captureGtag() {
  const calls = [];
  window.gtag = (...args) => calls.push(args);
  return calls;
}

function findConsentCall(calls) {
  return calls.find((call) => call[0] === 'consent');
}

describe('GoogleConsentMode', () => {
  afterEach(() => {
    delete window.gtag;
    delete window.dataLayer;
  });

  test('sets a denied-by-default consent mode on load', () => {
    const calls = captureGtag();
    loadCmp();

    const consentCall = findConsentCall(calls);
    expect(consentCall).toBeTruthy();
    expect(consentCall[1]).toBe('default');
    expect(consentCall[2]).toMatchObject({
      ad_storage: 'denied',
      analytics_storage: 'denied',
      security_storage: 'granted',
    });
  });

  test('grants only the categories the user consented to', () => {
    const calls = captureGtag();
    const cmp = loadCmp();

    cmp.googleConsentMode.update({
      necessary: true,
      analytics: true,
      marketing: false,
      preferences: true,
    });

    const consentCall = findConsentCall(calls.filter((c) => c[1] === 'update'));
    expect(consentCall).toBeTruthy();
    expect(consentCall[2]).toMatchObject({
      ad_storage: 'denied',
      ad_user_data: 'denied',
      analytics_storage: 'granted',
      functionality_storage: 'granted',
      personalization_storage: 'granted',
    });
  });
});
