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
const iterator_1 = require("../../../src/component/query/iterator");
const manager_1 = require("../../../src/lib/block/manager");
const cache_1 = require("../../../src/lib/cache");
const indexer_1 = require("../../../src/lib/indexer");
const transaction_1 = require("../../../src/lib/transaction");
const memoryStore_1 = require("../../../src/store/memoryStore");
const util_1 = require("../../../src/util");
const TEST_DBNAME = 'testdb';
const TEST_COLLECTION_NAME = 'TestCollection';
const TEST_KEYNAME = 'key';
const TEST_BLOCK_HASH_BASE = 100;
const TEST_BLOCK_HASH_MULTIPLIER = 10;
const TEST_BLOCK_HASH_CONSTANT = 11;
const TEST_TRANSACTION_APPLY_DELAY = 10;
const TEST_TRANSACTION_APPLY_DELAY_BUFFER = 40;
const TEST_DATA_COUNT = 30;
describe('[integrate] component/query/iterator', () => {
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
    for (let i = 0; i < TEST_DATA_COUNT; i++) {
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
    test('each()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const iterator = new iterator_1.default({
            blockManager,
            indexer,
        });
        const items = [];
        yield iterator.each((cursor) => __awaiter(void 0, void 0, void 0, function* () {
            if (cursor.hasNext) {
                items.push(cursor.nextValue);
                cursor.next();
            }
            else {
                cursor.stop();
            }
        }));
        expect(items).toStrictEqual([...testdata].sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        }));
        done();
    }));
    test('each() backward', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const iterator = new iterator_1.default({
            backward: true,
            blockManager,
            indexer,
        });
        const items = [];
        yield iterator.each((cursor) => __awaiter(void 0, void 0, void 0, function* () {
            if (cursor.hasNext) {
                items.push(cursor.nextValue);
                cursor.next();
            }
            else {
                cursor.stop();
            }
        }));
        expect(items).toStrictEqual([...testdata].sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        }).reverse());
        done();
    }));
    test('each() condition index column', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const iterator = new iterator_1.default({
            condition: {
                a: 2,
                c: { '<': 5 },
            },
            blockManager,
            indexer,
        });
        const items = [];
        yield iterator.each((cursor) => __awaiter(void 0, void 0, void 0, function* () {
            if (cursor.hasNext) {
                items.push(cursor.nextValue);
                cursor.next();
            }
            else {
                cursor.stop();
            }
        }));
        expect(items).toStrictEqual([...testdata].sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        }).filter(item => item.a === 2 && item.c < 5));
        done();
    }));
    test('each() backward condition index column', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const iterator = new iterator_1.default({
            condition: {
                a: 2,
                c: { '>': 5 },
            },
            backward: true,
            blockManager,
            indexer,
        });
        const items = [];
        yield iterator.each((cursor) => __awaiter(void 0, void 0, void 0, function* () {
            if (cursor.hasNext) {
                items.push(cursor.nextValue);
                cursor.next();
            }
            else {
                cursor.stop();
            }
        }));
        expect(items).toStrictEqual([...testdata].sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        }).filter(item => item.a === 2 && item.c > 5).reverse());
        done();
    }));
    test('each() condition non-index column', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const iterator = new iterator_1.default({
            condition: {
                b: { '>': 5 },
            },
            blockManager,
            indexer,
        });
        const items = [];
        yield iterator.each((cursor) => __awaiter(void 0, void 0, void 0, function* () {
            if (cursor.hasNext) {
                items.push(cursor.nextValue);
                cursor.next();
            }
            else {
                cursor.stop();
            }
        }));
        expect(items).toStrictEqual([...testdata].sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        }).filter(item => item.b > 5));
        done();
    }));
    test('each() backward condition non-index column', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const iterator = new iterator_1.default({
            condition: {
                b: { '>': 5 },
            },
            backward: true,
            blockManager,
            indexer,
        });
        const items = [];
        yield iterator.each((cursor) => __awaiter(void 0, void 0, void 0, function* () {
            if (cursor.hasNext) {
                items.push(cursor.nextValue);
                cursor.next();
            }
            else {
                cursor.stop();
            }
        }));
        expect(items).toStrictEqual([...testdata].sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        }).filter(item => item.b > 5).reverse());
        done();
    }));
    test('each() condition composite column', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const iterator = new iterator_1.default({
            condition: {
                a: 2,
                b: { '>': 5 },
                c: { '<': 5 },
            },
            blockManager,
            indexer,
        });
        const items = [];
        yield iterator.each((cursor) => __awaiter(void 0, void 0, void 0, function* () {
            if (cursor.hasNext) {
                items.push(cursor.nextValue);
                cursor.next();
            }
            else {
                cursor.stop();
            }
        }));
        expect(items).toStrictEqual([...testdata].sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        }).filter(item => item.a === 2 && item.b > 5 && item.c < 5));
        done();
    }));
    test('each() backward condition composite column', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const iterator = new iterator_1.default({
            condition: {
                a: 2,
                b: { '>': 5 },
                c: { '>': 5 },
            },
            backward: true,
            blockManager,
            indexer,
        });
        const items = [];
        yield iterator.each((cursor) => __awaiter(void 0, void 0, void 0, function* () {
            if (cursor.hasNext) {
                items.push(cursor.nextValue);
                cursor.next();
            }
            else {
                cursor.stop();
            }
        }));
        expect(items).toStrictEqual([...testdata].sort((a, b) => {
            return indexer.diff(indexer.getColumnValues(a), indexer.getColumnValues(b));
        }).filter(item => item.a === 2 && item.b > 5 && item.c > 5).reverse());
        done();
    }));
});
//# sourceMappingURL=query.iterator.test.js.map