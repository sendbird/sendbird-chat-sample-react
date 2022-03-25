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
const match_1 = require("./match");
const cursor_1 = require("../../lib/cursor");
const util_1 = require("../../util");
class QueryIterator {
    constructor({ condition = {}, backward = false, blockManager, indexer, }) {
        this.condition = condition;
        this.backward = backward;
        this._blockManager = blockManager;
        this._indexer = indexer;
    }
    findOptimizedStartPosition() {
        const gteOps = ['=', '/eq', '>', '>=', '/gt', '/gte'];
        const lteOps = ['=', '/eq', '<', '<=', '/lt', '/lte'];
        if (!this.backward) {
            let start = 0;
            if (typeof this.condition !== 'function') {
                for (let fieldIndex = 0; fieldIndex < this._indexer.fields.length; fieldIndex++) {
                    let field = this._indexer.fields[fieldIndex];
                    let inverse = 1;
                    if (field[0] === '-') {
                        field = field.slice(1);
                        inverse = -1;
                    }
                    if (this.condition[field]) {
                        if (typeof this.condition[field] === 'object') {
                            Object.keys(this.condition[field]).forEach((op) => {
                                const ops = inverse > 0 ? gteOps : lteOps;
                                if (ops.includes(op)) {
                                    for (let i = start; i < this._indexer.origin.length; i++) {
                                        if (inverse * (0, util_1.compare)(this._indexer.origin[i].columnValues[fieldIndex], this.condition[field][op]) >= 0) {
                                            start = i;
                                            break;
                                        }
                                    }
                                }
                            });
                        }
                        else {
                            for (let i = start; i < this._indexer.origin.length; i++) {
                                if (inverse * (0, util_1.compare)(this._indexer.origin[i].columnValues[fieldIndex], this.condition[field]) >= 0) {
                                    start = i;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return Math.max(start - 1, 0);
        }
        else {
            let end = this._indexer.origin.length - 1;
            if (typeof this.condition !== 'function') {
                for (const fieldIndex in this._indexer.fields) {
                    let field = this._indexer.fields[fieldIndex];
                    let inverse = 1;
                    if (field[0] === '-') {
                        field = field.slice(1);
                        inverse = -1;
                    }
                    if (this.condition[field]) {
                        if (typeof this.condition[field] === 'object') {
                            const ops = inverse > 0 ? lteOps : gteOps;
                            for (const op in this.condition[field]) {
                                if (ops.includes(op)) {
                                    for (let i = end; i >= 0; i--) {
                                        if (inverse * (0, util_1.compare)(this._indexer.origin[i].columnValues[fieldIndex], this.condition[field][op]) <= 0) {
                                            end = i;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            for (let i = end; i >= 0; i--) {
                                if (inverse * (0, util_1.compare)(this._indexer.origin[i].columnValues[fieldIndex], this.condition[field]) <= 0) {
                                    end = i;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return Math.min(end + 1, this._indexer.origin.length - 1);
        }
    }
    each(iterator) {
        return __awaiter(this, void 0, void 0, function* () {
            let tableIndex = this.findOptimizedStartPosition();
            let keyIndex = 0;
            if (this.backward) {
                if (this._indexer.origin[tableIndex]) {
                    keyIndex = this._indexer.origin[tableIndex].keys.length - 1;
                }
            }
            const forwardIndex = () => {
                if (this._indexer.origin[tableIndex]) {
                    if (!this._indexer.origin[tableIndex].keys[++keyIndex]) {
                        if (this._indexer.origin[++tableIndex]) {
                            keyIndex = 0;
                        }
                        else
                            return false;
                    }
                    return true;
                }
                return false;
            };
            const backwardIndex = () => {
                if (this._indexer.origin[tableIndex]) {
                    if (!this._indexer.origin[tableIndex].keys[--keyIndex]) {
                        if (this._indexer.origin[--tableIndex]) {
                            keyIndex = this._indexer.origin[tableIndex].keys.length - 1;
                        }
                        else
                            return false;
                    }
                    return true;
                }
                return false;
            };
            let initialValue = null;
            if (this._indexer.origin[tableIndex]) {
                const progressIndex = !this.backward ? forwardIndex : backwardIndex;
                do {
                    const item = yield this._blockManager.getFromBlock(this._indexer.origin[tableIndex].keys[keyIndex]);
                    if ((0, match_1.match)(this.condition, item)) {
                        initialValue = item;
                        break;
                    }
                } while (progressIndex());
            }
            return yield new Promise((resolve) => {
                const cursor = new cursor_1.default({
                    initialNextValue: (0, util_1.clone)(initialValue),
                    iterator,
                    forward: () => __awaiter(this, void 0, void 0, function* () {
                        const progressIndex = !this.backward ? forwardIndex : backwardIndex;
                        while (progressIndex()) {
                            const item = yield this._blockManager.getFromBlock(this._indexer.origin[tableIndex].keys[keyIndex]);
                            if ((0, match_1.match)(this.condition, item))
                                return (0, util_1.clone)(item);
                        }
                        return null;
                    }),
                    backward: () => __awaiter(this, void 0, void 0, function* () {
                        const progressIndex = this.backward ? forwardIndex : backwardIndex;
                        while (progressIndex()) {
                            const item = yield this._blockManager.getFromBlock(this._indexer.origin[tableIndex].keys[keyIndex]);
                            if ((0, match_1.match)(this.condition, item))
                                return (0, util_1.clone)(item);
                        }
                        return null;
                    }),
                    complete: resolve,
                });
                iterator(cursor);
            });
        });
    }
}
exports.default = QueryIterator;
//# sourceMappingURL=iterator.js.map