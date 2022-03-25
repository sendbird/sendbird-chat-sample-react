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
exports.SyncState = void 0;
const semaphore_1 = require("./semaphore");
const eventDispatcher_1 = require("../core/eventDispatcher");
var SyncState;
(function (SyncState) {
    SyncState[SyncState["IDLE"] = 0] = "IDLE";
    SyncState[SyncState["RUNNING"] = 1] = "RUNNING";
    SyncState[SyncState["END"] = 2] = "END";
})(SyncState = exports.SyncState || (exports.SyncState = {}));
const DEFAULT_RETRY_LIMIT = 3;
const DEFAULT_NUM_CONCURRENT_CALL_LIMIT = 2;
const NEXT_ITERATION_DELAY = 10;
class Sync extends eventDispatcher_1.default {
    constructor(key, worker, concurrentCallLimit = DEFAULT_NUM_CONCURRENT_CALL_LIMIT, backOffDelay = NEXT_ITERATION_DELAY) {
        super();
        this._worker = null;
        this._state = SyncState.IDLE;
        this._semaphore = null;
        this._retryCount = 0;
        this._retryLimit = DEFAULT_RETRY_LIMIT;
        this.priority = 0;
        this._worker = worker;
        this._semaphore = new semaphore_1.default({ key, concurrentCallLimit, backOffDelay });
    }
    get isIdle() {
        return this._state === SyncState.IDLE;
    }
    get isRunning() {
        return this._state === SyncState.RUNNING;
    }
    get isDone() {
        return this._state === SyncState.END;
    }
    get retryCount() {
        return this._retryCount;
    }
    get retryLimit() {
        return this._retryLimit;
    }
    _run(nextToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isRunning) {
                this._key = yield this._semaphore.acquire(this.priority);
                try {
                    const result = yield this._worker(nextToken);
                    this._retryCount = 0;
                    this.dispatch('progress', result);
                    if (result.hasNext) {
                        this._run(result.nextToken);
                        this._semaphore.release(this._key);
                    }
                    else {
                        this.end();
                    }
                }
                catch (err) {
                    this.dispatch('error', err);
                    if (this._retryCount < this._retryLimit) {
                        this._retryCount++;
                        this._run(nextToken);
                        this._semaphore.release(this._key);
                    }
                    else {
                        this.stop();
                    }
                }
            }
        });
    }
    start(nextToken) {
        if (this.isIdle) {
            this._state = SyncState.RUNNING;
            this._run(nextToken);
        }
    }
    stop() {
        this._state = SyncState.IDLE;
        this.dispatch('stop');
        this._semaphore.release(this._key);
    }
    end() {
        this._state = SyncState.END;
        this.dispatch('end');
        this._semaphore.release(this._key);
    }
}
exports.default = Sync;
//# sourceMappingURL=sync.js.map