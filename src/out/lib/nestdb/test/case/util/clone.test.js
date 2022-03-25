"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../../src/error");
const util_1 = require("../../../src/util");
describe('[unit] util/clone', () => {
    test('clone() primitive type', done => {
        expect((0, util_1.clone)(true)).toBe(true);
        expect((0, util_1.clone)(12)).toBe(12);
        expect((0, util_1.clone)('abc')).toBe('abc');
        expect((0, util_1.clone)(undefined)).toBe(undefined);
        expect((0, util_1.clone)(null)).toBe(null);
        done();
    });
    test('clone() array of primitive type', done => {
        const arr = [1, 2, 3];
        expect(arr).toBe(arr);
        expect((0, util_1.clone)(arr)).not.toBe(arr);
        expect((0, util_1.clone)(arr)).toStrictEqual(arr);
        done();
    });
    test('clone() array of object type', done => {
        const arr = [{ x: 1 }, { x: 2 }, { x: 3 }];
        expect(arr).toBe(arr);
        expect((0, util_1.clone)(arr)).not.toBe(arr);
        expect((0, util_1.clone)(arr)).toStrictEqual(arr);
        done();
    });
    test('clone() object type', done => {
        const obj = { x: 1, y: 2, z: 3 };
        expect(obj).toBe(obj);
        expect((0, util_1.clone)(obj)).not.toBe(obj);
        expect((0, util_1.clone)(obj)).toStrictEqual(obj);
        done();
    });
    test('clone() object type with same reference', done => {
        const obj1 = {};
        const obj2 = {};
        obj1['a'] = obj2;
        obj1['b'] = obj2;
        expect((0, util_1.clone)(obj1)).toStrictEqual(obj1);
        done();
    });
    test('clone() object type with circular reference', done => {
        const obj1 = {};
        const obj2 = {};
        obj1['a'] = obj2;
        obj2['a'] = obj1;
        try {
            (0, util_1.clone)(obj1);
        }
        catch (err) {
            expect(err.code).toBe(error_1.ErrorCode.CIRCULAR_REFERENCE_FOUND);
            done();
        }
    });
});
//# sourceMappingURL=clone.test.js.map