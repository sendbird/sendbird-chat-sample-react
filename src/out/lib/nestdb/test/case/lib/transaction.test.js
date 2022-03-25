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
const config_1 = require("../../../src/config");
const cache_1 = require("../../../src/lib/cache");
const transaction_1 = require("../../../src/lib/transaction");
const interface_1 = require("../../../src/lib/transaction/interface");
const memoryStore_1 = require("../../../src/store/memoryStore");
const util_1 = require("../../../src/util");
const TEST_DBNAME = 'testdb';
const TEST_COLLECTION_NAME = 'TestCollection';
const TEST_APPLY_DELAY = 100;
const TEST_APPLY_DELAY_BUFFER = 200;
const TEST_EVENT_KEY = 'transaction-event';
describe('[integrate] lib/transaction', () => {
    new config_1.default({ dbname: TEST_DBNAME, transactionApplyDelay: TEST_APPLY_DELAY });
    const cache = new cache_1.default({ dbname: TEST_DBNAME });
    const store = new memoryStore_1.default({});
    beforeAll((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield store.init(TEST_DBNAME);
        store.observe('failkey', ['set'], () => new Error('DB failure'));
        done();
    }));
    beforeEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield store.clear();
        cache.clear(true);
        done();
    }));
    test('init()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const transaction = new transaction_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            store,
        });
        yield transaction.init();
        expect(store.rawData).toStrictEqual({});
        expect(transaction.generation).toBe(1);
        done();
    }));
    test('requestWrite()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const item = { key: '123', value: { a: 10, b: 20 } };
        const transaction = new transaction_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            store,
            applyDelay: TEST_APPLY_DELAY,
        });
        yield transaction.init();
        yield transaction.requestWrite(item);
        expect(store.rawData).toStrictEqual({});
        expect(transaction.generation).toBe(1);
        expect(transaction.requestCount).toBe(1);
        expect(cache.items).toStrictEqual([
            Object.assign({ state: 'pending', generation: 1 }, item)
        ]);
        done();
    }));
    test('requestWrite() > commit()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const item = { key: '123', value: { a: 10, b: 20 } };
        const transaction = new transaction_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            store,
            applyDelay: TEST_APPLY_DELAY,
        });
        yield transaction.init();
        yield transaction.requestWrite(item);
        yield transaction.commit();
        expect(store.rawData[transaction.metadataKey]).toStrictEqual({ generation: 2 });
        expect(store.rawData[transaction.recordsetKey]).toStrictEqual([{
                generation: 1,
                requests: [{ data: item, options: null }]
            }]);
        expect(transaction.generation).toBe(2);
        expect(transaction.requestCount).toBe(0);
        expect(cache.items).toStrictEqual([
            Object.assign({ state: 'volatile', generation: 1 }, item)
        ]);
        yield (0, util_1.sleep)(TEST_APPLY_DELAY + TEST_APPLY_DELAY_BUFFER);
        expect(store.rawData[item.key]).toStrictEqual(item.value);
        expect(store.rawData[transaction.metadataKey]).toStrictEqual({ generation: 2 });
        expect(store.rawData[transaction.recordsetKey]).toStrictEqual([]);
        expect(transaction.generation).toBe(2);
        expect(transaction.requestCount).toBe(0);
        expect(cache.items).toStrictEqual([
            Object.assign({ state: 'volatile', generation: 1 }, item)
        ]);
        done();
    }));
    test('requestWrite() > commit() failed', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const item = { key: 'failkey', value: { a: 10, b: 20 } };
        const transaction = new transaction_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            store,
            applyDelay: TEST_APPLY_DELAY,
        });
        yield transaction.init();
        yield transaction.requestWrite(item);
        yield transaction.commit();
        expect(store.rawData[transaction.metadataKey]).toStrictEqual({ generation: 2 });
        expect(store.rawData[transaction.recordsetKey]).toStrictEqual([{
                generation: 1,
                requests: [{ data: item, options: null }]
            }]);
        expect(transaction.generation).toBe(2);
        expect(transaction.requestCount).toBe(0);
        expect(cache.items).toStrictEqual([
            Object.assign({ state: 'volatile', generation: 1 }, item)
        ]);
        yield (0, util_1.sleep)(TEST_APPLY_DELAY + TEST_APPLY_DELAY_BUFFER);
        expect(store.rawData[transaction.metadataKey]).toStrictEqual({ generation: 2 });
        expect(store.rawData[transaction.recordsetKey]).toStrictEqual([{
                generation: 1,
                requests: [{ data: item, options: null }]
            }]);
        expect(transaction.generation).toBe(2);
        expect(transaction.requestCount).toBe(0);
        expect(cache.items).toStrictEqual([
            Object.assign({ state: 'persistent', generation: 1 }, item)
        ]);
        done();
    }));
    test('requestWrite() > commit() event', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const item = { key: '123', value: { a: 10, b: 20 } };
        const transaction = new transaction_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            store,
            applyDelay: TEST_APPLY_DELAY,
        });
        transaction.on(interface_1.TransactionEventType.COMMIT, TEST_EVENT_KEY, () => {
            expect(store.rawData[transaction.metadataKey]).toStrictEqual({ generation: 2 });
            expect(store.rawData[transaction.recordsetKey]).toStrictEqual([{
                    generation: 1,
                    requests: [{ data: item, options: null }]
                }]);
            expect(transaction.generation).toBe(2);
            expect(transaction.requestCount).toBe(0);
            expect(cache.items).toStrictEqual([
                Object.assign({ state: 'volatile', generation: 1 }, item)
            ]);
        });
        transaction.on(interface_1.TransactionEventType.WRITE, TEST_EVENT_KEY, () => {
            expect(store.rawData[item.key]).toStrictEqual(item.value);
            expect(store.rawData[transaction.metadataKey]).toStrictEqual({ generation: 2 });
            expect(store.rawData[transaction.recordsetKey]).toStrictEqual([]);
            expect(transaction.generation).toBe(2);
            expect(transaction.requestCount).toBe(0);
            expect(cache.items).toStrictEqual([
                Object.assign({ state: 'volatile', generation: 1 }, item)
            ]);
            done();
        });
        yield transaction.init();
        yield transaction.requestWrite(item);
        yield transaction.commit();
    }));
    test('requestWrite() > commit() failed event', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const item = { key: 'failkey', value: { a: 10, b: 20 } };
        const transaction = new transaction_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            store,
            applyDelay: TEST_APPLY_DELAY,
        });
        transaction.on(interface_1.TransactionEventType.COMMIT, TEST_EVENT_KEY, () => {
            expect(store.rawData[transaction.metadataKey]).toStrictEqual({ generation: 2 });
            expect(store.rawData[transaction.recordsetKey]).toStrictEqual([{
                    generation: 1,
                    requests: [{ data: item, options: null }]
                }]);
            expect(transaction.generation).toBe(2);
            expect(transaction.requestCount).toBe(0);
            expect(cache.items).toStrictEqual([
                Object.assign({ state: 'volatile', generation: 1 }, item)
            ]);
        });
        transaction.on(interface_1.TransactionEventType.ERROR, TEST_EVENT_KEY, () => {
            expect(store.rawData[transaction.metadataKey]).toStrictEqual({ generation: 2 });
            expect(store.rawData[transaction.recordsetKey]).toStrictEqual([{
                    generation: 1,
                    requests: [{ data: item, options: null }]
                }]);
            expect(transaction.generation).toBe(2);
            expect(transaction.requestCount).toBe(0);
            expect(cache.items).toStrictEqual([
                Object.assign({ state: 'persistent', generation: 1 }, item)
            ]);
            done();
        });
        yield transaction.init();
        yield transaction.requestWrite(item);
        yield transaction.commit();
    }));
    test('requestMultipleWrite()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const transaction = new transaction_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            store,
            applyDelay: TEST_APPLY_DELAY,
        });
        yield transaction.init();
        const items = [];
        for (let i = 0; i < 10; i++) {
            items.push({
                key: `test-${i}`,
                value: {
                    a: i + 1,
                    b: 2 * i + 1,
                }
            });
        }
        yield transaction.requestMultipleWrite(items);
        expect(store.rawData).toStrictEqual({});
        expect(transaction.generation).toBe(1);
        expect(transaction.requestCount).toBe(items.length);
        expect(cache.items).toStrictEqual(items.map(item => {
            return Object.assign({ state: 'pending', generation: 1 }, item);
        }));
        done();
    }));
    test('requestMultipleWrite() > commit()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const transaction = new transaction_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            store,
            applyDelay: TEST_APPLY_DELAY,
        });
        yield transaction.init();
        const items = [];
        for (let i = 0; i < 10; i++) {
            items.push({
                key: `test-${i}`,
                value: {
                    a: i + 1,
                    b: 2 * i + 1,
                }
            });
        }
        yield transaction.requestMultipleWrite(items);
        yield transaction.commit();
        expect(store.rawData[transaction.metadataKey]).toStrictEqual({ generation: 2 });
        expect(store.rawData[transaction.recordsetKey]).toStrictEqual([{
                generation: 1,
                requests: items.map(item => { return { data: item, options: null }; }),
            }]);
        expect(transaction.generation).toBe(2);
        expect(transaction.requestCount).toBe(0);
        expect(cache.items).toStrictEqual(items.map(item => {
            return Object.assign({ state: 'volatile', generation: 1 }, item);
        }));
        yield (0, util_1.sleep)(TEST_APPLY_DELAY + TEST_APPLY_DELAY_BUFFER);
        for (const item of items) {
            expect(store.rawData[item.key]).toStrictEqual(item.value);
        }
        expect(store.rawData[transaction.metadataKey]).toStrictEqual({ generation: 2 });
        expect(store.rawData[transaction.recordsetKey]).toStrictEqual([]);
        expect(transaction.generation).toBe(2);
        expect(transaction.requestCount).toBe(0);
        expect(cache.items).toStrictEqual(items.map(item => {
            return Object.assign({ state: 'volatile', generation: 1 }, item);
        }));
        done();
    }));
    test('requestMultipleWrite() > commit() failed', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const transaction = new transaction_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            store,
            applyDelay: TEST_APPLY_DELAY,
        });
        yield transaction.init();
        const items = [];
        for (let i = 0; i < 10; i++) {
            items.push({
                key: i !== 5 ? `test-${i}` : 'failkey',
                value: {
                    a: i + 1,
                    b: 2 * i + 1,
                }
            });
        }
        yield transaction.requestMultipleWrite(items);
        yield transaction.commit();
        expect(store.rawData[transaction.metadataKey]).toStrictEqual({ generation: 2 });
        expect(store.rawData[transaction.recordsetKey]).toStrictEqual([{
                generation: 1,
                requests: items.map(item => { return { data: item, options: null }; }),
            }]);
        expect(transaction.generation).toBe(2);
        expect(transaction.requestCount).toBe(0);
        expect(cache.items).toStrictEqual(items.map(item => {
            return Object.assign({ state: 'volatile', generation: 1 }, item);
        }));
        yield (0, util_1.sleep)(TEST_APPLY_DELAY + TEST_APPLY_DELAY_BUFFER);
        expect(store.rawData[transaction.metadataKey]).toStrictEqual({ generation: 2 });
        expect(store.rawData[transaction.recordsetKey]).toStrictEqual([{
                generation: 1,
                requests: items.map(item => { return { data: item, options: null }; }),
            }]);
        expect(transaction.generation).toBe(2);
        expect(transaction.requestCount).toBe(0);
        const cacheItems = items
            .map(item => {
            return Object.assign({ state: item.key === 'failkey' ? 'persistent' : 'volatile', generation: 1 }, item);
        });
        expect(cache.items).toStrictEqual(cacheItems);
        done();
    }));
    test('requestMultipleWrite() > clear()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const transaction = new transaction_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            store,
            applyDelay: TEST_APPLY_DELAY,
        });
        yield transaction.init();
        const items = [];
        for (let i = 0; i < 10; i++) {
            items.push({
                key: i !== 5 ? `test-${i}` : 'failkey',
                value: {
                    a: i + 1,
                    b: 2 * i + 1,
                }
            });
        }
        yield transaction.requestMultipleWrite(items);
        yield transaction.clear();
        expect(store.rawData[transaction.metadataKey]).toBeUndefined();
        expect(store.rawData[transaction.recordsetKey]).toBeUndefined();
        expect(transaction.generation).toBe(1);
        expect(transaction.requestCount).toBe(0);
        expect(cache.items).toStrictEqual([]);
        done();
    }));
});
//# sourceMappingURL=transaction.test.js.map