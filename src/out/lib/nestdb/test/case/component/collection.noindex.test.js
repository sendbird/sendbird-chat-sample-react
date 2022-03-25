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
const collection_1 = require("../../../src/component/collection");
const cache_1 = require("../../../src/lib/cache");
const memoryStore_1 = require("../../../src/store/memoryStore");
const util_1 = require("../../../src/util");
const keygen_1 = require("../../../src/util/keygen");
const error_1 = require("../../../src/error");
const TEST_DBNAME = 'testdb';
const TEST_COLLECTION_NAME = 'TestCollection';
const TEST_KEYNAME = 'key';
const TEST_BLOCK_HASH_BASE = 10;
const TEST_BLOCK_HASH_MULTIPLIER = 2;
const TEST_BLOCK_HASH_CONSTANT = 3;
const TEST_ITEMS = 50;
const TEST_TRANSACTION_APPLY_DELAY = 10;
const TEST_TRANSACTION_APPLY_DELAY_BUFFER = 30;
describe('[e2e] component/collection', () => {
    new config_1.default({
        dbname: TEST_DBNAME,
        blockHashBase: TEST_BLOCK_HASH_BASE,
        blockHashMultiplier: TEST_BLOCK_HASH_MULTIPLIER,
        blockHashConstant: TEST_BLOCK_HASH_CONSTANT,
        transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY,
    });
    const cache = new cache_1.default({ dbname: TEST_DBNAME });
    const store = new memoryStore_1.default({});
    const waitToApplyCommit = () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER); });
    beforeAll((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield store.init(TEST_DBNAME);
        done();
    }));
    beforeEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield waitToApplyCommit();
        yield store.clear();
        cache.clear(true);
        done();
    }));
    test('init()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        yield waitToApplyCommit();
        expect(store.rawData[(0, keygen_1.createCollectionMetadataKey)(TEST_DBNAME, TEST_COLLECTION_NAME)]).toStrictEqual({
            keyName: TEST_KEYNAME,
            blockLevel: 1,
            blockHashBase: TEST_BLOCK_HASH_BASE,
            blockHashMultiplier: TEST_BLOCK_HASH_MULTIPLIER,
            blockHashConstant: TEST_BLOCK_HASH_CONSTANT,
            indexes: [['key']],
        });
        done();
    }));
    test('insertOne() > getByKey() before apply', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const item = {
            key: 'abc123',
            a: 10,
            b: 20,
        };
        expect(yield col.insertOne(item)).toStrictEqual(item);
        const result = yield col.getByKey(item.key);
        expect(result).toStrictEqual(item);
        done();
    }));
    test('insertOne() > getByKey() after apply', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const item = {
            key: 'abc123',
            a: 10,
            b: 20,
        };
        expect(yield col.insertOne(item)).toStrictEqual(item);
        yield waitToApplyCommit();
        const result = yield col.getByKey(item.key);
        expect(result).toStrictEqual(item);
        done();
    }));
    test('insertOne() > insertOne() duplicate before apply > getByKey()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const item = {
            key: 'abc123',
            a: 10,
            b: 20,
        };
        expect(yield col.insertOne(item)).toStrictEqual(item);
        try {
            yield col.insertOne(Object.assign(Object.assign({}, item), { a: 12 }));
            done(new Error('Should throw an error.'));
        }
        catch (err) {
            expect(err.code).toBe(error_1.ErrorCode.COLLECTION_INSERT_DUPLICATE);
            const result = yield col.getByKey(item.key);
            expect(result).toStrictEqual(item);
            done();
        }
    }));
    test('insertOne() > insertOne() duplicate after apply > getByKey()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const item = {
            key: 'abc123',
            a: 10,
            b: 20,
        };
        expect(yield col.insertOne(item)).toStrictEqual(item);
        yield waitToApplyCommit();
        try {
            yield col.insertOne(Object.assign(Object.assign({}, item), { a: 12 }));
            done(new Error('Should throw an error.'));
        }
        catch (err) {
            expect(err.code).toBe(error_1.ErrorCode.COLLECTION_INSERT_DUPLICATE);
            const result = yield col.getByKey(item.key);
            expect(result).toStrictEqual(item);
            done();
        }
    }));
    test('insertOne() circular reference > getByKey()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const item1 = {
            key: 'abc123',
            a: 10,
            b: 20,
        };
        const item2 = {};
        item2['c'] = item1;
        item1['c'] = item2;
        try {
            yield col.insertOne(item1);
        }
        catch (err) {
            expect(err.code).toBe(error_1.ErrorCode.CIRCULAR_REFERENCE_FOUND);
            const result = yield col.getByKey(item1.key);
            expect(result).toBeNull();
            done();
        }
    }));
    test('insertOne() > contaminate memory > getByKey()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const item = {
            key: 'abc123',
            a: 10,
            b: 20,
        };
        expect(yield col.insertOne(item)).toStrictEqual(item);
        yield waitToApplyCommit();
        item['a'] = 20;
        const result = yield col.getByKey(item.key);
        expect(result).toStrictEqual(Object.assign(Object.assign({}, item), { a: 10 }));
        done();
    }));
    test('insertMany() > getByKey() each before apply', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const items = [];
        for (let i = 0; i < TEST_ITEMS; i++) {
            items.push({
                key: `test-${i}`,
                a: i + 1,
                b: 2 * i + 1,
            });
        }
        expect(yield col.insertMany(items)).toStrictEqual(items);
        for (let item of items) {
            const result = yield col.getByKey(item.key);
            expect(result).toStrictEqual(item);
        }
        done();
    }));
    test('insertMany() > getByKey() each after apply', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const items = [];
        for (let i = 0; i < TEST_ITEMS; i++) {
            items.push({
                key: `test-${i}`,
                a: i + 1,
                b: 2 * i + 1,
            });
        }
        expect(yield col.insertMany(items)).toStrictEqual(items);
        yield waitToApplyCommit();
        for (let item of items) {
            const result = yield col.getByKey(item.key);
            expect(result).toStrictEqual(item);
        }
        done();
    }));
    test('insertMany() > query() no filter > fetch()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const items = [];
        for (let i = 0; i < TEST_ITEMS; i++) {
            items.push({
                key: `test-${i}`,
                a: i + 1,
                b: 2 * i + 1,
            });
        }
        expect(yield col.insertMany(items)).toStrictEqual(items);
        const query = col.query();
        const results = yield query.fetch({ limit: 20 });
        expect(results).toStrictEqual([...items].sort((a, b) => a.key.localeCompare(b.key)).slice(0, 20));
        done();
    }));
    test('insertMany() > query() filter > fetch()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const items = [];
        for (let i = 0; i < TEST_ITEMS; i++) {
            items.push({
                key: `test-${i}`,
                a: (i + 1) % 3,
                b: 2 * i + 1,
            });
        }
        expect(yield col.insertMany(items)).toStrictEqual(items);
        const query = col.query({
            where: {
                a: 0,
            }
        });
        const results = yield query.fetch({ limit: 20 });
        expect(results).toStrictEqual([...items]
            .filter(item => item.a === 0)
            .sort((a, b) => a.key.localeCompare(b.key))
            .slice(0, 20));
        done();
    }));
    test('upsertOne() > getByKey() before apply', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const item = {
            key: 'abc123',
            a: 10,
            b: 20,
        };
        expect(yield col.upsertOne(item)).toStrictEqual(item);
        const result = yield col.getByKey(item.key);
        expect(result).toStrictEqual(item);
        done();
    }));
    test('upsertOne() > getByKey() after apply', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const item = {
            key: 'abc123',
            a: 10,
            b: 20,
        };
        expect(yield col.upsertOne(item)).toStrictEqual(item);
        yield waitToApplyCommit();
        const result = yield col.getByKey(item.key);
        expect(result).toStrictEqual(item);
        done();
    }));
    test('upsertOne() > upsertOne() duplicate before apply > getByKey()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const item = {
            key: 'abc123',
            a: 10,
            b: 20,
        };
        expect(yield col.upsertOne(item)).toStrictEqual(item);
        yield col.upsertOne(Object.assign(Object.assign({}, item), { a: 12 }));
        const result = yield col.getByKey(item.key);
        expect(result).toStrictEqual(Object.assign(Object.assign({}, item), { a: 12 }));
        done();
    }));
    test('upsertOne() > upsertOne() duplicate after apply > getByKey()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const item = {
            key: 'abc123',
            a: 10,
            b: 20,
        };
        expect(yield col.upsertOne(item)).toStrictEqual(item);
        yield waitToApplyCommit();
        yield col.upsertOne(Object.assign(Object.assign({}, item), { a: 12 }));
        const result = yield col.getByKey(item.key);
        expect(result).toStrictEqual(Object.assign(Object.assign({}, item), { a: 12 }));
        done();
    }));
    test('upsertOne() circular reference > getByKey()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const item1 = {
            key: 'abc123',
            a: 10,
            b: 20,
        };
        const item2 = {};
        item2['c'] = item1;
        item1['c'] = item2;
        try {
            yield col.upsertOne(item1);
        }
        catch (err) {
            expect(err.code).toBe(error_1.ErrorCode.CIRCULAR_REFERENCE_FOUND);
            const result = yield col.getByKey(item1.key);
            expect(result).toBeNull();
            done();
        }
    }));
    test('upsertOne() > contaminate memory > getByKey()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const item = {
            key: 'abc123',
            a: 10,
            b: 20,
        };
        expect(yield col.upsertOne(item)).toStrictEqual(item);
        yield waitToApplyCommit();
        item['a'] = 20;
        const result = yield col.getByKey(item.key);
        expect(result).toStrictEqual(Object.assign(Object.assign({}, item), { a: 10 }));
        done();
    }));
    test('upsertMany() > getByKey() each before apply', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const items = [];
        for (let i = 0; i < TEST_ITEMS; i++) {
            items.push({
                key: `test-${i}`,
                a: i + 1,
                b: 2 * i + 1,
            });
        }
        expect(yield col.upsertMany(items)).toStrictEqual(items);
        for (let item of items) {
            const result = yield col.getByKey(item.key);
            expect(result).toStrictEqual(item);
        }
        done();
    }));
    test('upsertMany() > getByKey() each after apply', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const items = [];
        for (let i = 0; i < TEST_ITEMS; i++) {
            items.push({
                key: `test-${i}`,
                a: i + 1,
                b: 2 * i + 1,
            });
        }
        expect(yield col.upsertMany(items)).toStrictEqual(items);
        yield waitToApplyCommit();
        for (let item of items) {
            const result = yield col.getByKey(item.key);
            expect(result).toStrictEqual(item);
        }
        done();
    }));
    test('upsertMany() > query() no filter > fetch()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const items = [];
        for (let i = 0; i < TEST_ITEMS; i++) {
            items.push({
                key: `test-${i}`,
                a: i + 1,
                b: 2 * i + 1,
            });
        }
        expect(yield col.upsertMany(items)).toStrictEqual(items);
        const query = col.query();
        const results = yield query.fetch({ limit: 20 });
        expect(results).toStrictEqual([...items].sort((a, b) => a.key.localeCompare(b.key)).slice(0, 20));
        done();
    }));
    test('upsertMany() > query() filter > fetch()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const items = [];
        for (let i = 0; i < 100; i++) {
            items.push({
                key: `test-${i}`,
                a: (i + 1) % 3,
                b: 2 * i + 1,
            });
        }
        expect(yield col.upsertMany(items)).toStrictEqual(items);
        const query = col.query({
            where: {
                a: 0,
            }
        });
        const results = yield query.fetch({ limit: 20 });
        expect(results).toStrictEqual([...items]
            .filter(item => item.a === 0)
            .sort((a, b) => a.key.localeCompare(b.key))
            .slice(0, 20));
        done();
    }));
    test('insertMany() > update() before apply > getByKey()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const items = [];
        for (let i = 0; i < TEST_ITEMS; i++) {
            items.push({
                key: `test-${i}`,
                a: i + 1,
                b: 2 * i + 1,
            });
        }
        expect(yield col.insertMany(items)).toStrictEqual(items);
        const updatedItem = { key: 'test-3', a: 12 };
        expect(yield col.update(updatedItem)).toStrictEqual(updatedItem);
        const result = yield col.getByKey('test-3');
        expect(result).toStrictEqual(updatedItem);
        done();
    }));
    test('insertMany() > update() after apply > getByKey()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const items = [];
        for (let i = 0; i < TEST_ITEMS; i++) {
            items.push({
                key: `test-${i}`,
                a: i + 1,
                b: 2 * i + 1,
            });
        }
        expect(yield col.insertMany(items)).toStrictEqual(items);
        yield waitToApplyCommit();
        const updatedItem = { key: 'test-3', a: 12 };
        expect(yield col.update(updatedItem)).toStrictEqual(updatedItem);
        const result = yield col.getByKey('test-3');
        expect(result).toStrictEqual(updatedItem);
        done();
    }));
    test('insertMany() > updateIf() before apply > getByKey()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const items = [];
        for (let i = 0; i < TEST_ITEMS; i++) {
            items.push({
                key: `test-${i}`,
                a: (i + 1) % 4,
                b: 2 * i + 1,
            });
        }
        expect(yield col.insertMany(items)).toStrictEqual(items);
        const results = yield col.updateIf({
            a: 3,
        }, {
            set: {
                b: 14,
            }
        });
        expect(results.sort((a, b) => a['key'].localeCompare(b['key'])))
            .toStrictEqual(items.filter(item => item.a === 3).map(item => {
            return Object.assign(Object.assign({}, item), { b: 14 });
        })
            .sort((a, b) => a['key'].localeCompare(b['key'])));
        for (let item of items) {
            const result = yield col.getByKey(item.key);
            if (result['a'] === 3) {
                expect(result).toStrictEqual(Object.assign(Object.assign({}, item), { b: 14 }));
            }
            else {
                expect(result).toStrictEqual(item);
            }
        }
        done();
    }));
    test('insertMany() > updateIf() after apply > getByKey()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const items = [];
        for (let i = 0; i < TEST_ITEMS; i++) {
            items.push({
                key: `test-${i}`,
                a: (i + 1) % 4,
                b: 2 * i + 1,
            });
        }
        expect(yield col.insertMany(items)).toStrictEqual(items);
        const results = yield col.updateIf({
            a: 3,
        }, {
            set: {
                b: 14,
            }
        });
        yield waitToApplyCommit();
        expect(results.sort((a, b) => a['key'].localeCompare(b['key'])))
            .toStrictEqual(items.filter(item => item.a === 3).map(item => {
            return Object.assign(Object.assign({}, item), { b: 14 });
        })
            .sort((a, b) => a['key'].localeCompare(b['key'])));
        for (let item of items) {
            const result = yield col.getByKey(item.key);
            if (result['a'] === 3) {
                expect(result).toStrictEqual(Object.assign(Object.assign({}, item), { b: 14 }));
            }
            else {
                expect(result).toStrictEqual(item);
            }
        }
        done();
    }));
    test('insertMany() > remove() before apply > getByKey()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const items = [];
        for (let i = 0; i < TEST_ITEMS; i++) {
            items.push({
                key: `test-${i}`,
                a: i + 1,
                b: 2 * i + 1,
            });
        }
        expect(yield col.insertMany(items)).toStrictEqual(items);
        yield col.remove('test-3');
        const result = yield col.getByKey('test-3');
        expect(result).toBeNull();
        done();
    }));
    test('insertMany() > remove() after apply > getByKey()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const items = [];
        for (let i = 0; i < TEST_ITEMS; i++) {
            items.push({
                key: `test-${i}`,
                a: i + 1,
                b: 2 * i + 1,
            });
        }
        expect(yield col.insertMany(items)).toStrictEqual(items);
        yield waitToApplyCommit();
        yield col.remove('test-3');
        const result = yield col.getByKey('test-3');
        expect(result).toBeNull();
        done();
    }));
    test('insertMany() > removeIf() before apply > getByKey()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const items = [];
        for (let i = 0; i < TEST_ITEMS; i++) {
            items.push({
                key: `test-${i}`,
                a: (i + 1) % 3,
                b: 2 * i + 1,
            });
        }
        expect(yield col.insertMany(items)).toStrictEqual(items);
        const result = yield col.removeIf({ a: 1 });
        expect(result.sort((a, b) => a.localeCompare(b)))
            .toStrictEqual(items.filter(item => item.a === 1)
            .map(item => item.key)
            .sort((a, b) => a.localeCompare(b)));
        for (let item of items) {
            const result = yield col.getByKey(item.key);
            if (item['a'] === 1) {
                expect(result).toBeNull();
            }
            else {
                expect(result).toStrictEqual(item);
            }
        }
        done();
    }));
    test('insertMany() > removeIf() after apply > getByKey()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const col = new collection_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            keyName: TEST_KEYNAME,
            indexes: [],
            store,
        });
        yield col.init();
        const items = [];
        for (let i = 0; i < TEST_ITEMS; i++) {
            items.push({
                key: `test-${i}`,
                a: (i + 1) % 3,
                b: 2 * i + 1,
            });
        }
        expect(yield col.insertMany(items)).toStrictEqual(items);
        yield waitToApplyCommit();
        const result = yield col.removeIf({ a: 1 });
        expect(result.sort((a, b) => a.localeCompare(b)))
            .toStrictEqual(items.filter(item => item.a === 1)
            .map(item => item.key)
            .sort((a, b) => a.localeCompare(b)));
        for (let item of items) {
            const result = yield col.getByKey(item.key);
            if (item['a'] === 1) {
                expect(result).toBeNull();
            }
            else {
                expect(result).toStrictEqual(item);
            }
        }
        done();
    }));
});
//# sourceMappingURL=collection.noindex.test.js.map