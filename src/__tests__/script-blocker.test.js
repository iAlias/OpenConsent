'use strict';

const { loadCmp } = require('./support/load-cmp');

describe('ScriptBlocker.detectCategory', () => {
  test.each([
    ['https://www.googletagmanager.com/gtag/js?id=G-1', 'analytics'],
    ["gtag('config', 'G-1')", 'analytics'],
    ['https://www.google-analytics.com/analytics.js', 'analytics'],
    ['https://static.hotjar.com/c/hotjar-1.js', 'analytics'],
    ['https://connect.facebook.net/en_US/fbevents.js', 'marketing'],
    ['https://analytics.tiktok.com/i18n/pixel/events.js', 'marketing'],
    ['https://doubleclick.net/pagead/id', 'marketing'],
    ['https://example.com/app.js', null],
    ['', null],
  ])('detects %s as %s', (source, expected) => {
    expect(loadCmp().scriptBlocker.detectCategory(source)).toBe(expected);
  });
});

describe('ScriptBlocker block/unblock', () => {
  let blocker;

  beforeEach(() => {
    const cmp = loadCmp();
    blocker = cmp.scriptBlocker;
    blocker.stopScriptObserver();
  });

  test('switches non-necessary scripts to type="text/plain" and keeps necessary ones', () => {
    document.body.innerHTML = [
      '<script data-category="analytics" type="text/javascript">window.tracked = 1</script>',
      '<script data-category="necessary" type="text/javascript">window.core = 1</script>',
    ].join('');

    blocker.blockedScripts = [];
    blocker.blockScripts();

    const scripts = document.querySelectorAll('script[data-category]');
    expect(scripts[0].getAttribute('type')).toBe('text/plain');
    expect(scripts[1].getAttribute('type')).not.toBe('text/plain');
  });

  test('restores a blocked script once its category is consented', () => {
    document.body.innerHTML =
      '<script data-category="analytics" type="text/javascript">window.tracked = 1</script>';

    blocker.blockedScripts = [];
    blocker.blockScripts();
    expect(document.querySelector('script[data-category]').getAttribute('type')).toBe('text/plain');

    blocker.unblockScripts({ necessary: true, analytics: true, marketing: false, preferences: false });

    expect(document.querySelector('script[data-category]').getAttribute('type')).toBe('text/javascript');
  });

  test('leaves a script blocked when its category is not consented', () => {
    document.body.innerHTML =
      '<script data-category="marketing" type="text/javascript">window.pixel = 1</script>';

    blocker.blockedScripts = [];
    blocker.blockScripts();
    blocker.unblockScripts({ necessary: true, analytics: false, marketing: false, preferences: false });

    expect(document.querySelector('script[data-category]').getAttribute('type')).toBe('text/plain');
  });
});
