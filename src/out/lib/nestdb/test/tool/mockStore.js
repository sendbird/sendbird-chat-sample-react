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
const nest_1 = require("../../src/nest");
class MockStore extends nest_1.MemoryStore {
    constructor(params) {
        super();
        this._mockInit = params.init || null;
        this._mockGetAllKeys = params.getAllKeys || null;
        this._mockGet = params.get || null;
        this._mockSet = params.set || null;
        this._mockSetMany = params.setMany || null;
        this._mockRemove = params.remove || null;
        this._mockRemoveMany = params.removeMany || null;
        this._mockClear = params.clear || null;
    }
    init(dbname) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.init.call(this, dbname);
            if (this._mockInit)
                yield this._mockInit(dbname);
        });
    }
    getAllKeys() {
        const _super = Object.create(null, {
            getAllKeys: { get: () => super.getAllKeys }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return this._mockGetAllKeys ? yield this._mockGetAllKeys() : yield _super.getAllKeys.call(this);
        });
    }
    get(key) {
        const _super = Object.create(null, {
            get: { get: () => super.get }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return this._mockGet ? yield this._mockGet(key) : yield _super.get.call(this, key);
        });
    }
    set(item) {
        const _super = Object.create(null, {
            set: { get: () => super.set }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return this._mockSet ? yield this._mockSet(item) : yield _super.set.call(this, item);
        });
    }
    setMany(items) {
        const _super = Object.create(null, {
            setMany: { get: () => super.setMany }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return this._mockSetMany ? yield this._mockSetMany(items) : yield _super.setMany.call(this, items);
        });
    }
    remove(key) {
        const _super = Object.create(null, {
            remove: { get: () => super.remove }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return this._mockRemove ? yield this._mockRemove(key) : yield _super.remove.call(this, key);
        });
    }
    removeMany(keys) {
        const _super = Object.create(null, {
            removeMany: { get: () => super.removeMany }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return this._mockRemoveMany ? yield this._mockRemoveMany(keys) : yield _super.removeMany.call(this, keys);
        });
    }
    clear() {
        const _super = Object.create(null, {
            clear: { get: () => super.clear }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this._mockClear ? yield this._mockClear() : yield _super.clear.call(this);
        });
    }
}
exports.default = MockStore;
//# sourceMappingURL=mockStore.js.map