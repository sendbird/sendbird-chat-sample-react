"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cursor_1 = require("../../../src/lib/cursor");
describe('[unit] cursor', () => {
    const data = [1, 2, 3, 4, 5];
    test('cursor init', done => {
        let index = 0;
        const cursor = new cursor_1.default({
            initialNextValue: data[index],
            forward: () => __awaiter(void 0, void 0, void 0, function* () {
                return data[index++] || null;
            }),
            backward: () => __awaiter(void 0, void 0, void 0, function* () {
                return data[--index - 1] || null;
            }),
            iterator: (cursor) => __awaiter(void 0, void 0, void 0, function* () {
            }),
            complete: () => { }
        });
        expect(cursor.error).toBeNull();
        expect(cursor.hasPrevious).toBeFalsy();
        expect(cursor.hasNext).toBeTruthy();
        expect(cursor.prevValue).toBeNull();
        expect(cursor.nextValue).toEqual(1);
        done();
    });
    test('cursor init > next()', done => {
        let index = 0;
        const cursor = new cursor_1.default({
            initialNextValue: data[index],
            forward: () => __awaiter(void 0, void 0, void 0, function* () {
                return data[++index] || null;
            }),
            backward: () => __awaiter(void 0, void 0, void 0, function* () {
                return data[--index - 1] || null;
            }),
            iterator: (cursor) => __awaiter(void 0, void 0, void 0, function* () {
                expect(cursor.error).toBeNull();
                expect(cursor.hasPrevious).toBeTruthy();
                expect(cursor.hasNext).toBeTruthy();
                expect(cursor.prevValue).toEqual(1);
                expect(cursor.nextValue).toEqual(2);
                done();
            }),
            complete: () => {
            }
        });
        cursor.next();
    });
    test('cursor init > next() > error', done => {
        let index = 0;
        const cursor = new cursor_1.default({
            initialNextValue: data[index],
            forward: () => __awaiter(void 0, void 0, void 0, function* () {
                throw 'Error';
            }),
            backward: () => __awaiter(void 0, void 0, void 0, function* () {
                return data[--index - 1] || null;
            }),
            iterator: (cursor) => __awaiter(void 0, void 0, void 0, function* () {
                expect(cursor.error).not.toBeNull();
                expect(cursor.hasPrevious).toBeFalsy();
                expect(cursor.hasNext).toBeTruthy();
                expect(cursor.prevValue).toBeNull();
                expect(cursor.nextValue).toEqual(1);
                done();
            }),
            complete: () => { }
        });
        cursor.next();
    });
    test('cursor init > next() to the end', done => {
        let index = 0;
        const cursor = new cursor_1.default({
            initialNextValue: data[index],
            forward: () => __awaiter(void 0, void 0, void 0, function* () {
                return data[++index] || null;
            }),
            backward: () => __awaiter(void 0, void 0, void 0, function* () {
                return data[--index - 1] || null;
            }),
            iterator: (cursor) => __awaiter(void 0, void 0, void 0, function* () {
                if (index < data.length) {
                    expect(cursor.error).toBeNull();
                    expect(cursor.hasPrevious).toBeTruthy();
                    expect(cursor.hasNext).toBeTruthy();
                    expect(cursor.prevValue).toEqual(data[index - 1]);
                    expect(cursor.nextValue).toEqual(data[index]);
                    cursor.next();
                }
                else {
                    expect(cursor.error).toBeNull();
                    expect(cursor.hasPrevious).toBeTruthy();
                    expect(cursor.hasNext).toBeFalsy();
                    expect(cursor.prevValue).toEqual(5);
                    expect(cursor.nextValue).toBeNull();
                    cursor.stop();
                }
            }),
            complete: () => {
                done();
            }
        });
        cursor.next();
    });
    test('cursor init > next() to the end > prev()', done => {
        let prevCalled = false;
        let index = 0;
        const cursor = new cursor_1.default({
            initialNextValue: data[index],
            forward: () => __awaiter(void 0, void 0, void 0, function* () {
                return data[++index] || null;
            }),
            backward: () => __awaiter(void 0, void 0, void 0, function* () {
                return data[--index - 1] || null;
            }),
            iterator: (cursor) => __awaiter(void 0, void 0, void 0, function* () {
                if (!prevCalled) {
                    if (index < data.length) {
                        cursor.next();
                    }
                    else {
                        prevCalled = true;
                        cursor.prev();
                    }
                }
                else {
                    expect(cursor.error).toBeNull();
                    expect(cursor.hasPrevious).toBeTruthy();
                    expect(cursor.hasNext).toBeTruthy();
                    expect(cursor.prevValue).toEqual(4);
                    expect(cursor.nextValue).toEqual(5);
                    cursor.stop();
                }
            }),
            complete: () => {
                done();
            }
        });
        cursor.next();
    });
    test('cursor init > next() to the end > prev() to the start', done => {
        let prevCalled = false;
        let index = 0;
        const cursor = new cursor_1.default({
            initialNextValue: data[index],
            forward: () => __awaiter(void 0, void 0, void 0, function* () {
                return data[++index] || null;
            }),
            backward: () => __awaiter(void 0, void 0, void 0, function* () {
                return data[--index - 1] || null;
            }),
            iterator: (cursor) => __awaiter(void 0, void 0, void 0, function* () {
                if (!prevCalled) {
                    if (index < data.length) {
                        cursor.next();
                    }
                    else {
                        prevCalled = true;
                        cursor.prev();
                    }
                }
                else {
                    if (index > 0) {
                        cursor.prev();
                    }
                    else {
                        expect(cursor.error).toBeNull();
                        expect(cursor.hasPrevious).toBeFalsy();
                        expect(cursor.hasNext).toBeTruthy();
                        expect(cursor.prevValue).toBeNull();
                        expect(cursor.nextValue).toEqual(1);
                        cursor.stop();
                    }
                }
            }),
            complete: () => {
                done();
            }
        });
        cursor.next();
    });
});
//# sourceMappingURL=cursor.test.js.map