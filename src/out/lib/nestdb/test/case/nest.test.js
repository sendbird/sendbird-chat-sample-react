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
const interface_1 = require("../../src/component/collection/interface");
const nest_1 = require("../../src/nest");
const error_1 = require("../../src/error");
const util_1 = require("../../src/util");
const uuid_1 = require("../../src/util/uuid");
const mockStore_1 = require("../tool/mockStore");
const TEST_COLLECTION_NAME = 'TestCollection';
const TEST_KEYNAME = 'tk';
const TEST_TRANSACTION_APPLY_DELAY = 10;
const TEST_TRANSACTION_APPLY_DELAY_BUFFER = 30;
describe('[e2e] nestdb', () => {
    const defaultConfig = new nest_1.Config({ dbname: `default-${(0, uuid_1.uuid)()}` });
    const store = new nest_1.MemoryStore({});
    let db = null;
    const waitToApplyCommit = () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, util_1.sleep)(TEST_TRANSACTION_APPLY_DELAY + TEST_TRANSACTION_APPLY_DELAY_BUFFER); });
    afterEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        if (db)
            yield db.reset();
        done();
    }));
    test('new', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const dbname = `testdb-${(0, uuid_1.uuid)()}`;
        const config = new nest_1.Config({ dbname, transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY });
        db = new nest_1.default({
            name: dbname,
            version: 1,
            config,
            store,
        });
        expect(db.name).toBe(dbname);
        expect(db.version).toBe(1);
        expect(db.state).toBe(nest_1.NestDBState.INIT);
        done();
    }));
    test('open()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const dbname = `testdb-${(0, uuid_1.uuid)()}`;
        const config = new nest_1.Config({ dbname, transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY });
        db = new nest_1.default({
            name: dbname,
            version: 1,
            config,
            store,
        });
        yield db.open();
        expect(db.name).toBe(dbname);
        expect(db.version).toBe(1);
        expect(db.state).toBe(nest_1.NestDBState.OPENED);
        expect(store.rawData).toStrictEqual({
            [`nest@${db.name}.metadata`]: {
                version: 1,
                collectionNames: [],
            }
        });
        done();
    }));
    test('open() duplicate', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const dbname = `testdb-${(0, uuid_1.uuid)()}`;
        const config = new nest_1.Config({ dbname, transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY });
        db = new nest_1.default({
            name: dbname,
            version: 1,
            config,
            store,
        });
        db.open()
            .then(() => {
            expect(db.name).toBe(dbname);
            expect(db.version).toBe(1);
            expect(db.state).toBe(nest_1.NestDBState.OPENED);
            expect(store.rawData).toStrictEqual({
                [`nest@${db.name}.metadata`]: {
                    version: 1,
                    collectionNames: [],
                }
            });
        })
            .catch(err => done(err));
        db.open()
            .then(() => {
            expect(db.name).toBe(dbname);
            expect(db.version).toBe(1);
            expect(db.state).toBe(nest_1.NestDBState.OPENED);
            expect(store.rawData).toStrictEqual({
                [`nest@${db.name}.metadata`]: {
                    version: 1,
                    collectionNames: [],
                }
            });
            done();
        })
            .catch(err => done(err));
    }));
    test('open() with upgrade', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const dbname = `testdb-${(0, uuid_1.uuid)()}`;
        const config = new nest_1.Config({ dbname, transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY });
        db = new nest_1.default({
            name: dbname,
            version: 1,
            config,
            store,
        });
        db.on('upgrade', (oldVersion, next) => __awaiter(void 0, void 0, void 0, function* () {
            switch (oldVersion) {
                case 0: {
                    yield db.commitSchema([
                        {
                            collectionName: TEST_COLLECTION_NAME,
                            keyName: TEST_KEYNAME,
                        }
                    ]);
                    break;
                }
            }
            next(null);
        }));
        yield db.open();
        yield waitToApplyCommit();
        expect(store.rawData[`nest@${dbname}.metadata`]).toStrictEqual({
            version: 1,
            collectionNames: [TEST_COLLECTION_NAME],
        });
        expect(store.rawData[`nest@${dbname}/${TEST_COLLECTION_NAME}.metadata`]).toStrictEqual({
            keyName: TEST_KEYNAME,
            blockLevel: 1,
            blockHashBase: defaultConfig.blockHashBase,
            blockHashMultiplier: defaultConfig.blockHashMultiplier,
            blockHashConstant: defaultConfig.blockHashConstant,
            indexes: [[TEST_KEYNAME]],
        });
        done();
    }));
    test('open() with upgrade duplicate keyname index', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const dbname = `testdb-${(0, uuid_1.uuid)()}`;
        const config = new nest_1.Config({ dbname, transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY });
        db = new nest_1.default({
            name: dbname,
            version: 1,
            config,
            store,
        });
        db.on('upgrade', (oldVersion, next) => __awaiter(void 0, void 0, void 0, function* () {
            switch (oldVersion) {
                case 0: {
                    yield db.commitSchema([
                        {
                            collectionName: TEST_COLLECTION_NAME,
                            keyName: TEST_KEYNAME,
                            index: [[TEST_KEYNAME]],
                        }
                    ]);
                    break;
                }
            }
            next(null);
        }));
        yield db.open();
        yield waitToApplyCommit();
        expect(store.rawData[`nest@${dbname}.metadata`]).toStrictEqual({
            version: 1,
            collectionNames: [TEST_COLLECTION_NAME],
        });
        expect(store.rawData[`nest@${dbname}/${TEST_COLLECTION_NAME}.metadata`]).toStrictEqual({
            keyName: TEST_KEYNAME,
            blockLevel: 1,
            blockHashBase: defaultConfig.blockHashBase,
            blockHashMultiplier: defaultConfig.blockHashMultiplier,
            blockHashConstant: defaultConfig.blockHashConstant,
            indexes: [[TEST_KEYNAME]],
        });
        done();
    }));
    test('open() with upgrade > success', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const dbname = `testdb-${(0, uuid_1.uuid)()}`;
        const config = new nest_1.Config({ dbname, transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY });
        const db = new nest_1.default({
            name: dbname,
            version: 1,
            config,
            store,
        });
        db.on('upgrade', (oldVersion, next) => __awaiter(void 0, void 0, void 0, function* () {
            switch (oldVersion) {
                case 0: {
                    yield db.commitSchema([
                        {
                            collectionName: TEST_COLLECTION_NAME,
                            keyName: TEST_KEYNAME,
                        }
                    ]);
                    break;
                }
            }
            next(null);
        }));
        db.on('success', () => {
            expect(store.rawData[`nest@${dbname}.metadata`]).toStrictEqual({
                version: 1,
                collectionNames: [TEST_COLLECTION_NAME],
            });
            expect(store.rawData[`nest@${dbname}/${TEST_COLLECTION_NAME}.metadata`]).toStrictEqual({
                keyName: TEST_KEYNAME,
                blockLevel: 1,
                blockHashBase: defaultConfig.blockHashBase,
                blockHashMultiplier: defaultConfig.blockHashMultiplier,
                blockHashConstant: defaultConfig.blockHashConstant,
                indexes: [[TEST_KEYNAME]],
            });
            done();
        });
        yield db.open();
    }));
    test('open() with upgrade > success > reset()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const dbname = `testdb-${(0, uuid_1.uuid)()}`;
        const config = new nest_1.Config({ dbname, transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY });
        const db = new nest_1.default({
            name: dbname,
            version: 1,
            config,
            store,
        });
        db.on('upgrade', (oldVersion, next) => __awaiter(void 0, void 0, void 0, function* () {
            switch (oldVersion) {
                case 0: {
                    yield db.commitSchema([
                        {
                            collectionName: TEST_COLLECTION_NAME,
                            keyName: TEST_KEYNAME,
                        }
                    ]);
                    break;
                }
            }
            next(null);
        }));
        db.on('success', () => __awaiter(void 0, void 0, void 0, function* () {
            yield db.reset();
            expect(store.rawData).toStrictEqual({});
            done();
        }));
        yield db.open();
    }));
    test('open() > close()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const dbname = `testdb-${(0, uuid_1.uuid)()}`;
        const config = new nest_1.Config({ dbname, transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY });
        db = new nest_1.default({
            name: dbname,
            version: 1,
            config,
            store,
        });
        db.on('upgrade', (oldVersion, next) => __awaiter(void 0, void 0, void 0, function* () {
            switch (oldVersion) {
                case 0: {
                    yield db.commitSchema([
                        {
                            collectionName: TEST_COLLECTION_NAME,
                            keyName: TEST_KEYNAME,
                        }
                    ]);
                    break;
                }
            }
            next(null);
        }));
        yield db.open();
        db.close();
        expect(db.state).toBe(nest_1.NestDBState.CLOSED);
        done();
    }));
    test('open() with storeNotAvailable error', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const dbname = `testdb-${(0, uuid_1.uuid)()}`;
        const config = new nest_1.Config({
            dbname,
            transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY,
            disableLogger: true,
        });
        const store = new mockStore_1.default({
            init: (dbname) => __awaiter(void 0, void 0, void 0, function* () {
                throw error_1.default.storeNotAvailable;
            }),
        });
        db = new nest_1.default({
            name: dbname,
            version: 1,
            config,
            store,
        });
        yield db.open();
        expect(db.name).toBe(dbname);
        expect(db.version).toBe(1);
        expect(db.state).toBe(nest_1.NestDBState.OPENED);
        expect(store.rawData).toStrictEqual({
            [`nest@${db.name}.metadata`]: {
                version: 1,
                collectionNames: [],
            }
        });
        done();
    }));
    test('open() with storeNotAvailableInPrivateBrowsing error', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const dbname = `testdb-${(0, uuid_1.uuid)()}`;
        const config = new nest_1.Config({
            dbname,
            transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY,
            disableLogger: true,
        });
        const store = new mockStore_1.default({
            init: (dbname) => __awaiter(void 0, void 0, void 0, function* () {
                throw error_1.default.storeNotAvailableInPrivateBrowsing;
            }),
        });
        db = new nest_1.default({
            name: dbname,
            version: 1,
            config,
            store,
        });
        yield db.open();
        expect(db.name).toBe(dbname);
        expect(db.version).toBe(1);
        expect(db.state).toBe(nest_1.NestDBState.OPENED);
        expect(store.rawData).toStrictEqual({
            [`nest@${db.name}.metadata`]: {
                version: 1,
                collectionNames: [],
            }
        });
        done();
    }));
    test('open() with other error', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const dbname = `testdb-${(0, uuid_1.uuid)()}`;
        const config = new nest_1.Config({
            dbname,
            transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY,
            disableLogger: true,
        });
        const store = new mockStore_1.default({
            init: (dbname) => __awaiter(void 0, void 0, void 0, function* () {
                throw error_1.default.storeIsFull;
            }),
        });
        db = new nest_1.default({
            name: dbname,
            version: 1,
            config,
            store,
        });
        try {
            yield db.open();
            done('It should be an error!');
        }
        catch (err) {
            done();
        }
    }));
    test('open() > collection()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const dbname = `testdb-${(0, uuid_1.uuid)()}`;
        const config = new nest_1.Config({ dbname, transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY });
        db = new nest_1.default({
            name: dbname,
            version: 1,
            config,
            store,
        });
        db.on('upgrade', (oldVersion, next) => __awaiter(void 0, void 0, void 0, function* () {
            switch (oldVersion) {
                case 0: {
                    yield db.commitSchema([
                        {
                            collectionName: TEST_COLLECTION_NAME,
                            keyName: TEST_KEYNAME,
                        }
                    ]);
                    break;
                }
            }
            next(null);
        }));
        yield db.open();
        const col = db.collection(TEST_COLLECTION_NAME);
        expect(col).not.toBeNull();
        expect(col.dbname).toBe(db.name);
        expect(col.name).toBe(TEST_COLLECTION_NAME);
        expect(col.keyName).toBe(TEST_KEYNAME);
        expect(col.state).toBe(interface_1.CollectionState.READY);
        done();
    }));
    test('open() > close() > collection()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const dbname = `testdb-${(0, uuid_1.uuid)()}`;
        const config = new nest_1.Config({ dbname, transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY });
        db = new nest_1.default({
            name: dbname,
            version: 1,
            config,
            store,
        });
        db.on('upgrade', (oldVersion, next) => __awaiter(void 0, void 0, void 0, function* () {
            switch (oldVersion) {
                case 0: {
                    yield db.commitSchema([
                        {
                            collectionName: TEST_COLLECTION_NAME,
                            keyName: TEST_KEYNAME,
                        }
                    ]);
                    break;
                }
            }
            next(null);
        }));
        yield db.open();
        db.close();
        const col = db.collection(TEST_COLLECTION_NAME);
        expect(col).not.toBeNull();
        expect(col.dbname).toBe(db.name);
        expect(col.name).toBe(TEST_COLLECTION_NAME);
        expect(col.keyName).toBe(TEST_KEYNAME);
        expect(col.state).toBe(interface_1.CollectionState.CLOSED);
        done();
    }));
    test('open() > close() > open() > collection()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const dbname = `testdb-${(0, uuid_1.uuid)()}`;
        const config = new nest_1.Config({ dbname, transactionApplyDelay: TEST_TRANSACTION_APPLY_DELAY });
        db = new nest_1.default({
            name: dbname,
            version: 1,
            config,
            store,
        });
        db.on('upgrade', (oldVersion, next) => __awaiter(void 0, void 0, void 0, function* () {
            switch (oldVersion) {
                case 0: {
                    yield db.commitSchema([
                        {
                            collectionName: TEST_COLLECTION_NAME,
                            keyName: TEST_KEYNAME,
                        }
                    ]);
                    break;
                }
            }
            next(null);
        }));
        yield db.open();
        db.close();
        yield db.open();
        const col = db.collection(TEST_COLLECTION_NAME);
        expect(col).not.toBeNull();
        expect(col.dbname).toBe(db.name);
        expect(col.name).toBe(TEST_COLLECTION_NAME);
        expect(col.keyName).toBe(TEST_KEYNAME);
        expect(col.state).toBe(interface_1.CollectionState.READY);
        done();
    }));
});
//# sourceMappingURL=nest.test.js.map