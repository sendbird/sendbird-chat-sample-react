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
const indexer_1 = require("../../../src/lib/indexer");
const transaction_1 = require("../../../src/lib/transaction");
const memoryStore_1 = require("../../../src/store/memoryStore");
const util_1 = require("../../../src/util");
const keygen_1 = require("../../../src/util/keygen");
const TEST_DBNAME = 'testdb';
const TEST_COLLECTION_NAME = 'TestCollection';
const TEST_KEYNAME = 'key';
const TEST_TRANSACTION_APPLY_DELAY = 10;
const TEST_TRANSACTION_APPLY_DELAY_BUFFER = 50;
describe('[unit] lib/indexer', () => {
    new config_1.default({
        dbname: TEST_DBNAME,
        transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY,
    });
    new cache_1.default({ dbname: TEST_DBNAME });
    const store = new memoryStore_1.default({});
    const transaction = new transaction_1.default({
        dbname: TEST_DBNAME,
        collectionName: TEST_COLLECTION_NAME,
        store,
    });
    test('createKey()', done => {
        expect(indexer_1.default.createKey(['a', '-b', 'c'])).toBe('a>-b>c');
        done();
    });
    test('parseKey()', done => {
        const index = ['a', '-b', 'c'];
        expect(indexer_1.default.parseKey(indexer_1.default.createKey(index))).toStrictEqual(index);
        done();
    });
    test('getColumnValues()', done => {
        const item = {
            a: 10,
            b: 20,
            c: 30,
        };
        const indexer = new indexer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            fields: ['a', '-c'],
            transaction,
            store,
        });
        expect(indexer.getColumnValues(item)).toStrictEqual([10, 30]);
        done();
    });
    test('diff() equal', done => {
        const indexer = new indexer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            fields: ['a', '-c'],
            transaction,
            store,
        });
        expect(indexer.diff([10, 30], [10, 30])).toBe(0);
        done();
    });
    test('diff() greater', done => {
        const indexer = new indexer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            fields: ['a', '-c'],
            transaction,
            store,
        });
        expect(indexer.diff([10, 20], [10, 30])).toBeGreaterThan(0);
        done();
    });
    test('diff() less', done => {
        const indexer = new indexer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            fields: ['a', '-c'],
            transaction,
            store,
        });
        expect(indexer.diff([10, 40], [10, 30])).toBeLessThan(0);
        done();
    });
    test('indexOf() matched', done => {
        const indexer = new indexer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            fields: ['a', '-c'],
            transaction,
            store,
        });
        indexer.table.push(...[
            {
                columnValues: [1, 10],
                keys: ['1', '77'],
            },
            {
                columnValues: [1, 5],
                keys: ['5'],
            },
            {
                columnValues: [1, 3],
                keys: ['39', '248'],
            },
            {
                columnValues: [2, 8],
                keys: ['4', '68', '113'],
            },
            {
                columnValues: [2, 5],
                keys: ['15'],
            },
        ]);
        expect(indexer.indexOf([1, 10])).toStrictEqual([0, true]);
        expect(indexer.indexOf([2, 8])).toStrictEqual([3, true]);
        expect(indexer.indexOf([2, 5])).toStrictEqual([4, true]);
        done();
    });
    test('indexOf() not matched', done => {
        const indexer = new indexer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            fields: ['a', '-c'],
            transaction,
            store,
        });
        indexer.table.push(...[
            {
                columnValues: [1, 10],
                keys: ['1', '77'],
            },
            {
                columnValues: [1, 5],
                keys: ['5'],
            },
            {
                columnValues: [1, 3],
                keys: ['39', '248'],
            },
            {
                columnValues: [2, 8],
                keys: ['4', '68', '113'],
            },
            {
                columnValues: [2, 5],
                keys: ['15'],
            },
        ]);
        expect(indexer.indexOf([1, 12])).toStrictEqual([0, false]);
        expect(indexer.indexOf([2, 12])).toStrictEqual([3, false]);
        expect(indexer.indexOf([2, 2])).toStrictEqual([5, false]);
        done();
    });
});
describe('[integrate] lib/indexer', () => {
    new config_1.default({ dbname: TEST_DBNAME });
    const cache = new cache_1.default({ dbname: TEST_DBNAME });
    const store = new memoryStore_1.default({});
    const transaction = new transaction_1.default({
        dbname: TEST_DBNAME,
        collectionName: TEST_COLLECTION_NAME,
        store,
        applyDelay: TEST_TRANSACTION_APPLY_DELAY,
    });
    beforeAll((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield store.init(TEST_DBNAME);
        yield transaction.init();
        done();
    }));
    beforeEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY);
        yield store.clear();
        cache.clear(true);
        done();
    }));
    test('ensure() no migration', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const indexer = new indexer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            fields: ['a', '-c'],
            transaction,
            store,
        });
        yield indexer.ensure();
        expect(indexer.origin).toStrictEqual([]);
        expect(indexer.table).toStrictEqual([]);
        yield transaction.commit();
        expect(indexer.origin).toStrictEqual([]);
        expect(indexer.table).toStrictEqual([]);
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER);
        expect(store.rawData[`nest@${TEST_DBNAME}/${TEST_COLLECTION_NAME}/index.a>-c`]).toStrictEqual([]);
        done();
    }));
    test('ensure() migration', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const items = [];
        for (let i = 0; i < 10; i++) {
            const blockId = (0, keygen_1.createBlockKey)(TEST_DBNAME, TEST_COLLECTION_NAME, i % 3, `${i + 1}`);
            const item1 = { key: `key-${i}-0`, a: i % 5, b: 2 * i + 1, c: (3 * i + 7) % 7 };
            const item2 = { key: `key-${i}-1`, a: i % 8, b: 3 * i + 1, c: (i + 5) % 6 };
            store.rawData[blockId] = {
                blockId,
                keyName: 'key',
                items: [item1, item2],
                limit: 100,
            };
            items.push(item1, item2);
        }
        const expectedTable = [
            { columnValues: [0, 5], keys: ['key-0-1'] },
            { columnValues: [0, 1], keys: ['key-5-0', 'key-8-1'] },
            { columnValues: [0, 0], keys: ['key-0-0'] },
            { columnValues: [1, 4], keys: ['key-6-0'] },
            { columnValues: [1, 3], keys: ['key-1-0'] },
            { columnValues: [1, 2], keys: ['key-9-1'] },
            { columnValues: [1, 0], keys: ['key-1-1'] },
            { columnValues: [2, 6], keys: ['key-2-0'] },
            { columnValues: [2, 1], keys: ['key-2-1'] },
            { columnValues: [2, 0], keys: ['key-7-0'] },
            { columnValues: [3, 3], keys: ['key-8-0'] },
            { columnValues: [3, 2], keys: ['key-3-0', 'key-3-1'] },
            { columnValues: [4, 6], keys: ['key-9-0'] },
            { columnValues: [4, 5], keys: ['key-4-0'] },
            { columnValues: [4, 3], keys: ['key-4-1'] },
            { columnValues: [5, 4], keys: ['key-5-1'] },
            { columnValues: [6, 5], keys: ['key-6-1'] },
            { columnValues: [7, 0], keys: ['key-7-1'] },
        ];
        const indexer = new indexer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            fields: ['a', '-c'],
            transaction,
            store,
        });
        yield indexer.ensure();
        expect(indexer.origin).toStrictEqual([]);
        expect(indexer.table).toStrictEqual(expectedTable);
        yield transaction.commit();
        expect(indexer.origin).toStrictEqual(expectedTable);
        expect(indexer.table).toStrictEqual(expectedTable);
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER);
        expect(store.rawData[(0, keygen_1.createIndexerKey)(TEST_DBNAME, TEST_COLLECTION_NAME, 'a>-c')]).toStrictEqual(expectedTable);
        done();
    }));
    test('ensure() > drop()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const items = [];
        for (let i = 0; i < 10; i++) {
            const blockId = (0, keygen_1.createBlockKey)(TEST_DBNAME, TEST_COLLECTION_NAME, i % 3, `${i + 1}`);
            const item1 = { key: `key-${i}-0`, a: i % 5, b: 2 * i + 1, c: (3 * i + 7) % 7 };
            const item2 = { key: `key-${i}-1`, a: i % 8, b: 3 * i + 1, c: (i + 5) % 6 };
            store.rawData[blockId] = {
                blockId,
                keyName: 'key',
                items: [item1, item2],
                limit: 100,
            };
            items.push(item1, item2);
        }
        const indexer = new indexer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            fields: ['a', '-c'],
            transaction,
            store,
        });
        yield indexer.ensure();
        yield transaction.commit();
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER);
        yield indexer.drop();
        yield transaction.commit();
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER);
        expect(store.rawData[(0, keygen_1.createIndexerKey)(TEST_DBNAME, TEST_COLLECTION_NAME, 'a>-c')]).toBeUndefined();
        done();
    }));
    test('ensure() > addItem()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const indexer = new indexer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            fields: ['a', '-c'],
            transaction,
            store,
        });
        yield indexer.ensure();
        yield transaction.commit();
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER);
        const expectedTable = [
            { columnValues: [6, 30], keys: ['testkey2'] },
            { columnValues: [10, 20], keys: ['testkey3'] },
            { columnValues: [10, 10], keys: ['testkey1'] },
        ];
        yield indexer.addItem({ [TEST_KEYNAME]: 'testkey1', a: 10, b: 20, c: 10 });
        yield indexer.addItem({ [TEST_KEYNAME]: 'testkey2', a: 6, b: 20, c: 30 });
        yield indexer.addItem({ [TEST_KEYNAME]: 'testkey3', a: 10, b: 20, c: 20 });
        expect(indexer.origin).toStrictEqual([]);
        expect(indexer.table).toStrictEqual(expectedTable);
        yield transaction.commit();
        expect(indexer.origin).toStrictEqual(expectedTable);
        expect(indexer.table).toStrictEqual(expectedTable);
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER);
        expect(store.rawData[`nest@${TEST_DBNAME}/${TEST_COLLECTION_NAME}/index.a>-c`]).toStrictEqual(expectedTable);
        done();
    }));
    test('ensure() > addItem() > removeItem()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const indexer = new indexer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            fields: ['a', '-c'],
            transaction,
            store,
        });
        yield indexer.ensure();
        yield transaction.commit();
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER);
        yield indexer.addItem({ [TEST_KEYNAME]: 'testkey1', a: 10, b: 20, c: 10 });
        yield indexer.addItem({ [TEST_KEYNAME]: 'testkey2', a: 6, b: 20, c: 30 });
        yield indexer.addItem({ [TEST_KEYNAME]: 'testkey3', a: 10, b: 20, c: 20 });
        yield transaction.commit();
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER);
        const originalTable = indexer.origin;
        const expectedTable = [
            { columnValues: [6, 30], keys: ['testkey2'] },
            { columnValues: [10, 10], keys: ['testkey1'] },
        ];
        yield indexer.removeItem({ [TEST_KEYNAME]: 'testkey3', a: 10, b: 20, c: 20 });
        expect(indexer.origin).toStrictEqual(originalTable);
        expect(indexer.table).toStrictEqual(expectedTable);
        yield transaction.commit();
        expect(indexer.origin).toStrictEqual(expectedTable);
        expect(indexer.table).toStrictEqual(expectedTable);
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER);
        expect(store.rawData[`nest@${TEST_DBNAME}/${TEST_COLLECTION_NAME}/index.a>-c`]).toStrictEqual(expectedTable);
        done();
    }));
    test('ensure() multiple > addItem()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const indexer1 = new indexer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            fields: [TEST_KEYNAME],
            transaction,
            store,
        });
        const indexer2 = new indexer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            fields: ['a', '-c'],
            transaction,
            store,
        });
        yield indexer1.ensure();
        yield indexer2.ensure();
        yield transaction.commit();
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER);
        const expectedTable1 = [
            { columnValues: ['testkey1'], keys: ['testkey1'] },
            { columnValues: ['testkey2'], keys: ['testkey2'] },
            { columnValues: ['testkey3'], keys: ['testkey3'] },
        ];
        const expectedTable2 = [
            { columnValues: [6, 30], keys: ['testkey2'] },
            { columnValues: [10, 20], keys: ['testkey3'] },
            { columnValues: [10, 10], keys: ['testkey1'] },
        ];
        yield indexer1.addItem({ [TEST_KEYNAME]: 'testkey1', a: 10, b: 20, c: 10 });
        yield indexer1.addItem({ [TEST_KEYNAME]: 'testkey2', a: 6, b: 20, c: 30 });
        yield indexer1.addItem({ [TEST_KEYNAME]: 'testkey3', a: 10, b: 20, c: 20 });
        expect(indexer1.origin).toStrictEqual([]);
        expect(indexer1.table).toStrictEqual(expectedTable1);
        yield indexer2.addItem({ [TEST_KEYNAME]: 'testkey1', a: 10, b: 20, c: 10 });
        yield indexer2.addItem({ [TEST_KEYNAME]: 'testkey2', a: 6, b: 20, c: 30 });
        yield indexer2.addItem({ [TEST_KEYNAME]: 'testkey3', a: 10, b: 20, c: 20 });
        expect(indexer2.origin).toStrictEqual([]);
        expect(indexer2.table).toStrictEqual(expectedTable2);
        yield transaction.commit();
        expect(indexer1.origin).toStrictEqual(expectedTable1);
        expect(indexer1.table).toStrictEqual(expectedTable1);
        expect(indexer2.origin).toStrictEqual(expectedTable2);
        expect(indexer2.table).toStrictEqual(expectedTable2);
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER);
        expect(store.rawData[`nest@${TEST_DBNAME}/${TEST_COLLECTION_NAME}/index.${TEST_KEYNAME}`]).toStrictEqual(expectedTable1);
        expect(store.rawData[`nest@${TEST_DBNAME}/${TEST_COLLECTION_NAME}/index.a>-c`]).toStrictEqual(expectedTable2);
        done();
    }));
    test('ensure() multiple > addItem() > removeItem()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const indexer1 = new indexer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            fields: [TEST_KEYNAME],
            transaction,
            store,
        });
        const indexer2 = new indexer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            fields: ['a', '-c'],
            transaction,
            store,
        });
        yield indexer1.ensure();
        yield indexer2.ensure();
        yield transaction.commit();
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER);
        yield indexer1.addItem({ [TEST_KEYNAME]: 'testkey1', a: 10, b: 20, c: 10 });
        yield indexer1.addItem({ [TEST_KEYNAME]: 'testkey2', a: 6, b: 20, c: 30 });
        yield indexer1.addItem({ [TEST_KEYNAME]: 'testkey3', a: 10, b: 20, c: 20 });
        yield indexer2.addItem({ [TEST_KEYNAME]: 'testkey1', a: 10, b: 20, c: 10 });
        yield indexer2.addItem({ [TEST_KEYNAME]: 'testkey2', a: 6, b: 20, c: 30 });
        yield indexer2.addItem({ [TEST_KEYNAME]: 'testkey3', a: 10, b: 20, c: 20 });
        yield transaction.commit();
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER);
        const originalTable1 = indexer1.origin;
        const expectedTable1 = [
            { columnValues: ['testkey1'], keys: ['testkey1'] },
            { columnValues: ['testkey2'], keys: ['testkey2'] },
        ];
        const originalTable2 = indexer2.origin;
        const expectedTable2 = [
            { columnValues: [6, 30], keys: ['testkey2'] },
            { columnValues: [10, 10], keys: ['testkey1'] },
        ];
        yield indexer1.removeItem({ [TEST_KEYNAME]: 'testkey3', a: 10, b: 20, c: 20 });
        expect(indexer1.origin).toStrictEqual(originalTable1);
        expect(indexer1.table).toStrictEqual(expectedTable1);
        yield indexer2.removeItem({ [TEST_KEYNAME]: 'testkey3', a: 10, b: 20, c: 20 });
        expect(indexer2.origin).toStrictEqual(originalTable2);
        expect(indexer2.table).toStrictEqual(expectedTable2);
        yield transaction.commit();
        expect(indexer1.origin).toStrictEqual(expectedTable1);
        expect(indexer1.table).toStrictEqual(expectedTable1);
        expect(indexer2.origin).toStrictEqual(expectedTable2);
        expect(indexer2.table).toStrictEqual(expectedTable2);
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER);
        expect(store.rawData[`nest@${TEST_DBNAME}/${TEST_COLLECTION_NAME}/index.${TEST_KEYNAME}`]).toStrictEqual(expectedTable1);
        expect(store.rawData[`nest@${TEST_DBNAME}/${TEST_COLLECTION_NAME}/index.a>-c`]).toStrictEqual(expectedTable2);
        done();
    }));
});
//# sourceMappingURL=indexer.test.js.map