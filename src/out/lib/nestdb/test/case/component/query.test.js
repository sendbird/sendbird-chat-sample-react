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
const query_1 = require("../../../src/component/query");
const manager_1 = require("../../../src/lib/block/manager");
const cache_1 = require("../../../src/lib/cache");
const indexer_1 = require("../../../src/lib/indexer");
const transaction_1 = require("../../../src/lib/transaction");
const memoryStore_1 = require("../../../src/store/memoryStore");
const mutex_1 = require("../../../src/util/mutex");
const util_1 = require("../../../src/util");
const TEST_DBNAME = 'testdb';
const TEST_COLLECTION_NAME = 'TestCollection';
const TEST_KEYNAME = 'key';
const TEST_BLOCK_HASH_BASE = 100;
const TEST_BLOCK_HASH_MULTIPLIER = 10;
const TEST_BLOCK_HASH_CONSTANT = 11;
const TEST_TRANSACTION_APPLY_DELAY = 10;
const TEST_TRANSACTION_APPLY_DELAY_BUFFER = 40;
describe('[e2e] component/query', () => {
    const metadata = {
        keyName: TEST_KEYNAME,
        blockLevel: 1,
        blockHashBase: TEST_BLOCK_HASH_BASE,
        blockHashMultiplier: TEST_BLOCK_HASH_MULTIPLIER,
        blockHashConstant: TEST_BLOCK_HASH_CONSTANT,
        indexes: [],
    };
    new config_1.default({
        dbname: TEST_DBNAME,
        transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY,
    });
    const cache = new cache_1.default({ dbname: TEST_DBNAME });
    const store = new memoryStore_1.default({});
    const mutex = new mutex_1.default('testmutexkey');
    const transaction = new transaction_1.default({
        dbname: TEST_DBNAME,
        collectionName: TEST_COLLECTION_NAME,
        store,
    });
    const blockManager = new manager_1.default({
        dbname: TEST_DBNAME,
        collectionName: TEST_COLLECTION_NAME,
        metadata,
        transaction,
        store,
    });
    const indexer = new indexer_1.default({
        dbname: TEST_DBNAME,
        collectionName: TEST_COLLECTION_NAME,
        keyName: TEST_KEYNAME,
        fields: ['a', '-c'],
        transaction,
        store,
    });
    const testdata = [];
    for (let i = 0; i < 20; i++) {
        const item1 = { key: `key-${i}-0`, a: i % 5, b: 2 * i + 1, c: (3 * i + 7) % 7 };
        const item2 = { key: `key-${i}-1`, a: i % 8, b: 3 * i + 1, c: (i + 5) % 6 };
        testdata.push(item1, item2);
    }
    beforeAll((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield store.init(TEST_DBNAME);
        yield transaction.init();
        done();
    }));
    beforeEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER);
        yield store.clear();
        cache.clear(true);
        for (const item of testdata) {
            yield blockManager.putToBlock(item.key, item);
        }
        yield transaction.commit();
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER);
        yield indexer.ensure();
        yield transaction.commit();
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER);
        done();
    }));
    test('fetch()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const query = new query_1.default({
            condition: {
                a: 2,
                c: { '<': 5 },
            },
            mutex,
            blockManager,
            indexer,
        });
        const offset = 2;
        const limit = 10;
        const items = yield query.fetch({ offset, limit });
        expect(items).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c < 5)
            .slice(offset, offset + limit));
        done();
    }));
    test('fetch() x2 with same instance, functional condition', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const query = new query_1.default({
            condition: (item) => {
                return item['a'] === 2 && item['c'] < 5;
            },
            mutex,
            blockManager,
            indexer,
        });
        const offset = 2;
        const limit = 10;
        const items1 = yield query.fetch({ offset, limit });
        expect(items1).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c < 5)
            .slice(offset, offset + limit));
        const items2 = yield query.fetch({ offset, limit });
        expect(items2).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c < 5)
            .slice(offset, offset + limit));
        done();
    }));
    test('fetch() x2 with same instance, functional condition, contaminate', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const query = new query_1.default({
            condition: (item) => {
                return item['a'] === 2 && item['c'] < 5;
            },
            mutex,
            blockManager,
            indexer,
        });
        const offset = 2;
        const limit = 10;
        const items1 = yield query.fetch({ offset, limit });
        expect(items1).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c < 5)
            .slice(offset, offset + limit));
        items1[1]['c'] = 11;
        const items2 = yield query.fetch({ offset, limit });
        expect(items2).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c < 5)
            .slice(offset, offset + limit));
        done();
    }));
    test('fetch() x2 with new instance, functional condition', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const query1 = new query_1.default({
            condition: (item) => {
                return item['a'] === 2 && item['c'] < 5;
            },
            mutex,
            blockManager,
            indexer,
        });
        const offset = 2;
        const limit = 10;
        const items1 = yield query1.fetch({ offset, limit });
        expect(items1).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c < 5)
            .slice(offset, offset + limit));
        const query2 = new query_1.default({
            condition: (item) => {
                return item['a'] === 2 && item['c'] < 5;
            },
            mutex,
            blockManager,
            indexer,
        });
        const items2 = yield query2.fetch({ offset, limit });
        expect(items2).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c < 5)
            .slice(offset, offset + limit));
        done();
    }));
    test('fetch() x2 with new instance, functional condition, contaminate', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const query1 = new query_1.default({
            condition: (item) => {
                return item['a'] === 2 && item['c'] < 5;
            },
            mutex,
            blockManager,
            indexer,
        });
        const offset = 2;
        const limit = 10;
        const items1 = yield query1.fetch({ offset, limit });
        expect(items1).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c < 5)
            .slice(offset, offset + limit));
        items1[1]['c'] = 11;
        const query2 = new query_1.default({
            condition: (item) => {
                return item['a'] === 2 && item['c'] < 5;
            },
            mutex,
            blockManager,
            indexer,
        });
        const items2 = yield query2.fetch({ offset, limit });
        expect(items2).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c < 5)
            .slice(offset, offset + limit));
        done();
    }));
    test('fetch() backward', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const query = new query_1.default({
            condition: {
                a: 2,
                c: { '>': 5 },
            },
            mutex,
            blockManager,
            indexer,
            backward: true,
        });
        const offset = 2;
        const limit = 10;
        const items = yield query.fetch({ offset, limit });
        expect(items).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c > 5)
            .reverse()
            .slice(offset, offset + limit));
        done();
    }));
    test('fetch() backward x2 with same instance, functional condition', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const query = new query_1.default({
            condition: (item) => {
                return item['a'] === 2 && item['c'] < 5;
            },
            mutex,
            blockManager,
            indexer,
            backward: true,
        });
        const offset = 2;
        const limit = 10;
        const items1 = yield query.fetch({ offset, limit });
        expect(items1).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c < 5)
            .reverse()
            .slice(offset, offset + limit));
        const items2 = yield query.fetch({ offset, limit });
        expect(items2).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c < 5)
            .reverse()
            .slice(offset, offset + limit));
        done();
    }));
    test('fetch() backward x2 with same instance, functional condition, contaminate', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const query = new query_1.default({
            condition: (item) => {
                return item['a'] === 2 && item['c'] < 5;
            },
            mutex,
            blockManager,
            indexer,
            backward: true,
        });
        const offset = 2;
        const limit = 10;
        const items1 = yield query.fetch({ offset, limit });
        expect(items1).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c < 5)
            .reverse()
            .slice(offset, offset + limit));
        items1[1]['c'] = 11;
        const items2 = yield query.fetch({ offset, limit });
        expect(items2).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c < 5)
            .reverse()
            .slice(offset, offset + limit));
        done();
    }));
    test('fetch() backward x2 with new instance, functional condition', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const query1 = new query_1.default({
            condition: (item) => {
                return item['a'] === 2 && item['c'] < 5;
            },
            mutex,
            blockManager,
            indexer,
            backward: true,
        });
        const offset = 2;
        const limit = 10;
        const items1 = yield query1.fetch({ offset, limit });
        expect(items1).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c < 5)
            .reverse()
            .slice(offset, offset + limit));
        const query2 = new query_1.default({
            condition: (item) => {
                return item['a'] === 2 && item['c'] < 5;
            },
            mutex,
            blockManager,
            indexer,
            backward: true,
        });
        const items2 = yield query2.fetch({ offset, limit });
        expect(items2).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c < 5)
            .reverse()
            .slice(offset, offset + limit));
        done();
    }));
    test('fetch() backward x2 with new instance, functional condition, contaminate', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const query1 = new query_1.default({
            condition: (item) => {
                return item['a'] === 2 && item['c'] < 5;
            },
            mutex,
            blockManager,
            indexer,
            backward: true,
        });
        const offset = 2;
        const limit = 10;
        const items1 = yield query1.fetch({ offset, limit });
        expect(items1).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c < 5)
            .reverse()
            .slice(offset, offset + limit));
        items1[1]['c'] = 11;
        const query2 = new query_1.default({
            condition: (item) => {
                return item['a'] === 2 && item['c'] < 5;
            },
            mutex,
            blockManager,
            indexer,
            backward: true,
        });
        const items2 = yield query2.fetch({ offset, limit });
        expect(items2).toStrictEqual([...testdata]
            .sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        })
            .filter(item => item.a === 2 && item.c < 5)
            .reverse()
            .slice(offset, offset + limit));
        done();
    }));
    test('count()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const query = new query_1.default({
            condition: {
                a: 2,
                c: { '<': 5 },
            },
            mutex,
            blockManager,
            indexer,
        });
        const n = yield query.count();
        expect(n).toBe(testdata.filter(item => item['a'] === 2 && item['c'] < 5).length);
        done();
    }));
});
//# sourceMappingURL=query.test.js.map