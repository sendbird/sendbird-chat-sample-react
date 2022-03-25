"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OnlineDetector {
    constructor({ logger, connectionDelegate, }) {
        this.logger = logger;
        this.connectionDelegate = connectionDelegate;
    }
    get isAvailable() {
        return typeof window !== 'undefined' &&
            window.addEventListener &&
            'ononline' in window &&
            'onoffline' in window &&
            typeof navigator !== 'undefined' &&
            typeof navigator.onLine !== 'undefined';
    }
    onlineWorker() {
        try {
            if (this.isAvailable) {
                this.connectionDelegate.reconnect();
            }
        }
        catch (e) {
            this.logger.log('`window.addEventListener.ononline` or `navigator.onLine` not found.');
        }
    }
    offlineWorker() {
        try {
            if (this.isAvailable) {
                this.connectionDelegate.disconnect();
            }
        }
        catch (e) {
            this.logger.log('`window.addEventListener.ononline` or `navigator.onLine` not found.');
        }
    }
    start() {
        try {
            if (this.isAvailable) {
                window.addEventListener('online', this.onlineWorker);
                window.addEventListener('offline', this.offlineWorker);
            }
        }
        catch (e) {
            this.logger.log('`window.addEventListener.ononline` or `navigator.onLine` not found.');
        }
    }
    stop() {
        try {
            if (this.isAvailable) {
                window.removeEventListener('online', this.onlineWorker, false);
                window.removeEventListener('offline', this.offlineWorker, false);
            }
        }
        catch (e) {
            this.logger.log('`window.addEventListener.ononline` or `navigator.onLine` not found.');
        }
    }
}
exports.default = OnlineDetector;
//# sourceMappingURL=onlineDetector.js.map