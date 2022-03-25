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
exports.Immediate = exports.asyncRetry = void 0;
const sleep_1 = require("../sleep");
const immediate_1 = require("./strategy/immediate");
Object.defineProperty(exports, "Immediate", { enumerable: true, get: function () { return immediate_1.Immediate; } });
const INFINITE_RETRY = -1;
const asyncRetry = (executor, maxRetry, strategy = new immediate_1.Immediate()) => __awaiter(void 0, void 0, void 0, function* () {
    let count = 0;
    let haltError = null;
    const halt = (err = null) => haltError = err !== null && err !== void 0 ? err : new Error('Halted');
    while (maxRetry === INFINITE_RETRY || count < maxRetry) {
        try {
            const res = yield executor(halt);
            if (!haltError)
                return res;
            else
                throw haltError;
        }
        catch (err) {
            if (!haltError) {
                count++;
                if (count === maxRetry)
                    throw err;
                yield (0, sleep_1.sleep)(strategy.calcTimeout(count));
            }
            else
                throw haltError;
        }
    }
});
exports.asyncRetry = asyncRetry;
//# sourceMappingURL=index.js.map