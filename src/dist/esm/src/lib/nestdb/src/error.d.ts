/** Error code guideline
 *
 *  The error code of NestDB is a 8-digit number starting from `6`.
 *  The code is declared by the criteria as below:
 *
 *  6[xx][yy][zzz]
 *
 *  - `xx` indicates the place where the error occurs.
 *    00 (everywhere), 10 (store), 20 (database), 30 (collection), 40 (block), 50 (indexer), 60 (cache), 90 (elsewhere)
 *  - `yy` indicates the categorized reason.
 *    00 (unknown), 01 (undefined or not ready), 02 (invalid), 03 (not authorized), 04 (not found), 09 (duplicate), 17 (failure)
 *  - `zzz` indicates the error number in the place/category.
 */
export declare enum ErrorCode {
    UNKNOWN_ERROR = 60000000,
    STORE_NOT_DEFINED = 61001000,
    STORE_NOT_AVAILABLE = 61001001,
    STORE_NOT_AVAILABLE_IN_PRIVATE_BROWSING = 61001002,
    STORE_IS_FULL = 61001003,
    STORE_INVALID_KEY_TYPE = 61002000,
    STORE_BROKEN_INTEGRITY = 61002001,
    STORE_BROKEN_BLOB = 61002002,
    STORE_ITEM_SIZE_LIMIT_EXCEEDED = 61017000,
    STORE_READ_FAILED = 61017001,
    STORE_WRITE_FAILED = 61017002,
    DATABASE_SCHEMA_NOT_ON_UPGRADE = 62002000,
    COLLECTION_NOT_READY = 63001000,
    COLLECTION_KEY_NOT_MATCH = 63002000,
    COLLECTION_QUERY_NOT_VALID = 63002001,
    COLLECTION_KEY_NOT_FOUND = 63004000,
    COLLECTION_KEY_NOT_GIVEN = 63004001,
    COLLECTION_INSERT_DUPLICATE = 63009000,
    COLLECTION_WRITE_FAILED = 63017000,
    COLLECTION_ITEM_SIZE_LIMIT_EXCEEDED = 63017001,
    INDEX_TABLE_IS_REQUIRED = 65001000,
    INDEX_TYPE_NOT_MATCH = 65002000,
    COMPARE_TYPE_NOT_MATCH = 69002001,
    CIRCULAR_REFERENCE_FOUND = 69002002
}
interface NestDBErrorParams {
    code: ErrorCode;
    message: string;
}
export default class NestDBError extends Error {
    code: ErrorCode;
    constructor({ code, message }: NestDBErrorParams);
    static get storeNotDefined(): NestDBError;
    static get storeNotAvailable(): NestDBError;
    static get storeNotAvailableInPrivateBrowsing(): NestDBError;
    static get storeIsFull(): NestDBError;
    static get storeKeyTypeIsInvalid(): NestDBError;
    static get storeBrokenIntegrity(): NestDBError;
    static get storeBrokenBlob(): NestDBError;
    static get storeItemSizeExceeded(): NestDBError;
    static get storeReadFailed(): NestDBError;
    static get storeWriteFailed(): NestDBError;
    static get databaseSchemaNotOnUpgrade(): NestDBError;
    static get collectionNotReady(): NestDBError;
    static get collectionKeyNotMatch(): NestDBError;
    static get collectionQueryNotValid(): NestDBError;
    static get collectionInsertDuplicate(): NestDBError;
    static get collectionKeyNotFound(): NestDBError;
    static get collectionKeyNotGiven(): NestDBError;
    static get collectionWriteFailed(): NestDBError;
    static get collectionItemSizeExceeded(): NestDBError;
    static get indexTableIsRequired(): NestDBError;
    static get indexTypesNotMatch(): NestDBError;
    static get compareTypesNotMatch(): NestDBError;
    static get circularReferenceFound(): NestDBError;
}
export {};
