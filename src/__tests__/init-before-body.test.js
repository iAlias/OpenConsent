'use strict';

const { loadCmp } = require('./support/load-cmp');

describe('init() when document.body is not yet available', () => {
  // The README's recommended setup loads the script as the first thing in
  // <head>, before <body> is parsed. Regression test for a bug where init()
  // threw "Cannot read properties of null (reading 'appendChild')" in that
  // case, so the banner never rendered for a real first-time visitor.
  test('waits for DOMContentLoaded instead of throwing, then renders the banner', async () => {
    const cmp = loadCmp();
    const realBody = document.body;

    Object.defineProperty(document, 'body', { configurable: true, get: () => null });

    const initPromise = cmp.init();

    Object.defineProperty(document, 'body', { configurable: true, get: () => realBody });
    document.dispatchEvent(new Event('DOMContentLoaded'));

    await initPromise;

    expect(document.getElementById('rs-cmp-banner')).not.toBeNull();
  });
});
