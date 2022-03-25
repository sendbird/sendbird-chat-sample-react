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
exports.CursorDirection = void 0;
const noop_1 = require("../../util/noop");
var CursorDirection;
(function (CursorDirection) {
    CursorDirection[CursorDirection["FORWARD"] = 0] = "FORWARD";
    CursorDirection[CursorDirection["BACKWARD"] = 1] = "BACKWARD";
})(CursorDirection = exports.CursorDirection || (exports.CursorDirection = {}));
class Cursor {
    constructor({ initialPrevValue = null, initialNextValue = null, iterator, map = noop_1.redirect, backward = noop_1.noopAsync, forward = noop_1.noopAsync, complete = noop_1.noop, }) {
        this._prevValue = initialPrevValue;
        this._nextValue = initialNextValue;
        this._error = null;
        this._map = map;
        this._backward = backward;
        this._forward = forward;
        this._iterator = iterator;
        this._complete = complete;
    }
    get prevValue() {
        return this._map(this._prevValue);
    }
    get nextValue() {
        return this._map(this._nextValue);
    }
    get error() {
        return this._error;
    }
    get hasPrevious() {
        return !!this._prevValue;
    }
    get hasNext() {
        return !!this._nextValue;
    }
    prev() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasPrevious) {
                try {
                    const originalPrevValue = this._prevValue;
                    this._prevValue = (yield this._backward()) || null;
                    this._nextValue = originalPrevValue;
                }
                catch (err) {
                    this._error = err;
                }
                return yield this._iterator(this);
            }
            else {
                this._complete();
            }
        });
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasNext) {
                try {
                    const originalNextValue = this._nextValue;
                    this._nextValue = (yield this._forward()) || null;
                    this._prevValue = originalNextValue;
                }
                catch (err) {
                    this._error = err;
                }
                return yield this._iterator(this);
            }
            else {
                this._complete();
            }
        });
    }
    stop() {
        this._prevValue = null;
        this._nextValue = null;
        this._complete();
    }
}
exports.default = Cursor;
//# sourceMappingURL=index.js.map