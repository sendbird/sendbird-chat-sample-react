"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["UNKNOWN_ERROR"] = 60000000] = "UNKNOWN_ERROR";
    ErrorCode[ErrorCode["STORE_NOT_DEFINED"] = 61001000] = "STORE_NOT_DEFINED";
    ErrorCode[ErrorCode["STORE_NOT_AVAILABLE"] = 61001001] = "STORE_NOT_AVAILABLE";
    ErrorCode[ErrorCode["STORE_NOT_AVAILABLE_IN_PRIVATE_BROWSING"] = 61001002] = "STORE_NOT_AVAILABLE_IN_PRIVATE_BROWSING";
    ErrorCode[ErrorCode["STORE_IS_FULL"] = 61001003] = "STORE_IS_FULL";
    ErrorCode[ErrorCode["STORE_INVALID_KEY_TYPE"] = 61002000] = "STORE_INVALID_KEY_TYPE";
    ErrorCode[ErrorCode["STORE_BROKEN_INTEGRITY"] = 61002001] = "STORE_BROKEN_INTEGRITY";
    ErrorCode[ErrorCode["STORE_BROKEN_BLOB"] = 61002002] = "STORE_BROKEN_BLOB";
    ErrorCode[ErrorCode["STORE_ITEM_SIZE_LIMIT_EXCEEDED"] = 61017000] = "STORE_ITEM_SIZE_LIMIT_EXCEEDED";
    ErrorCode[ErrorCode["STORE_READ_FAILED"] = 61017001] = "STORE_READ_FAILED";
    ErrorCode[ErrorCode["STORE_WRITE_FAILED"] = 61017002] = "STORE_WRITE_FAILED";
    ErrorCode[ErrorCode["DATABASE_SCHEMA_NOT_ON_UPGRADE"] = 62002000] = "DATABASE_SCHEMA_NOT_ON_UPGRADE";
    ErrorCode[ErrorCode["COLLECTION_NOT_READY"] = 63001000] = "COLLECTION_NOT_READY";
    ErrorCode[ErrorCode["COLLECTION_KEY_NOT_MATCH"] = 63002000] = "COLLECTION_KEY_NOT_MATCH";
    ErrorCode[ErrorCode["COLLECTION_QUERY_NOT_VALID"] = 63002001] = "COLLECTION_QUERY_NOT_VALID";
    ErrorCode[ErrorCode["COLLECTION_KEY_NOT_FOUND"] = 63004000] = "COLLECTION_KEY_NOT_FOUND";
    ErrorCode[ErrorCode["COLLECTION_KEY_NOT_GIVEN"] = 63004001] = "COLLECTION_KEY_NOT_GIVEN";
    ErrorCode[ErrorCode["COLLECTION_INSERT_DUPLICATE"] = 63009000] = "COLLECTION_INSERT_DUPLICATE";
    ErrorCode[ErrorCode["COLLECTION_WRITE_FAILED"] = 63017000] = "COLLECTION_WRITE_FAILED";
    ErrorCode[ErrorCode["COLLECTION_ITEM_SIZE_LIMIT_EXCEEDED"] = 63017001] = "COLLECTION_ITEM_SIZE_LIMIT_EXCEEDED";
    ErrorCode[ErrorCode["INDEX_TABLE_IS_REQUIRED"] = 65001000] = "INDEX_TABLE_IS_REQUIRED";
    ErrorCode[ErrorCode["INDEX_TYPE_NOT_MATCH"] = 65002000] = "INDEX_TYPE_NOT_MATCH";
    ErrorCode[ErrorCode["COMPARE_TYPE_NOT_MATCH"] = 69002001] = "COMPARE_TYPE_NOT_MATCH";
    ErrorCode[ErrorCode["CIRCULAR_REFERENCE_FOUND"] = 69002002] = "CIRCULAR_REFERENCE_FOUND";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
