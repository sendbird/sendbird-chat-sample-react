"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReactNative = exports.isLegacyEdgeBrowser = exports.isInternetExplororBrowser = exports.isOperaBrowser = exports.isSafariBrowser = exports.isFirefoxBrowser = exports.isChromeBrowser = exports.isBrowser = void 0;
exports.isBrowser = typeof document !== 'undefined'
    && typeof navigator !== 'undefined';
exports.isChromeBrowser = exports.isBrowser
    && navigator.userAgent
    && navigator.userAgent.includes('Chrome/')
    && !navigator.userAgent.includes('Chromium/');
exports.isFirefoxBrowser = exports.isBrowser
    && navigator.userAgent
    && navigator.userAgent.includes('Firefox/')
    && !navigator.userAgent.includes('Seamonkey/');
exports.isSafariBrowser = exports.isBrowser
    && navigator.userAgent
    && navigator.userAgent.includes('Safari/')
    && !navigator.userAgent.includes('Chrome/')
    && !navigator.userAgent.includes('Chromium/');
exports.isOperaBrowser = exports.isBrowser
    && navigator.userAgent
    && (navigator.userAgent.includes('OPR/') || navigator.userAgent.includes('Opera/'));
exports.isInternetExplororBrowser = exports.isBrowser
    && navigator.userAgent
    && navigator.userAgent.includes('Trident/7.0');
exports.isLegacyEdgeBrowser = exports.isBrowser
    && navigator.userAgent
    && navigator.userAgent.includes('Edge/');
exports.isReactNative = typeof document === 'undefined'
    && typeof navigator !== 'undefined'
    && navigator.product == 'ReactNative';
//# sourceMappingURL=compat.js.map