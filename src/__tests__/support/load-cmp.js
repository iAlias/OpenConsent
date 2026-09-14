'use strict';

/**
 * Load a fresh instance of the CMP SDK in a controlled jsdom environment.
 *
 * The SDK auto-initializes on load when a `script[data-site-id]` tag is
 * present. We inject one with `data-auto-init="false"` so tests exercise the
 * API explicitly instead of the asynchronous bootstrap.
 */
function loadCmp() {
  jest.resetModules();
  document.head.innerHTML = '<script data-site-id="test" data-auto-init="false"></script>';
  document.body.innerHTML = '';
  return require('../../cmp.js');
}

module.exports = { loadCmp };
