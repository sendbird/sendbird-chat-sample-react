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
const manager_1 = require("../../../src/lib/block/manager");
const cache_1 = require("../../../src/lib/cache");
const transaction_1 = require("../../../src/lib/transaction");
const memoryStore_1 = require("../../../src/store/memoryStore");
const util_1 = require("../../../src/util");
const TEST_DBNAME = 'testdb';
const TEST_COLLECTION_NAME = 'TestCollection';
const TEST_KEYNAME = 'key';
const TEST_TRANSACTION_APPLY_DELAY = 10;
const TEST_STORE_ITEM_SIZE_LIMIT = 20 * 1024 * 1024;
const TEST_BLOCK_LIMIT = 5;
const TEST_BLOCK_HASH_BASE = 10;
const TEST_BLOCK_HASH_MULTIPLIER = 2;
const TEST_BLOCK_HASH_CONSTANT = 1;
describe('[integrate] lib/block/manager', () => {
    new config_1.default({
        dbname: TEST_DBNAME,
        itemSizeLimit: TEST_STORE_ITEM_SIZE_LIMIT / TEST_BLOCK_LIMIT,
        transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY,
    });
    const cache = new cache_1.default({ dbname: TEST_DBNAME });
    const store = new memoryStore_1.default({ itemSizeLimit: TEST_STORE_ITEM_SIZE_LIMIT });
    const transaction = new transaction_1.default({
        dbname: TEST_DBNAME,
        collectionName: TEST_COLLECTION_NAME,
        store,
    });
    const metadata = {
        keyName: TEST_KEYNAME,
        blockLevel: 1,
        blockHashBase: TEST_BLOCK_HASH_BASE,
        blockHashMultiplier: TEST_BLOCK_HASH_MULTIPLIER,
        blockHashConstant: TEST_BLOCK_HASH_CONSTANT,
        indexes: [],
    };
    const blockManager = new manager_1.default({
        dbname: TEST_DBNAME,
        collectionName: TEST_COLLECTION_NAME,
        metadata,
        transaction,
        store,
    });
    beforeAll((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield store.init(TEST_DBNAME);
        yield transaction.init();
        done();
    }));
    beforeEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY);
        metadata.blockLevel = 1;
        yield store.clear();
        cache.clear(true);
        done();
    }));
    test('createBlockId()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        expect(blockManager.createBlockId('abcd')).toBe('nest@testdb/TestCollection/block.1.20');
        expect(blockManager.createBlockId('abcd', 1)).toBe('nest@testdb/TestCollection/block.1.20');
        expect(blockManager.createBlockId('abcd', 2)).toBe('nest@testdb/TestCollection/block.2.8');
        done();
    }));
    test('putToBlock() > commit() > getFromBlock()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const data = { key: 'abcd', a: 10, b: 20 };
        expect(yield blockManager.putToBlock(data.key, data)).toBeTruthy();
        yield transaction.commit();
        expect(yield blockManager.getFromBlock(data.key)).toStrictEqual(data);
        done();
    }));
    test('putToBlock() x2 > commit() > getFromBlock()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const data1 = { key: 'abcd', a: 10, b: 20 };
        expect(yield blockManager.putToBlock(data1.key, data1)).toBeTruthy();
        const data2 = { key: 'abcd', a: 10, b: 25 };
        expect(yield blockManager.putToBlock(data2.key, data2)).toBeTruthy();
        yield transaction.commit();
        expect(yield blockManager.getFromBlock(data1.key)).toStrictEqual(data2);
        done();
    }));
    test('putToBlock() > removeFromBlock() > commit() > getFromBlock()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const data = { key: 'abcd', a: 10, b: 20 };
        expect(yield blockManager.putToBlock(data.key, data)).toBeTruthy();
        expect(yield blockManager.removeFromBlock(data.key)).toBeTruthy();
        yield transaction.commit();
        expect(yield blockManager.getFromBlock(data.key)).toBeNull();
        done();
    }));
    test('putToBlock() > commit() > putToBlock() > commit() > getFromBlock()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const data1 = { key: 'abcd', a: 10, b: 20 };
        expect(yield blockManager.putToBlock(data1.key, data1)).toBeTruthy();
        yield transaction.commit();
        const data2 = { key: 'abcd', a: 10, b: 25 };
        expect(yield blockManager.putToBlock(data2.key, data2)).toBeTruthy();
        expect(yield blockManager.getFromBlock(data1.key)).toStrictEqual(data2);
        done();
    }));
    test('putToBlock() > commit() > removeFromBlock() > commit() > getFromBlock()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const data = { key: 'abcd', a: 10, b: 20 };
        expect(yield blockManager.putToBlock(data.key, data)).toBeTruthy();
        yield transaction.commit();
        expect(yield blockManager.removeFromBlock(data.key)).toBeTruthy();
        yield transaction.commit();
        expect(yield blockManager.getFromBlock(data.key)).toBeNull();
        done();
    }));
    test('putToBlock() overflow > level up > getFromBlock()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const items = [];
        for (let i = 0; i < 200; i++) {
            const data = { key: `item-${i}`, a: i + 1, b: 2 * i + 1 };
            items.push(data);
            const result = yield blockManager.putToBlock(data.key, data);
            if (!result) {
                metadata.blockLevel++;
                expect(yield blockManager.putToBlock(data.key, data)).toBeTruthy();
            }
        }
        yield transaction.commit();
        for (const item of items) {
            expect(yield blockManager.getFromBlock(item.key)).toStrictEqual(item);
        }
        done();
    }));
});
//# sourceMappingURL=block.manager.test.js.map