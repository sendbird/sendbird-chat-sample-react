"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../src/util");
describe('[unit] util/compare', () => {
    test('compare() equal', done => {
        expect((0, util_1.compare)(true, true)).toBe(0);
        expect((0, util_1.compare)(12, 12)).toBe(0);
        expect((0, util_1.compare)('abc', 'abc')).toBe(0);
        done();
    });
    test('compare() greater', done => {
        expect((0, util_1.compare)(true, false)).toBeGreaterThan(0);
        expect((0, util_1.compare)(12, 10)).toBeGreaterThan(0);
        expect((0, util_1.compare)('abc', 'aba')).toBeGreaterThan(0);
        done();
    });
    test('compare() less', done => {
        expect((0, util_1.compare)(false, true)).toBeLessThan(0);
        expect((0, util_1.compare)(10, 12)).toBeLessThan(0);
        expect((0, util_1.compare)('aba', 'abc')).toBeLessThan(0);
        done();
    });
});
//# sourceMappingURL=compare.test.js.map