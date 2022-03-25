"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Profiler {
    constructor(label) {
        this._started = 0;
        this.label = label;
    }
    start() {
        this._started = Date.now();
    }
    check(log) {
        const duration = Date.now() - this._started;
        console.log(`[${this.label}] ${log} (${duration}ms)`);
        this._started = Date.now();
    }
}
exports.default = Profiler;
//# sourceMappingURL=profiler.js.map