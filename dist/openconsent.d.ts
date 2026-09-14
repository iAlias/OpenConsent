/**
 * OpenConsent — GDPR Consent Management Platform with Google Consent Mode v2.
 *
 * Two ways to use it:
 * - Browser: load `dist/openconsent.min.js` and use the `window.OpenConsent`
 *   singleton (also exposed as `window.RSCMP` for backwards compatibility).
 * - Bundlers: `import { createOpenConsent } from 'openconsent'`.
 */

export interface ConsentCategories {
  /** Essential cookies required for the site. Always true. */
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export interface ConsentData {
  categories: ConsentCategories;
  /** ISO 8601 timestamp of when consent was given. */
  timestamp: string;
  /** Policy version associated with the consent. */
  version: string;
}

export type BannerPosition = 'top' | 'bottom' | 'center';
export type BannerLayout = 'bar' | 'box' | 'modal';

export interface BannerConfig {
  position?: BannerPosition;
  layout?: BannerLayout;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonTextColor?: string;
  showLogo?: boolean;
  logoUrl?: string;
  privacyPolicyUrl?: string;
  cookiePolicyUrl?: string;
}

export interface CategoryConfig {
  id: string;
  name: string;
  description?: string;
  /** When true the category cannot be disabled by the user. */
  required?: boolean;
  /** Default state before the user makes a choice. */
  enabled?: boolean;
}

export interface CategoryTranslation {
  name: string;
  description: string;
}

export interface Translations {
  title: string;
  description: string;
  acceptAll: string;
  rejectAll: string;
  customize: string;
  customizeTitle: string;
  customizeSubtitle: string;
  save: string;
  close: string;
  privacyPolicy: string;
  cookiePolicy: string;
  customizeIntro: string;
  customizeDescription: string;
  viewCookiePolicy: string;
  categories: Record<string, CategoryTranslation>;
}

export interface Config {
  siteId?: string;
  siteName?: string;
  domain?: string;
  policyVersion?: string;
  banner?: BannerConfig;
  categories?: CategoryConfig[];
  translations?: Record<string, Partial<Translations>>;
}

export interface InitOptions {
  /** Site identifier (can also be set via `data-site-id` on the script tag). */
  siteId?: string;
  /** Optional consent-logging backend. When omitted, the CMP is fully client-side. */
  apiUrl?: string;
  /** Inline configuration, merged over the defaults. */
  config?: Config;
}

export interface RSCMPStatus {
  initialized: boolean;
  siteId: string | null;
  consent: ConsentCategories | null;
  blockedScripts: number;
  bannerVisible: boolean;
}

export interface ConsentManager {
  setConsent(categories: ConsentCategories, version: string): void;
  getConsent(): ConsentCategories | null;
  acceptAll(version: string): void;
  rejectAll(version: string): void;
  hasConsent(category: keyof ConsentCategories): boolean;
  on(event: string, handler: (data: unknown) => void): void;
  emit(event: string, data: unknown): void;
}

export interface ConsentStorage {
  saveConsent(consent: ConsentData): void;
  getConsent(): ConsentData | null;
  clearConsent(): void;
}

export interface ScriptBlocker {
  detectCategory(srcOrCode: string): string | null;
  blockScripts(): void;
  unblockScripts(categories: ConsentCategories): void;
  getBlockedScriptsByCategory(categoryId: string): HTMLScriptElement[];
}

export interface GoogleConsentMode {
  initializeDefaultConsent(): void;
  update(categories: ConsentCategories): void;
}

export interface RSCMPInstance {
  /** Initialize the CMP. Resolves once the config is loaded. */
  init(options?: InitOptions | Config | null): Promise<void>;
  /** Current consent, or null if the user has not chosen yet. */
  getConsent(): ConsentCategories | null;
  /** Re-open the preferences panel. */
  showPreferences(): void;
  /** Clear consent and show the banner again. */
  resetConsent(): void;
  /** Apply categories programmatically (unblocks scripts, updates Consent Mode). */
  applyConsent(categories: ConsentCategories, shouldReload?: boolean): void;
  enableDebug(): void;
  disableDebug(): void;
  setDebugMode(enabled: boolean): void;
  /** Diagnostic snapshot of the current state. */
  getStatus(): RSCMPStatus;
  testConsentMode(): void;

  consentManager: ConsentManager;
  consentStorage: ConsentStorage;
  scriptBlocker: ScriptBlocker;
  googleConsentMode: GoogleConsentMode;
}

export interface RSCMPConstructor {
  new (): RSCMPInstance;
}

export declare const RSCMP: RSCMPConstructor;
/** Alias of `RSCMP`, the preferred name. */
export declare const OpenConsent: RSCMPConstructor;
export declare const ConsentStorage: new () => ConsentStorage;
export declare const ConsentManager: new (storage: ConsentStorage) => ConsentManager;
export declare const ScriptBlocker: new (manager: ConsentManager) => ScriptBlocker;
export declare const GoogleConsentMode: new (manager: ConsentManager) => GoogleConsentMode;

/** Create an instance. Pass options to initialize immediately. */
export declare function createOpenConsent(
  options?: InitOptions | Config | null
): RSCMPInstance;

declare const _default: {
  OpenConsent: RSCMPConstructor;
  RSCMP: RSCMPConstructor;
  createOpenConsent: typeof createOpenConsent;
  ConsentStorage: new () => ConsentStorage;
  ConsentManager: new (storage: ConsentStorage) => ConsentManager;
  ScriptBlocker: new (manager: ConsentManager) => ScriptBlocker;
  GoogleConsentMode: new (manager: ConsentManager) => GoogleConsentMode;
};

export default _default;

declare global {
  interface Window {
    /** The singleton in the browser build. */
    OpenConsent: RSCMPInstance;
    /** Backwards-compatible alias of `window.OpenConsent`. */
    RSCMP: RSCMPInstance;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
