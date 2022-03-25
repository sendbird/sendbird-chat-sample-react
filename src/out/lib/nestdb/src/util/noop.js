"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectUpgrade = exports.redirect = exports.noopAsync = exports.noop = void 0;
const noop = () => { };
exports.noop = noop;
const noopAsync = () => Promise.resolve();
exports.noopAsync = noopAsync;
const redirect = (value) => value;
exports.redirect = redirect;
const redirectUpgrade = (_, next) => { next(null); };
exports.redirectUpgrade = redirectUpgrade;
//# sourceMappingURL=noop.js.map