"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noop_1 = require("../../utils/noop");
const types_1 = require("./types");
class MessageRequestHandler {
    constructor() {
        this._onPending = noop_1.noop;
        this._onFailed = noop_1.noop;
        this._onSucceeded = noop_1.noop;
    }
    trigger(err, message) {
        switch (message.requestState) {
            case types_1.RequestState.PENDING: {
                this._onPending(message);
                break;
            }
            case types_1.RequestState.FAILED:
            case types_1.RequestState.CANCELED: {
                this._onFailed(err, message);
                break;
            }
            case types_1.RequestState.SUCCEEDED: {
                this._onSucceeded(message);
                break;
            }
        }
    }
    onPending(handler) {
        this._onPending = handler;
        return this;
    }
    onFailed(handler) {
        this._onFailed = handler;
        return this;
    }
    onSucceeded(handler) {
        this._onSucceeded = handler;
        return this;
    }
}
exports.default = MessageRequestHandler;
//# sourceMappingURL=messageRequestHandler.js.map