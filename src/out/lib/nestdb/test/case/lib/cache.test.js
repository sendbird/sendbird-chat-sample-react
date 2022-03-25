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
const cache_1 = require("../../../src/lib/cache");
const memoryStore_1 = require("../../../src/store/memoryStore");
const TEST_DBNAME = 'testdb';
describe('[unit] lib/cache', () => {
    const limit = 5;
    const cache = new cache_1.default({ dbname: TEST_DBNAME, limit });
    afterEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        cache.clear(true);
        done();
    }));
    test('put() x10 volatile', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const expectedCacheItems = [];
        for (let i = 0; i < 10; i++) {
            const cacheItem = {
                state: cache_1.CacheState.VOLATILE,
                generation: 1,
                key: `testkey-${i}`,
                value: { x: 10 + i, y: 20 + i },
            };
            if (i >= limit) {
                expectedCacheItems.push(cacheItem);
            }
            cache.put(cacheItem);
        }
        expect(cache.items).toStrictEqual(expectedCacheItems);
        done();
    }));
    test('put() x10 persistent', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const expectedCacheItems = [];
        for (let i = 0; i < 10; i++) {
            const cacheItem = {
                state: cache_1.CacheState.PERSISTENT,
                generation: 1,
                key: `testkey-${i}`,
                value: { x: 10 + i, y: 20 + i },
            };
            expectedCacheItems.push(cacheItem);
            cache.put(cacheItem);
        }
        expect(cache.items).toStrictEqual(expectedCacheItems);
        done();
    }));
    test('put() x8 volatile and x4 persistent', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const expectedCacheItems = [];
        for (let i = 0; i < 12; i++) {
            const cacheItem = {
                state: (i % 3 === 0) ? cache_1.CacheState.PERSISTENT : cache_1.CacheState.VOLATILE,
                generation: 1,
                key: `testkey-${i}`,
                value: { x: 10 + i, y: 20 + i },
            };
            if (i % 3 === 0 || i >= 5) {
                expectedCacheItems.push(cacheItem);
            }
            cache.put(cacheItem);
        }
        expect(cache.items).toStrictEqual(expectedCacheItems);
        done();
    }));
    test('put() x8 volatile and x4 persistent > get() volatile hit', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const targetIndex = 5;
        const expectedCacheItems = [];
        for (let i = 0; i < 12; i++) {
            const cacheItem = {
                state: (i % 3 === 0) ? cache_1.CacheState.PERSISTENT : cache_1.CacheState.VOLATILE,
                generation: 1,
                key: `testkey-${i}`,
                value: { x: 10 + i, y: 20 + i },
            };
            if (i % 3 === 0 || i >= 5) {
                expectedCacheItems.push(cacheItem);
            }
            cache.put(cacheItem);
        }
        const spliced = expectedCacheItems.splice(2, 1);
        expectedCacheItems.push(...spliced);
        const targetKey = `testkey-${targetIndex}`;
        const cachedItem = cache.get(targetKey);
        expect(cachedItem).toStrictEqual({
            state: cache_1.CacheState.VOLATILE,
            generation: 1,
            key: targetKey,
            value: { x: 10 + targetIndex, y: 20 + targetIndex }
        });
        expect(cache.items).toStrictEqual(expectedCacheItems);
        done();
    }));
    test('put() x8 volatile and x4 persistent > get() volatile miss', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const targetIndex = 4;
        const expectedCacheItems = [];
        for (let i = 0; i < 12; i++) {
            const cacheItem = {
                state: (i % 3 === 0) ? cache_1.CacheState.PERSISTENT : cache_1.CacheState.VOLATILE,
                generation: 1,
                key: `testkey-${i}`,
                value: { x: 10 + i, y: 20 + i },
            };
            if (i % 3 === 0 || i >= 5) {
                expectedCacheItems.push(cacheItem);
            }
            cache.put(cacheItem);
        }
        const targetKey = `testkey-${targetIndex}`;
        const cachedItem = cache.get(targetKey);
        expect(cachedItem).toBeNull();
        expect(cache.items).toStrictEqual(expectedCacheItems);
        done();
    }));
    test('put() x8 volatile and x4 persistent > get() persistent', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const targetIndex = 3;
        const expectedCacheItems = [];
        for (let i = 0; i < 12; i++) {
            const cacheItem = {
                state: (i % 3 === 0) ? cache_1.CacheState.PERSISTENT : cache_1.CacheState.VOLATILE,
                generation: 1,
                key: `testkey-${i}`,
                value: { x: 10 + i, y: 20 + i },
            };
            if (i % 3 === 0 || i >= 5) {
                expectedCacheItems.push(cacheItem);
            }
            cache.put(cacheItem);
        }
        const targetKey = `testkey-${targetIndex}`;
        const cachedItem = cache.get(targetKey);
        expect(cachedItem).toStrictEqual({
            state: cache_1.CacheState.PERSISTENT,
            generation: 1,
            key: targetKey,
            value: { x: 10 + targetIndex, y: 20 + targetIndex }
        });
        expect(cache.items).toStrictEqual(expectedCacheItems);
        done();
    }));
    test('put() x3 > remove volatile', (done) => __awaiter(void 0, void 0, void 0, function* () {
        cache.put({
            state: cache_1.CacheState.VOLATILE,
            generation: 1,
            key: `testkey-1`,
            value: { x: 10, y: 20 },
        });
        cache.put({
            state: cache_1.CacheState.PERSISTENT,
            generation: 1,
            key: `testkey-2`,
            value: { x: 11, y: 21 },
        });
        cache.put({
            state: cache_1.CacheState.VOLATILE,
            generation: 1,
            key: `testkey-3`,
            value: { x: 12, y: 22 },
        });
        const expectedCacheItems = [
            {
                state: cache_1.CacheState.PERSISTENT,
                generation: 1,
                key: `testkey-2`,
                value: { x: 11, y: 21 },
            },
            {
                state: cache_1.CacheState.VOLATILE,
                generation: 1,
                key: `testkey-3`,
                value: { x: 12, y: 22 },
            }
        ];
        cache.remove('testkey-1');
        expect(cache.items).toStrictEqual(expectedCacheItems);
        done();
    }));
    test('put() x3 > remove persistent', (done) => __awaiter(void 0, void 0, void 0, function* () {
        cache.put({
            state: cache_1.CacheState.VOLATILE,
            generation: 1,
            key: `testkey-1`,
            value: { x: 10, y: 20 },
        });
        cache.put({
            state: cache_1.CacheState.PERSISTENT,
            generation: 1,
            key: `testkey-2`,
            value: { x: 11, y: 21 }
        });
        cache.put({
            state: cache_1.CacheState.VOLATILE,
            generation: 1,
            key: `testkey-3`,
            value: { x: 12, y: 22 }
        });
        const expectedCacheItems = [
            {
                state: cache_1.CacheState.VOLATILE,
                generation: 1,
                key: `testkey-1`,
                value: { x: 10, y: 20 }
            },
            {
                state: cache_1.CacheState.VOLATILE,
                generation: 1,
                key: `testkey-3`,
                value: { x: 12, y: 22 }
            }
        ];
        cache.remove('testkey-2');
        expect(cache.items).toStrictEqual(expectedCacheItems);
        done();
    }));
    test('put() x3 > remove non-exist', (done) => __awaiter(void 0, void 0, void 0, function* () {
        cache.put({
            state: cache_1.CacheState.VOLATILE,
            generation: 1,
            key: `testkey-1`,
            value: { x: 10, y: 20 }
        });
        cache.put({
            state: cache_1.CacheState.PERSISTENT,
            generation: 1,
            key: `testkey-2`,
            value: { x: 11, y: 21 }
        });
        cache.put({
            state: cache_1.CacheState.VOLATILE,
            generation: 1,
            key: `testkey-3`,
            value: { x: 12, y: 22 }
        });
        const expectedCacheItems = [
            {
                state: cache_1.CacheState.VOLATILE,
                generation: 1,
                key: `testkey-1`,
                value: { x: 10, y: 20 }
            },
            {
                state: cache_1.CacheState.PERSISTENT,
                generation: 1,
                key: `testkey-2`,
                value: { x: 11, y: 21 }
            },
            {
                state: cache_1.CacheState.VOLATILE,
                generation: 1,
                key: `testkey-3`,
                value: { x: 12, y: 22 }
            }
        ];
        cache.remove('testkey-4');
        expect(cache.items).toStrictEqual(expectedCacheItems);
        done();
    }));
    test('put() x3 > clear', (done) => __awaiter(void 0, void 0, void 0, function* () {
        cache.put({
            state: cache_1.CacheState.VOLATILE,
            generation: 1,
            key: `testkey-1`,
            value: { x: 10, y: 20 }
        });
        cache.put({
            state: cache_1.CacheState.PERSISTENT,
            generation: 1,
            key: `testkey-2`,
            value: { x: 11, y: 21 }
        });
        cache.put({
            state: cache_1.CacheState.VOLATILE,
            generation: 1,
            key: `testkey-3`,
            value: { x: 12, y: 22 }
        });
        const expectedCacheItems = [
            {
                state: cache_1.CacheState.PERSISTENT,
                generation: 1,
                key: `testkey-2`,
                value: { x: 11, y: 21 }
            }
        ];
        cache.clear();
        expect(cache.items).toStrictEqual(expectedCacheItems);
        done();
    }));
    test('put() x3 > clear force', (done) => __awaiter(void 0, void 0, void 0, function* () {
        cache.put({
            state: cache_1.CacheState.VOLATILE,
            generation: 1,
            key: `testkey-1`,
            value: { x: 10, y: 20 }
        });
        cache.put({
            state: cache_1.CacheState.PERSISTENT,
            generation: 1,
            key: `testkey-2`,
            value: { x: 11, y: 21 }
        });
        cache.put({
            state: cache_1.CacheState.VOLATILE,
            generation: 1,
            key: `testkey-3`,
            value: { x: 12, y: 22 }
        });
        const expectedCacheItems = [];
        cache.clear(true);
        expect(cache.items).toStrictEqual(expectedCacheItems);
        done();
    }));
});
describe('[integrate] lib/cache', () => {
    const limit = 5;
    const store = new memoryStore_1.default({ delay: 10 });
    const cache = new cache_1.default({ dbname: TEST_DBNAME, limit });
    beforeAll((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield store.init('testdb');
        done();
    }));
    afterEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield store.clear();
        cache.clear(true);
        done();
    }));
    test('find() volatile cached as non-persistent', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const cacheItem = {
            state: cache_1.CacheState.VOLATILE,
            generation: 1,
            key: 'testkey',
            value: { x: 10, y: 20 },
        };
        yield store.set(cacheItem);
        cache.put(cacheItem);
        const data = yield cache.find(store, 'testkey');
        expect(data).toStrictEqual(cacheItem);
        expect(cache.items).toStrictEqual([
            {
                state: cache_1.CacheState.VOLATILE,
                generation: 1,
                key: 'testkey',
                value: { x: 10, y: 20 }
            }
        ]);
        done();
    }));
    test('find() volatile cached as persistent', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const cacheItem = {
            state: cache_1.CacheState.VOLATILE,
            generation: 1,
            key: 'testkey',
            value: { x: 10, y: 20 }
        };
        yield store.set(cacheItem);
        cache.put(cacheItem);
        const data = yield cache.find(store, 'testkey', cache_1.CacheGetOptions.PERSISTENT);
        expect(data).toStrictEqual(cacheItem);
        expect(cache.items).toStrictEqual([
            {
                state: cache_1.CacheState.PERSISTENT,
                generation: 1,
                key: 'testkey',
                value: { x: 10, y: 20 }
            }
        ]);
        done();
    }));
    test('find() persistent cached as non-persistent', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const cacheItem = {
            state: cache_1.CacheState.PERSISTENT,
            generation: 1,
            key: 'testkey',
            value: { x: 10, y: 20 }
        };
        yield store.set(cacheItem);
        cache.put(cacheItem);
        const data = yield cache.find(store, 'testkey');
        expect(data).toStrictEqual(cacheItem);
        expect(cache.items).toStrictEqual([
            {
                state: cache_1.CacheState.PERSISTENT,
                generation: 1,
                key: 'testkey',
                value: { x: 10, y: 20 }
            }
        ]);
        done();
    }));
    test('find() persistent cached as persistent', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const cacheItem = {
            state: cache_1.CacheState.PERSISTENT,
            generation: 1,
            key: 'testkey',
            value: { x: 10, y: 20 }
        };
        yield store.set(cacheItem);
        cache.put(cacheItem);
        const data = yield cache.find(store, 'testkey', cache_1.CacheGetOptions.PERSISTENT);
        expect(data).toStrictEqual(cacheItem);
        expect(cache.items).toStrictEqual([
            {
                state: cache_1.CacheState.PERSISTENT,
                generation: 1,
                key: 'testkey',
                value: { x: 10, y: 20 }
            }
        ]);
        done();
    }));
    test('find() volatile non-cached as non-persistent', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const cacheItem = {
            state: cache_1.CacheState.VOLATILE,
            generation: 1,
            key: 'testkey',
            value: { x: 10, y: 20 }
        };
        yield store.set(cacheItem);
        const data = yield cache.find(store, 'testkey');
        expect(data).toStrictEqual(cacheItem);
        expect(cache.items).toStrictEqual([
            {
                state: cache_1.CacheState.VOLATILE,
                generation: 1,
                key: 'testkey',
                value: { x: 10, y: 20 }
            }
        ]);
        done();
    }));
    test('find() volatile non-cached as persistent', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const cacheItem = {
            state: cache_1.CacheState.VOLATILE,
            generation: 1,
            key: 'testkey',
            value: { x: 10, y: 20 }
        };
        yield store.set(cacheItem);
        const data = yield cache.find(store, 'testkey', cache_1.CacheGetOptions.PERSISTENT);
        expect(data).toStrictEqual(Object.assign(Object.assign({}, cacheItem), { state: cache_1.CacheState.PERSISTENT }));
        expect(cache.items).toStrictEqual([
            {
                state: cache_1.CacheState.PERSISTENT,
                generation: 1,
                key: 'testkey',
                value: { x: 10, y: 20 }
            }
        ]);
        done();
    }));
    test('find() persistent non-cached as non-persistent', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const cacheItem = {
            state: cache_1.CacheState.PERSISTENT,
            generation: 1,
            key: 'testkey',
            value: { x: 10, y: 20 }
        };
        yield store.set(cacheItem);
        const data = yield cache.find(store, 'testkey');
        expect(data).toStrictEqual(Object.assign(Object.assign({}, cacheItem), { state: cache_1.CacheState.VOLATILE }));
        expect(cache.items).toStrictEqual([
            {
                state: cache_1.CacheState.VOLATILE,
                generation: 1,
                key: 'testkey',
                value: { x: 10, y: 20 }
            }
        ]);
        done();
    }));
    test('find() persistent non-cached as persistent', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const cacheItem = {
            state: cache_1.CacheState.PERSISTENT,
            generation: 1,
            key: 'testkey',
            value: { x: 10, y: 20 }
        };
        yield store.set(cacheItem);
        const data = yield cache.find(store, 'testkey', cache_1.CacheGetOptions.PERSISTENT);
        expect(data).toStrictEqual(cacheItem);
        expect(cache.items).toStrictEqual([
            {
                state: cache_1.CacheState.PERSISTENT,
                generation: 1,
                key: 'testkey',
                value: { x: 10, y: 20 }
            }
        ]);
        done();
    }));
});
//# sourceMappingURL=cache.test.js.map