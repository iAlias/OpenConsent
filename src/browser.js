/**
 * OpenConsent — browser entry point.
 *
 * When loaded with a `<script>` tag this file blocks trackers immediately,
 * exposes the singleton on `window.OpenConsent` (keeping `window.RSCMP` as a
 * backwards-compatible alias) and auto-initializes unless disabled.
 */
'use strict';

const { RSCMP } = require('./core.js');

if (typeof window !== 'undefined' && !window.OpenConsent) {
  const instance = new RSCMP();

  // Early script blocking: run immediately, before tagged scripts execute.
  instance.scriptBlocker.blockScripts();

  // Expose for manual control.
  window.OpenConsent = instance;
  window.RSCMP = instance; // previous global name, kept as an alias

  if (instance.shouldAutoInit()) {
    console.log('[OpenConsent] Auto-initializing...');
    instance.init().catch((err) => {
      console.error('[OpenConsent] Auto-initialization failed:', err);
    });
  } else {
    console.log('[OpenConsent] Manual init required. Call window.OpenConsent.init().');
  }
}
