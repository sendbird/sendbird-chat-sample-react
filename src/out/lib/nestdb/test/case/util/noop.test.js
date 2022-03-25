"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noop_1 = require("../../../src/util/noop");
describe('[unit] util/noop', () => {
    test('redirect()', done => {
        expect((0, noop_1.redirect)(true)).toBe(true);
        expect((0, noop_1.redirect)(12)).toBe(12);
        expect((0, noop_1.redirect)('abc')).toBe('abc');
        done();
    });
});
//# sourceMappingURL=noop.test.js.map