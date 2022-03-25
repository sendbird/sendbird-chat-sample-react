"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionEventType = void 0;
var TransactionEventType;
(function (TransactionEventType) {
    TransactionEventType[TransactionEventType["COMMIT"] = 0] = "COMMIT";
    TransactionEventType[TransactionEventType["WRITE"] = 1] = "WRITE";
    TransactionEventType[TransactionEventType["ERROR"] = 2] = "ERROR";
})(TransactionEventType = exports.TransactionEventType || (exports.TransactionEventType = {}));
//# sourceMappingURL=interface.js.map