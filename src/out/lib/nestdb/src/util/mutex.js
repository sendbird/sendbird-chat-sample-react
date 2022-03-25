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
const uuid_1 = require("./uuid");
class Mutex {
    constructor(key) {
        this._locked = false;
        this._resolvers = [];
        this.id = (0, uuid_1.uuid)();
        this.key = key;
    }
    get locked() {
        return this._locked;
    }
    wait() {
        return new Promise((resolve) => {
            this._resolvers.push(resolve);
        });
    }
    lock() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._locked)
                yield this.wait();
            this._locked = true;
        });
    }
    unlock() {
        if (this._locked) {
            if (this._resolvers.length > 0) {
                const next = this._resolvers.shift();
                next();
            }
            else
                this._locked = false;
        }
    }
}
exports.default = Mutex;
//# sourceMappingURL=mutex.js.map