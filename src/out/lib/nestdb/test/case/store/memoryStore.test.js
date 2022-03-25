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
const error_1 = require("../../../src/error");
const memoryStore_1 = require("../../../src/store/memoryStore");
const DBNAME = 'testdb';
const DELAY = 1;
const createStore = (arg = {}) => new memoryStore_1.default(Object.assign({ delay: DELAY }, arg));
describe('[unit] memoryStore', () => {
    test('init()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const store = createStore();
        yield store.init(DBNAME);
        done();
    }));
    test('set()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const store = createStore();
        yield store.init(DBNAME);
        const data = { a: 1, b: 2 };
        const result = yield store.set({
            key: '123',
            value: data,
            generation: 1,
        });
        expect(result).toStrictEqual(data);
        done();
    }));
    test('set() exceeds item size limit', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const store = createStore({ itemSizeLimit: 10 });
        yield store.init(DBNAME);
        try {
            const data = { a: 1, b: 2, c: 10, d: 200 };
            yield store.set({
                key: '123',
                value: data,
                generation: 1,
            });
            done(new Error('It should be an error.'));
        }
        catch (err) {
            expect(err.code).toBe(error_1.ErrorCode.STORE_ITEM_SIZE_LIMIT_EXCEEDED);
            done();
        }
    }));
    test('set() > get()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const store = createStore();
        yield store.init(DBNAME);
        const data = { a: 1, b: 2 };
        yield store.set({
            key: '123',
            value: data,
            generation: 1,
        });
        const result = yield store.get('123');
        expect(result).toStrictEqual(data);
        done();
    }));
    test('set() > get() with encrypt', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const store = createStore({
            encryption: {
                encrypt: (obj) => {
                    return { k: JSON.stringify(obj) };
                },
                decrypt: (decrypted) => {
                    return JSON.parse(decrypted['k']);
                },
            },
        });
        yield store.init(DBNAME);
        const data = { a: 1, b: 2 };
        yield store.set({
            key: '123',
            value: data,
            generation: 1,
        });
        const result = yield store.get('123');
        expect(result).toStrictEqual(data);
        done();
    }));
    test('set() > remove() > get()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const store = createStore();
        yield store.init(DBNAME);
        const data = { a: 1, b: 2 };
        yield store.set({
            key: '123',
            value: data,
            generation: 1,
        });
        yield store.remove('123');
        const result = yield store.get('123');
        expect(result).toBeNull();
        done();
    }));
    test('set() > clear() > get()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const store = createStore();
        yield store.init(DBNAME);
        const data = { a: 1, b: 2 };
        yield store.set({
            key: '123',
            value: data,
            generation: 1,
        });
        yield store.clear();
        const result = yield store.get('123');
        expect(result).toBeNull();
        done();
    }));
    test('setMany()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const store = createStore();
        yield store.init(DBNAME);
        const items = [];
        for (let i = 0; i < 10; i++) {
            items.push({
                key: `item-${i}`,
                value: { a: i + 1, b: 2 * i + 1 },
                generation: 1,
            });
        }
        const results = yield store.setMany(items);
        expect(results).toStrictEqual(items.map(item => item.value));
        done();
    }));
    test('setMany() > getAllKeys()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const store = createStore();
        yield store.init(DBNAME);
        const items = [];
        for (let i = 0; i < 10; i++) {
            items.push({
                key: `item-${i}`,
                value: { a: i + 1, b: 2 * i + 1 },
                generation: 1,
            });
        }
        yield store.setMany(items);
        const keys = yield store.getAllKeys();
        expect(keys).toStrictEqual(items.map(item => item.key));
        done();
    }));
    test('setMany() > get() each', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const store = createStore();
        yield store.init(DBNAME);
        const items = [];
        for (let i = 0; i < 10; i++) {
            items.push({
                key: `item-${i}`,
                value: { a: i + 1, b: 2 * i + 1 },
                generation: 1,
            });
        }
        yield store.setMany(items);
        for (let i = 0; i < 10; i++) {
            const result = yield store.get(`item-${i}`);
            expect(result).toStrictEqual(items[i].value);
        }
        done();
    }));
    test('setMany() > get() each with encrypt', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const store = createStore({
            encryption: {
                encrypt: (obj) => {
                    return { k: JSON.stringify(obj) };
                },
                decrypt: (decrypted) => {
                    return JSON.parse(decrypted['k']);
                },
            }
        });
        yield store.init(DBNAME);
        const items = [];
        for (let i = 0; i < 10; i++) {
            items.push({
                key: `item-${i}`,
                value: { a: i + 1, b: 2 * i + 1 },
                generation: 1,
            });
        }
        yield store.setMany(items);
        for (let i = 0; i < 10; i++) {
            const result = yield store.get(`item-${i}`);
            expect(result).toStrictEqual(items[i].value);
        }
        done();
    }));
    test('setMany() > remove() > getAllKeys()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const store = createStore();
        yield store.init(DBNAME);
        const items = [];
        for (let i = 0; i < 10; i++) {
            items.push({
                key: `item-${i}`,
                value: { a: i + 1, b: 2 * i + 1 },
                generation: 1,
            });
        }
        yield store.setMany(items);
        yield store.remove('item-3');
        const keys = yield store.getAllKeys();
        expect(keys).toStrictEqual(items.map(item => item.key).filter(key => key !== 'item-3'));
        done();
    }));
    test('setMany() > remove() > get()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const store = createStore();
        yield store.init(DBNAME);
        const items = [];
        for (let i = 0; i < 10; i++) {
            items.push({
                key: `item-${i}`,
                value: { a: i + 1, b: 2 * i + 1 },
                generation: 1,
            });
        }
        yield store.setMany(items);
        yield store.remove('item-3');
        for (let i = 0; i < 10; i++) {
            const key = `item-${i}`;
            const result = yield store.get(key);
            if (key !== 'item-3') {
                expect(result).toStrictEqual(items[i].value);
            }
            else {
                expect(result).toBeNull();
            }
        }
        done();
    }));
    test('setMany() > removeMany() > getAllKeys()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const store = createStore();
        yield store.init(DBNAME);
        const items = [];
        for (let i = 0; i < 10; i++) {
            items.push({
                key: `item-${i}`,
                value: { a: i + 1, b: 2 * i + 1 },
                generation: 1,
            });
        }
        yield store.setMany(items);
        const removedKeys = yield store.removeMany(['item-3', 'item-5']);
        const keys = yield store.getAllKeys();
        expect(keys).toStrictEqual(items.map(item => item.key).filter(key => !removedKeys.includes(key)));
        done();
    }));
    test('setMany() > removeMany() > get()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const store = createStore();
        yield store.init(DBNAME);
        const items = [];
        for (let i = 0; i < 10; i++) {
            items.push({
                key: `item-${i}`,
                value: { a: i + 1, b: 2 * i + 1 },
                generation: 1,
            });
        }
        yield store.setMany(items);
        const removedKeys = yield store.removeMany(['item-3', 'item-5']);
        for (let i = 0; i < 10; i++) {
            const key = `item-${i}`;
            const result = yield store.get(key);
            if (!removedKeys.includes(key)) {
                expect(result).toStrictEqual(items[i].value);
            }
            else {
                expect(result).toBeNull();
            }
        }
        done();
    }));
    test('setMany() > clear() > getAllKeys()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const store = createStore();
        yield store.init(DBNAME);
        const items = [];
        for (let i = 0; i < 10; i++) {
            items.push({
                key: `item-${i}`,
                value: { a: i + 1, b: 2 * i + 1 },
                generation: 1,
            });
        }
        yield store.setMany(items);
        yield store.clear();
        const keys = yield store.getAllKeys();
        expect(keys).toStrictEqual([]);
        done();
    }));
    test('setMany() > clear() > get()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const store = createStore();
        yield store.init(DBNAME);
        const items = [];
        for (let i = 0; i < 10; i++) {
            items.push({
                key: `item-${i}`,
                value: { a: i + 1, b: 2 * i + 1 },
                generation: 1,
            });
        }
        yield store.setMany(items);
        yield store.clear();
        for (let i = 0; i < 10; i++) {
            const key = `item-${i}`;
            const result = yield store.get(key);
            expect(result).toBeNull();
        }
        done();
    }));
});
//# sourceMappingURL=memoryStore.test.js.map