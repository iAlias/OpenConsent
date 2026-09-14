# OpenConsent

> **A lightweight, dependency-free GDPR Consent Management Platform with native Google Consent Mode v2 support.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/openconsent.svg?style=flat)](https://www.npmjs.com/package/openconsent)
[![Size: 34 KB (9 KB gzip)](https://img.shields.io/badge/size-34%20KB%20(%E2%89%889%20KB%20gzip)-green.svg)]()
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()
[![Google Consent Mode v2](https://img.shields.io/badge/Google%20Consent%20Mode-v2-4285F4.svg)]()
[![GDPR Compliant](https://img.shields.io/badge/GDPR-compliant-success.svg)]()

The free, open-source alternative to Cookiebot, OneTrust and Iubenda: full control over your
consent management, no vendor lock-in, no monthly fees. One script tag, zero dependencies,
**no backend required**.

- 🔒 **GDPR first** — no cookies before consent, 12-month expiry, URL/CSS sanitization
- 🎯 **Google Consent Mode v2** — native, denied-by-default, zero configuration
- 🎭 **Script blocking** — hold tracking scripts until the user consents, hot-swap on change
- 🧩 **Works everywhere** — `<script>` tag, npm (ESM + CommonJS), any framework
- 🛡️ **CSP friendly** — nonce support
- 🔄 **SPA ready** — MutationObserver for dynamically added scripts
- 🌍 **Multi-language** — English and Italian included
- 📦 **TypeScript types** — shipped with the package

> Part of a small **web-compliance toolkit**: pair it with
> [AccessiScan](https://github.com/iAlias/AccessiScan) to audit accessibility
> (WCAG 2.1 / EN 301 549) on the same sites.

---

## Install

### Option A — Script tag (no build step)

```html
<script src="https://cdn.jsdelivr.net/npm/openconsent@2/dist/openconsent.min.js"></script>
<!-- pinned to a tag on GitHub instead of npm: -->
<script src="https://cdn.jsdelivr.net/gh/iAlias/openconsent@v2.0.0/dist/openconsent.min.js"></script>
```

That's enough for the zero-config banner. Place it as the **first script in `<head>`**,
immediately after `<title>`, so trackers are blocked before they execute.

### Option B — npm

```bash
npm install openconsent
```

```js
// ESM
import { createOpenConsent } from 'openconsent';

const cmp = createOpenConsent({
  config: {
    banner: {
      privacyPolicyUrl: 'https://yoursite.com/privacy-policy',
      cookiePolicyUrl: 'https://yoursite.com/cookie-policy'
    }
  }
});
```

```js
// CommonJS
const { createOpenConsent } = require('openconsent');
```

In the browser build the singleton is exposed as **`window.OpenConsent`**
(`window.RSCMP` is kept as a backwards-compatible alias).

---

## Quick start

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your Website</title>

  <!-- 1. Load OpenConsent (auto-initializes) -->
  <script src="https://cdn.jsdelivr.net/npm/openconsent@2/dist/openconsent.min.js"></script>
</head>
<body>
  <!-- 2. Category-tagged scripts stay blocked until consent is given -->
  <script type="text/plain" data-category="analytics">
    // Google Analytics (gtag.js), Plausible, Matomo, ...
  </script>

  <script type="text/plain" data-category="marketing">
    // Meta Pixel, Google Ads, TikTok Pixel, ...
  </script>
</body>
</html>
```

On the first visit OpenConsent shows the banner, blocks every `data-category` script, and wires
up Google Consent Mode v2 automatically. When the user chooses, scripts in the consented
categories are unblocked **without a page reload**.

---

## How script blocking works

Mark any script with `type="text/plain"` and a `data-category`:

| Category | Typical use |
| --- | --- |
| `necessary` | Essential functionality — always runs |
| `analytics` | Analytics and performance measurement |
| `marketing` | Advertising and remarketing |
| `preferences` | User preferences and settings |

```html
<!-- Blocked until "analytics" is granted -->
<script type="text/plain" data-category="analytics">/* ... */</script>

<!-- Never blocked -->
<script data-category="necessary">/* ... */</script>
```

OpenConsent also auto-detects and blocks common trackers (Google Analytics/gtag, Meta Pixel,
TikTok, Hotjar, Mixpanel, Amplitude, Clarity, DoubleClick and more), including scripts added
later by SPAs. Critical attributes (`type="module"`, `nonce`, `integrity`, `crossorigin`) are
preserved when a script is unblocked.

---

## Configuration

```js
window.OpenConsent.init({
  config: {
    policyVersion: '1.0',
    banner: {
      position: 'bottom',        // 'top' | 'bottom' | 'center'
      layout: 'bar',             // 'bar' | 'box' | 'modal'
      primaryColor: '#0084ff',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      buttonTextColor: '#ffffff',
      showLogo: false,
      logoUrl: 'https://yoursite.com/logo.svg',
      privacyPolicyUrl: 'https://yoursite.com/privacy-policy',
      cookiePolicyUrl: 'https://yoursite.com/cookie-policy'
    },
    categories: [
      { id: 'necessary',   name: 'Necessary',   required: true,  enabled: true },
      { id: 'analytics',   name: 'Analytics',   required: false, enabled: false },
      { id: 'marketing',   name: 'Marketing',   required: false, enabled: false },
      { id: 'preferences', name: 'Preferences', required: false, enabled: false }
    ],
    translations: {
      it: { title: 'Rispettiamo la tua privacy' /* ... */ },
      en: { title: 'We respect your privacy'    /* ... */ }
    }
  }
});
```

You can also configure it entirely through the script tag:

```html
<script
  src="https://cdn.jsdelivr.net/npm/openconsent@2/dist/openconsent.min.js"
  data-site-id="YOUR_SITE_ID"
  data-api-url="https://your-api.example.com"
  data-auto-init="true"></script>
```

`data-api-url` is **optional**. Without it, OpenConsent runs fully client-side and never makes
a network request.

---

## API reference

The singleton is available as `window.OpenConsent` in the browser, or created explicitly with
`createOpenConsent()` in a bundler.

| Method | Description |
| --- | --- |
| `init(options?)` | Initialize the CMP. Resolves when the config is loaded. |
| `getConsent()` | Current consent categories, or `null` if not chosen yet. |
| `applyConsent(categories)` | Apply categories programmatically (unblocks scripts, updates Consent Mode). |
| `showPreferences()` | Re-open the preferences panel. |
| `resetConsent()` | Clear consent and show the banner again. |
| `getStatus()` | Diagnostic snapshot: `{ initialized, siteId, consent, blockedScripts, bannerVisible }`. |
| `enableDebug()` / `disableDebug()` / `setDebugMode(bool)` | Toggle verbose logging. |
| `testConsentMode()` | Log the current Google Consent Mode state. |

### Events

```js
window.OpenConsent.consentManager.on('consentUpdated', (categories) => {
  console.log('Consent changed:', categories);
});
```

### Consent categories

```ts
interface ConsentCategories {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}
```

---

## Google Consent Mode v2

OpenConsent sets a **denied-by-default** state as early as possible and updates it when the user
chooses. No configuration required. The default denies `ad_storage`, `ad_user_data`,
`ad_personalization`, `analytics_storage`, `functionality_storage` and
`personalization_storage`, while granting `security_storage`.

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

---

## Framework examples

<details>
<summary><strong>React / Next.js (client-only)</strong></summary>

```jsx
'use client';
import { useEffect } from 'react';

export default function ConsentLoader() {
  useEffect(() => {
    import('openconsent').then(({ createOpenConsent }) => {
      createOpenConsent();
    });
  }, []);

  return null;
}
```

Then react to changes:

```js
window.OpenConsent.consentManager.on('consentUpdated', ({ analytics }) => {
  if (analytics) loadAnalytics();
});
```
</details>

<details>
<summary><strong>Google Tag Manager</strong></summary>

See [`examples/gtm-implementation.html`](examples/gtm-implementation.html) for a complete GTM
walkthrough, including how to trigger tags on consent changes and inspect Consent Mode state.
</details>

<details>
<summary><strong>Plain HTML</strong></summary>

Open [`examples/basic.html`](examples/basic.html) in a browser for a working demo with test
buttons and a live consent-status readout.
</details>

---

## Migrating from v1 (`rs-cmp`)

v2 renames the project to **OpenConsent** with no breaking change for existing embeds:

- `window.RSCMP` still works; `window.OpenConsent` is the new name.
- Consent stored under `rs-cmp-consent` is read and **migrated automatically** to
  `openconsent` (localStorage) and the cookie is renamed transparently.
- The old CDN path `dist/cmp.min.js` is still published for existing script tags.
- The old `init(config)` form still works; `init({ siteId, apiUrl, config })` is now supported.

---

## Optional: consent logging backend

The SDK needs **no backend**. If you want to store consent records, the
[`server-side/`](server-side/) folder contains ready-to-adapt loggers:

- `node-logger.js` — Node.js/Express + PostgreSQL example
- `php-logger.php` — PHP example

These examples have their own dependencies and are **not** installed with the package:

```bash
cd server-side && npm install
```

---

## Development

```bash
npm install     # install dev dependencies
npm run build   # build IIFE (dev + min), legacy, CommonJS and ESM bundles
npm test        # run the Jest suite
npm run lint    # ESLint
```

Source layout:

| File | Purpose |
| --- | --- |
| `src/core.js` | The library: all classes plus `createOpenConsent()`, no side effects |
| `src/browser.js` | Browser entry: script blocking, `window.OpenConsent`, auto-init |
| `src/index.mjs` | ESM entry re-exporting the core |

The committed `dist/openconsent.min.js` (and `dist/cmp.min.js`) are the published bundles; CI
fails if they drift from the source.

---

## Security & compliance

- No cookies are set before consent.
- Consent is stored in `localStorage`, with a minimal first-party presence cookie.
- URLs and CSS color values are sanitized before being written to the DOM.
- Optional backend logging hashes IP addresses (SHA-256) before storage.
- Consent expires after 12 months and is re-requested.

---

## License

[MIT](LICENSE) © Antonino Di Stefano
