"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NESTDB_LOG_PREFIX = '[NESTDB]';
let _enabled = true;
class Logger {
    static off() {
        _enabled = false;
    }
    static log(...args) {
        if (_enabled)
            console.log(`${NESTDB_LOG_PREFIX}[LOG]`, ...args);
    }
    static warning(...args) {
        if (_enabled)
            console.warn(`${NESTDB_LOG_PREFIX}[WARNING]`, ...args);
    }
    static error(...args) {
        if (_enabled)
            console.error(`${NESTDB_LOG_PREFIX}[ERROR]`, ...args);
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map