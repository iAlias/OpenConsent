/**
 * OpenConsent — ESM entry point.
 * Re-exports the CommonJS core with proper named exports for bundlers.
 */
import core from './core.js';

export const OpenConsent = core.OpenConsent;
export const RSCMP = core.RSCMP;
export const createOpenConsent = core.createOpenConsent;
export const ConsentStorage = core.ConsentStorage;
export const ConsentManager = core.ConsentManager;
export const ScriptBlocker = core.ScriptBlocker;
export const GoogleConsentMode = core.GoogleConsentMode;
export const BannerUI = core.BannerUI;

export default core;
