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
const util_1 = require("../../../src/util");
const mutex_1 = require("../../../src/util/mutex");
describe('[unit] util/mutex', () => {
    test('single mutex lock() > unlock()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const mutex = new mutex_1.default('testkey');
        yield mutex.lock();
        expect(mutex.locked).toBeTruthy();
        mutex.unlock();
        expect(mutex.locked).toBeFalsy();
        done();
    }));
    test('single mutex lock() > unlock() x3 simultaneous', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const mutex = new mutex_1.default('testkey');
        const called = [];
        setTimeout(() => {
            mutex.lock()
                .then(() => {
                called.push(3);
                expect(mutex.locked).toBeTruthy();
                mutex.unlock();
                expect(mutex.locked).toBeFalsy();
                expect(called).toStrictEqual([1, 2, 3]);
                done();
            });
        }, 50);
        setTimeout(() => {
            mutex.lock()
                .then(() => {
                called.push(2);
                expect(mutex.locked).toBeTruthy();
                mutex.unlock();
            });
        }, 30);
        yield mutex.lock();
        yield (0, util_1.sleep)(50);
        called.push(1);
        mutex.unlock();
    }));
    test('single mutex lock() > unlock() x3 not simultaneous', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const mutex = new mutex_1.default('testkey');
        const called = [];
        setTimeout(() => {
            mutex.lock()
                .then(() => {
                called.push(3);
                expect(mutex.locked).toBeTruthy();
                mutex.unlock();
                expect(mutex.locked).toBeFalsy();
                expect(called).toStrictEqual([1, 2, 3]);
                done();
            });
        }, 50);
        setTimeout(() => {
            mutex.lock()
                .then(() => {
                called.push(2);
                expect(mutex.locked).toBeTruthy();
                mutex.unlock();
            });
        }, 30);
        yield mutex.lock();
        yield (0, util_1.sleep)(10);
        called.push(1);
        mutex.unlock();
        expect(mutex.locked).toBeFalsy();
    }));
});
//# sourceMappingURL=mutex.test.js.map