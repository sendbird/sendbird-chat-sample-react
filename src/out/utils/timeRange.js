"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimeRange {
    constructor({ top = Number.MAX_SAFE_INTEGER, bottom = 0, }) {
        this.top = top;
        this.bottom = bottom;
    }
    includes(...tss) {
        return tss.every((ts) => this.top <= ts && ts <= this.bottom);
    }
    overlap(range) {
        return this.includes(range.top) || this.includes(range.bottom);
    }
    extends(...ts) {
        this.top = Math.min(this.top, ...ts);
        this.bottom = Math.max(this.bottom, ...ts);
    }
}
exports.default = TimeRange;
//# sourceMappingURL=timeRange.js.map