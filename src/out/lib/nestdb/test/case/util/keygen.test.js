"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keygen_1 = require("../../../src/util/keygen");
const DB_NAME = 'testdb';
const COLLECTION_NAME = 'testcollection';
describe('[unit] util/keygen', () => {
    test('createDatabaseMetadataKey()', () => {
        expect((0, keygen_1.createDatabaseMetadataKey)(DB_NAME)).toBe(`nest@${DB_NAME}.metadata`);
    });
    test('createCollectionMetadataKey()', () => {
        expect((0, keygen_1.createCollectionMetadataKey)(DB_NAME, COLLECTION_NAME)).toBe(`nest@${DB_NAME}/${COLLECTION_NAME}.metadata`);
    });
    test('createTransactionMetadataKey()', () => {
        expect((0, keygen_1.createTransactionMetadataKey)(DB_NAME, COLLECTION_NAME)).toBe(`nest@${DB_NAME}/${COLLECTION_NAME}/trans.metadata`);
    });
    test('createTransactionRecordsetKey()', () => {
        expect((0, keygen_1.createTransactionRecordsetKey)(DB_NAME, COLLECTION_NAME)).toBe(`nest@${DB_NAME}/${COLLECTION_NAME}/trans.recordset`);
    });
    test('createBlockManagerMetadataKey()', () => {
        expect((0, keygen_1.createBlockManagerMetadataKey)(DB_NAME, COLLECTION_NAME)).toBe(`nest@${DB_NAME}/${COLLECTION_NAME}/block.metadata`);
    });
    test('createBlockKeyPrefix()', () => {
        expect((0, keygen_1.createBlockKeyPrefix)(DB_NAME, COLLECTION_NAME)).toBe(`nest@${DB_NAME}/${COLLECTION_NAME}/block.`);
    });
    test('createBlockKey()', () => {
        expect((0, keygen_1.createBlockKey)(DB_NAME, COLLECTION_NAME, 1, 'abc')).toBe(`nest@${DB_NAME}/${COLLECTION_NAME}/block.1.abc`);
    });
    test('createBlobId()', () => {
        expect((0, keygen_1.createBlobId)(DB_NAME, COLLECTION_NAME, 'abc')).toBe(`nest@${DB_NAME}/${COLLECTION_NAME}/blob.abc.0`);
        expect((0, keygen_1.createBlobId)(DB_NAME, COLLECTION_NAME, 'abc', 1)).toBe(`nest@${DB_NAME}/${COLLECTION_NAME}/blob.abc.1`);
    });
});
//# sourceMappingURL=keygen.test.js.map