class NestDBError extends Error {
    constructor({ code = ErrorCode.UNKNOWN_ERROR, message = 'Unknown error occurred.' }) {
        super(message);
        this.code = code;
    }
    static get storeNotDefined() {
        return new NestDBError({
            code: ErrorCode.STORE_NOT_DEFINED,
            message: 'Store is not defined. Specify the store on NestDB()',
        });
    }
    static get storeNotAvailable() {
        return new NestDBError({
            code: ErrorCode.STORE_NOT_AVAILABLE,
            message: 'Store is not available. Check your environment settings.',
        });
    }
    static get storeNotAvailableInPrivateBrowsing() {
        return new NestDBError({
            code: ErrorCode.STORE_NOT_AVAILABLE_IN_PRIVATE_BROWSING,
            message: 'Store is not available because it is in private browsing.',
        });
    }
    static get storeIsFull() {
        return new NestDBError({
            code: ErrorCode.STORE_IS_FULL,
            message: 'Store is full.',
        });
    }
    static get storeKeyTypeIsInvalid() {
        return new NestDBError({
            code: ErrorCode.STORE_INVALID_KEY_TYPE,
            message: 'Store key should be string type.',
        });
    }
    static get storeBrokenIntegrity() {
        return new NestDBError({
            code: ErrorCode.STORE_BROKEN_INTEGRITY,
            message: 'Data should be in a store but it does not. Integrity is broken.',
        });
    }
    static get storeBrokenBlob() {
        return new NestDBError({
            code: ErrorCode.STORE_BROKEN_BLOB,
            message: 'Data should be in a store but it does not. Blob data is broken.',
        });
    }
    static get storeItemSizeExceeded() {
        return new NestDBError({
            code: ErrorCode.STORE_ITEM_SIZE_LIMIT_EXCEEDED,
            message: 'The size of the item exceeds the limit that the store allows.',
        });
    }
    static get storeReadFailed() {
        return new NestDBError({
            code: ErrorCode.STORE_READ_FAILED,
            message: 'Failed to read from store.',
        });
    }
    static get storeWriteFailed() {
        return new NestDBError({
            code: ErrorCode.STORE_WRITE_FAILED,
            message: 'Failed to write to store.',
        });
    }
    static get databaseSchemaNotOnUpgrade() {
        return new NestDBError({
            code: ErrorCode.DATABASE_SCHEMA_NOT_ON_UPGRADE,
            message: 'Committing schema is not allowed when upgrade is not running.',
        });
    }
    static get collectionNotReady() {
        return new NestDBError({
            code: ErrorCode.COLLECTION_NOT_READY,
            message: 'Collection is not ready due to an error during initialization.',
        });
    }
    static get collectionKeyNotMatch() {
        return new NestDBError({
            code: ErrorCode.COLLECTION_KEY_NOT_MATCH,
            message: 'keyName of collection could not change.',
        });
    }
    static get collectionQueryNotValid() {
        return new NestDBError({
            code: ErrorCode.COLLECTION_QUERY_NOT_VALID,
            message: 'Query parameter is not a valid format.',
        });
    }
    static get collectionInsertDuplicate() {
        return new NestDBError({
            code: ErrorCode.COLLECTION_INSERT_DUPLICATE,
            message: 'The key already exists.',
        });
    }
    static get collectionKeyNotFound() {
        return new NestDBError({
            code: ErrorCode.COLLECTION_KEY_NOT_FOUND,
            message: 'The key is not found.',
        });
    }
    static get collectionKeyNotGiven() {
        return new NestDBError({
            code: ErrorCode.COLLECTION_KEY_NOT_GIVEN,
            message: 'The item should contain [keyName] property.',
        });
    }
    static get collectionWriteFailed() {
        return new NestDBError({
            code: ErrorCode.COLLECTION_WRITE_FAILED,
            message: 'Failed to write an item.',
        });
    }
    static get collectionItemSizeExceeded() {
        return new NestDBError({
            code: ErrorCode.COLLECTION_ITEM_SIZE_LIMIT_EXCEEDED,
            message: 'The size of the item exceeds the limit that a collection allows.',
        });
    }
    static get indexTableIsRequired() {
        return new NestDBError({
            code: ErrorCode.INDEX_TABLE_IS_REQUIRED,
            message: 'Index table is required.',
        });
    }
    static get indexTypesNotMatch() {
        return new NestDBError({
            code: ErrorCode.INDEX_TYPE_NOT_MATCH,
            message: 'Indexed column should have primitive type.',
        });
    }
    static get compareTypesNotMatch() {
        return new NestDBError({
            code: ErrorCode.COMPARE_TYPE_NOT_MATCH,
            message: 'Values to compare have different types.',
        });
    }
    static get circularReferenceFound() {
        return new NestDBError({
            code: ErrorCode.CIRCULAR_REFERENCE_FOUND,
            message: 'Cannot handle circular referenced object.',
        });
    }
}
exports.default = NestDBError;
//# sourceMappingURL=error.js.map