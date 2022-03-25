"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../src/util");
const randomstring = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
describe('[unit] util/sdbm', () => {
    test('sdbm()', done => {
        const hashLimit = 713;
        expect((0, util_1.sdbm)('abcdef', hashLimit)).toBe(237);
        expect((0, util_1.sdbm)('lkasjokj', hashLimit)).toBe(680);
        expect((0, util_1.sdbm)(')FJI0q3rijsedfg', hashLimit)).toBe(315);
        expect((0, util_1.sdbm)('유니코드테스트', hashLimit)).toBe(618);
        done();
    });
    test('sdbm() well-distributed', done => {
        const count = 1000;
        const length = 32;
        const hashLimit = 253;
        const s = new Set();
        for (let i = 0; i < count; i++) {
            const str = randomstring(length);
            const hashed = (0, util_1.sdbm)(str, hashLimit);
            s.add(hashed);
        }
        expect(s.size).toBeGreaterThan(hashLimit * 0.75);
        done();
    });
});
//# sourceMappingURL=sbdm.test.js.map