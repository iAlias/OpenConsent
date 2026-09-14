# OpenConsent

> **A lightweight, dependency-free GDPR Consent Management Platform with native Google Consent Mode v2 support.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/openconsent.svg?style=flat)](https://www.npmjs.com/package/openconsent)
[![Size: 34 KB (9 KB gzip)](https://img.shields.io/badge/size-34%20KB%20(%E2%89%889%20KB%20gzip)-green.svg)]()
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()
[![Google Consent Mode v2](https://img.shields.io/badge/Google%20Consent%20Mode-v2-4285F4.svg)]()
[![GDPR Compliant](https://img.shields.io/badge/GDPR-compliant-success.svg)]()

The free, open-source alternative to Cookiebot, OneTrust and Iubenda: full control over your
consent management, no vendor lock-in, no monthly fees. One script tag, zero dependencies.

- 🔒 **GDPR first** — no cookies before consent, IP hashing on the optional backend
- 🎯 **Google Consent Mode v2** — native integration, zero configuration
- 🎭 **Script blocking** — hold tracking scripts until the user consents
- 🧩 **Framework agnostic** — plain JavaScript, works with any stack
- 🛡️ **CSP friendly** — nonce support, HTML/URL/CSS sanitization
- 🔄 **SPA ready** — MutationObserver for dynamically added scripts
- 🌍 **Multi-language** — English and Italian included
- 📦 **Batteries included** — optional consent-logging examples for Node.js and PHP

---

## Install

### Option A — CDN (no build step)

```html
<!-- jsDelivr (npm) -->
<script src="https://cdn.jsdelivr.net/npm/openconsent@1/dist/cmp.min.js"></script>

<!-- jsDelivr (GitHub, pinned tag) -->
<script src="https://cdn.jsdelivr.net/gh/iAlias/openconsent@v1.0.0/dist/cmp.min.js"></script>
```

Place it as the **first script in `<head>`**, immediately after `<title>`, so tracking scripts
are blocked before they execute.

### Option B — npm

```bash
npm install openconsent
```

```js
// Import for side effects: it registers `window.RSCMP`.
import 'openconsent';

window.RSCMP.init().then(() => console.log('CMP ready'));
```

> The bundle is a browser IIFE and touches `window`/`document`. In SSR frameworks
> (Next.js, Nuxt, SvelteKit) import it **client-side only** (`useEffect`, `<ClientOnly>`,
> or a dynamic `import()`).

---

## Quick start

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your Website</title>

  <!-- 1. Load OpenConsent -->
  <script src="https://cdn.jsdelivr.net/npm/openconsent@1/dist/cmp.min.js"></script>
  <script>
    window.RSCMP.init({
      config: {
        banner: {
          // Required for GDPR Art. 13 compliance
          privacyPolicyUrl: 'https://yoursite.com/privacy-policy',
          cookiePolicyUrl: 'https://yoursite.com/cookie-policy'
        }
      }
    });
  </script>
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

That's it. On the first visit OpenConsent shows the banner, blocks every `data-category`
script, and wires up Google Consent Mode v2 automatically. When the user chooses, scripts in
the consented categories are unblocked **without a page reload**.

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
window.RSCMP.init({
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
  src="https://cdn.jsdelivr.net/npm/openconsent@1/dist/cmp.min.js"
  data-site-id="YOUR_SITE_ID"
  data-api-url="https://your-api.example.com"
  data-auto-init="true"></script>
```

---

## API reference

The singleton is available as `window.RSCMP`.

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
window.RSCMP.consentManager.on('consentUpdated', (categories) => {
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

OpenConsent sets a **denied-by-default** consent state as early as possible and updates it when
the user chooses. No configuration required. The default state denies `ad_storage`,
`ad_user_data`, `ad_personalization`, `analytics_storage`, `functionality_storage` and
`personalization_storage`, while granting `security_storage`.

```html
<!-- Put your gtag bootstrap before or after OpenConsent — both orderings work -->
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
    let cancelled = false;
    import('openconsent').then(() => {
      if (!cancelled) window.RSCMP.init();
    });
    return () => { cancelled = true; };
  }, []);

  return null;
}
```

Tag scripts in your layout with `type="text/plain"` and `data-category` as in the vanilla
example. To run code on consent changes:

```js
window.RSCMP.consentManager.on('consentUpdated', ({ analytics }) => {
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

## Optional: consent logging backend

The SDK is fully client-side and needs **no backend**. If you want to store consent records,
the [`server-side/`](server-side/) folder contains ready-to-adapt loggers:

- `node-logger.js` — Node.js/Express + PostgreSQL example
- `php-logger.php` — PHP example

These examples have their own dependencies and are **not** installed with the package:

```bash
cd server-side && npm install
```

---

## Development

```bash
npm install        # install dev dependencies
npm run build      # build dist/cmp.js (dev) and dist/cmp.min.js (production)
npm test           # run the Jest suite
npm run lint       # ESLint
```

Source lives in a single file, [`src/cmp.js`](src/cmp.js). The committed
`dist/cmp.min.js` is the published bundle; CI fails if it drifts from the source.

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
