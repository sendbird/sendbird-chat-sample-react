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
const iterator_1 = require("./iterator");
const error_1 = require("../../error");
const DEFAULT_FETCH_OFFSET = 0;
class Query {
    constructor({ condition = {}, backward = false, mutex, blockManager, indexer, }) {
        this._mutex = mutex;
        this._iterator = new iterator_1.default({
            condition,
            backward,
            blockManager,
            indexer,
        });
    }
    fetch(params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let offset = Math.max(params.offset || DEFAULT_FETCH_OFFSET, 0);
            const limit = typeof params.limit === 'number'
                ? params.limit
                : Number.MAX_SAFE_INTEGER;
            if (limit === 0)
                return [];
            else if (limit < 0)
                throw error_1.default.collectionQueryNotValid;
            try {
                const result = [];
                yield this._mutex.lock();
                yield this._iterator.each((cursor) => __awaiter(this, void 0, void 0, function* () {
                    if (!cursor.error) {
                        if (cursor.hasNext) {
                            if (offset === 0) {
                                result.push(cursor.nextValue);
                                if (0 < limit && limit <= result.length) {
                                    cursor.stop();
                                }
                                else
                                    cursor.next();
                            }
                            else {
                                offset--;
                                cursor.next();
                            }
                        }
                        else {
                            cursor.stop();
                        }
                    }
                    else {
                        cursor.stop();
                    }
                }));
                this._mutex.unlock();
                return result;
            }
            catch (err) {
                this._mutex.unlock();
                throw err;
            }
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = 0;
                yield this._mutex.lock();
                yield this._iterator.each((cursor) => __awaiter(this, void 0, void 0, function* () {
                    if (!cursor.error) {
                        if (cursor.hasNext) {
                            result++;
                            cursor.next();
                        }
                        else {
                            cursor.stop();
                        }
                    }
                    else {
                        cursor.stop();
                    }
                }));
                this._mutex.unlock();
                return result;
            }
            catch (err) {
                this._mutex.unlock();
                throw err;
            }
        });
    }
}
exports.default = Query;
//# sourceMappingURL=index.js.map