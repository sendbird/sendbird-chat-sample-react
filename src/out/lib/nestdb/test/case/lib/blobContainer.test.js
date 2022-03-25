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
const error_1 = require("../../../src/error");
const blobContainer_1 = require("../../../src/lib/blobContainer");
const nest_1 = require("../../../src/nest");
const keygen_1 = require("../../../src/util/keygen");
const TEST_DBNAME = 'testdb';
const TEST_COLLECTION_NAME = 'TestCollection';
describe('[unit] lib/blobContainer', () => {
    new config_1.default({ dbname: TEST_DBNAME });
    const store = new nest_1.MemoryStore({
        itemSizeLimit: 2048,
    });
    beforeAll((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield store.init(TEST_DBNAME);
        const failkey = (0, keygen_1.createBlobId)(TEST_DBNAME, TEST_COLLECTION_NAME, `5.plain/text.failed`, 2);
        store.observe(failkey, ['set'], () => new Error('Failed to write.'));
        done();
    }));
    beforeEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield store.clear();
        done();
    }));
    test('save() > get()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const data = 'laskdfjsafgiojwhegoajkhogkajsofkjaoekfjasodkgajwefkjasofkjawoefjawokjosakjgoawkjgoaskjgokasdgfvjaowejfgoaskdfoakwjgoksajk';
        const blob = new Blob([data], { type: 'plain/text' });
        const blobContainer = new blobContainer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            store,
        });
        const blobId = yield blobContainer.save(blob);
        const result = yield blobContainer.get(blobId);
        expect(result.size).toBe(data.length);
        expect(result.type).toBe('plain/text');
        done();
    }));
    test('save() sharded > get()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const data = 'laskdfjsafgiojwhegoajkhogkajsofkjaoekfjasodkgajwefkjasofkjawoefjawokjosakjgoawkjgoaskjgokasdgfvjaowejfgoaskdfoakwjgoksajk'.repeat(30);
        const blob = new Blob([data], { type: 'plain/text' });
        const blobContainer = new blobContainer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            store,
        });
        const blobId = yield blobContainer.save(blob);
        const result = yield blobContainer.get(blobId);
        expect(result.size).toBe(data.length);
        expect(result.type).toBe('plain/text');
        done();
    }));
    test('save() sharded failed', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const data = 'laskdfjsafgiojwhegoajkhogkajsofkjaoekfjasodkgajwefkjasofkjawoefjawokjosakjgoawkjgoaskjgokasdgfvjaowejfgoaskdfoakwjgoksajk'.repeat(30);
        const blob = new Blob([data], { type: 'plain/text' });
        const blobContainer = new blobContainer_1.default({
            dbname: TEST_DBNAME,
            collectionName: TEST_COLLECTION_NAME,
            store,
        });
        try {
            yield blobContainer.save(blob, 'failed');
            done(new Error('This should be an error.'));
        }
        catch (err) {
            expect(err.code).toBe(error_1.ErrorCode.STORE_WRITE_FAILED);
            done();
        }
    }));
});
//# sourceMappingURL=blobContainer.test.js.map