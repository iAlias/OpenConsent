'use strict';

/**
 * Load a fresh OpenConsent instance in a controlled jsdom environment.
 *
 * `src/core.js` is a library with no side effects, so tests construct the
 * instance explicitly instead of relying on the browser auto-initialization
 * (which lives in `src/browser.js`).
 */
function loadCmp() {
  jest.resetModules();
  document.head.innerHTML = '<script data-site-id="test" data-auto-init="false"></script>';
  document.body.innerHTML = '';
  const { RSCMP } = require('../../core.js');
  return new RSCMP();
}

module.exports = { loadCmp };
