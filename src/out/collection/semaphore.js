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
exports.Semaphore = void 0;
const compat_1 = require("../utils/compat");
const sleep_1 = require("../utils/sleep");
const uuid_1 = require("../utils/uuid");
const SEMAPHORE_HOLDERS_KEY_PREFIX = 'collection@semaphore_holders_for:';
const SEMAPHORE_RESOLVERS_KEY_PREFIX = 'collection@semaphore_resolvers_for:';
const SEMAPHORE_CHAIN_PROCESS_STATE_KEY_PREFIX = 'collection@semaphore_chain_process_state_for:';
const DEFAULT_NUM_CONCURRENT_CALL_LIMIT = 2;
const DEFAULT_API_BACKOFF_DELAY_SECONDS = 0;
const _globalHoldersData = new Map();
const _globalResolversData = new Map();
const _globalIsProcessChainAcquireRunning = new Map();
class Semaphore {
    constructor({ key, concurrentCallLimit = DEFAULT_NUM_CONCURRENT_CALL_LIMIT, backOffDelay = DEFAULT_API_BACKOFF_DELAY_SECONDS, }) {
        this._holdersKey = Semaphore.createSemaphoreHoldersKey(key);
        this._resolversKey = Semaphore.createSemaphoreResolversKey(key);
        this._chainProcessStateKey = Semaphore.createChainProcessStateKey(key);
        this._numLocks = concurrentCallLimit;
        this._backOffDelay = backOffDelay;
        this._localAcquiredKeys = [];
        this._localResolversData = [];
        if ((0, compat_1.isReactNative)()) {
            if (!_globalHoldersData[this._holdersKey])
                _globalHoldersData[this._holdersKey] = [];
            if (!_globalResolversData[this._resolversKey])
                _globalResolversData[this._resolversKey] = [];
        }
        else {
            window.addEventListener('storage', (event) => __awaiter(this, void 0, void 0, function* () {
                if (this._localResolversData.length > 0 &&
                    this.numLocksAvailable > 0 &&
                    !this._isProcessChainAcquireRunning() &&
                    this._hasHighestPriorityResolver()) {
                    switch (event.key) {
                        case this._holdersKey:
                            const oldHolders = JSON.parse(event.oldValue);
                            const newHolders = JSON.parse(event.newValue);
                            if (!oldHolders || !newHolders || newHolders.length >= oldHolders.length)
                                return;
                            this._processChainResolve();
                            break;
                        case this._chainProcessStateKey:
                            if (JSON.parse(event.newValue))
                                return;
                            this._processChainResolve();
                            break;
                        default:
                            return;
                    }
                }
            }));
            window.addEventListener('beforeunload', () => {
                const resolversData = this._getLocalResolversData();
                const localResolverKeys = this._localResolversData.map((data) => data.key);
                const filteredResolversData = resolversData.filter((resolverData) => {
                    return localResolverKeys.indexOf(resolverData.key) < 0;
                });
                window.localStorage.setItem(this._resolversKey, JSON.stringify(filteredResolversData));
                this._localAcquiredKeys.forEach((key) => this.release(key));
            });
        }
    }
    static createSemaphoreHoldersKey(key) {
        return SEMAPHORE_HOLDERS_KEY_PREFIX + key;
    }
    static createSemaphoreResolversKey(key) {
        return SEMAPHORE_RESOLVERS_KEY_PREFIX + key;
    }
    static createChainProcessStateKey(key) {
        return SEMAPHORE_CHAIN_PROCESS_STATE_KEY_PREFIX + key;
    }
    get numLocks() {
        return this._numLocks;
    }
    get backOffDelay() {
        return this._backOffDelay;
    }
    get numLocksAvailable() {
        if ((0, compat_1.isReactNative)()) {
            return this.numLocks - _globalHoldersData[this._holdersKey].length;
        }
        else {
            const holders = this._getLocalHoldersData();
            return this.numLocks - holders.length;
        }
    }
    get waitCount() {
        if ((0, compat_1.isReactNative)()) {
            return _globalResolversData[this._resolversKey].length;
        }
        else {
            const resolversData = this._getLocalResolversData();
            return resolversData.length;
        }
    }
    _hasHighestPriorityResolver() {
        const resolversData = this._getLocalResolversData();
        return (resolversData.length > 0 &&
            this._localResolversData
                .map((resolverData) => resolverData.key)
                .indexOf(resolversData[0].key) >= 0);
    }
    _isProcessChainAcquireRunning() {
        if ((0, compat_1.isReactNative)()) {
            return _globalIsProcessChainAcquireRunning[this._chainProcessStateKey];
        }
        else {
            const chainProcessStateStr = window.localStorage[this._chainProcessStateKey];
            if (typeof chainProcessStateStr !== 'undefined') {
                return JSON.parse(chainProcessStateStr);
            }
            return false;
        }
    }
    _setProcessChainAcquireRunning(isRunning) {
        if ((0, compat_1.isReactNative)()) {
            _globalIsProcessChainAcquireRunning[this._chainProcessStateKey] = isRunning;
        }
        else {
            if (isRunning) {
                window.localStorage.setItem(this._chainProcessStateKey, JSON.stringify(isRunning));
            }
            else {
                window.localStorage.removeItem(this._chainProcessStateKey);
            }
        }
    }
    _processChainResolve() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.waitCount > 0 && this.numLocksAvailable > 0 && !this._isProcessChainAcquireRunning()) {
                this._setProcessChainAcquireRunning(true);
                if (this._tryResolve())
                    yield (0, sleep_1.sleep)(this._backOffDelay);
                this._setProcessChainAcquireRunning(false);
                if ((0, compat_1.isReactNative)()) {
                    this._processChainResolve();
                }
                else {
                    const storageEvent = new StorageEvent('storage', {
                        key: this._chainProcessStateKey,
                        oldValue: JSON.stringify(true),
                        newValue: JSON.stringify(false),
                    });
                    dispatchEvent(storageEvent);
                }
            }
        });
    }
    acquire(priority = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, compat_1.isReactNative)()) {
                return new Promise((resolve) => {
                    const resolver = (key) => resolve(key);
                    const key = (0, uuid_1.uuid)();
                    const resolverData = { key, resolver, priority };
                    const resolversData = _globalResolversData[this._resolversKey];
                    let insertAt = -1;
                    for (let i = 0; i < resolversData.length; i++) {
                        if (priority > resolversData[i].priority) {
                            insertAt = i;
                            break;
                        }
                    }
                    if (insertAt >= 0) {
                        _globalResolversData[this._resolversKey].splice(insertAt, 0, resolverData);
                    }
                    else
                        _globalResolversData[this._resolversKey].push(resolverData);
                    this._processChainResolve();
                });
            }
            else {
                const resolversData = this._getLocalResolversData();
                return new Promise((resolve) => {
                    const resolver = (key) => resolve(key);
                    const key = (0, uuid_1.uuid)();
                    const resolverData = { key, priority };
                    const localResolverData = { key, resolver, priority };
                    let insertAt = -1;
                    for (let i = 0; i < resolversData.length; i++) {
                        if (priority > resolversData[i].priority) {
                            insertAt = i;
                            break;
                        }
                    }
                    if (insertAt >= 0) {
                        resolversData.splice(insertAt, 0, resolverData);
                        this._localResolversData.splice(insertAt, 0, localResolverData);
                    }
                    else {
                        resolversData.push(resolverData);
                        this._localResolversData.push(localResolverData);
                    }
                    window.localStorage.setItem(this._resolversKey, JSON.stringify(resolversData));
                    this._processChainResolve();
                });
            }
        });
    }
    release(key) {
        if ((0, compat_1.isReactNative)()) {
            const placedAt = _globalHoldersData[this._holdersKey].indexOf(key);
            if (placedAt >= 0) {
                _globalHoldersData[this._holdersKey].splice(placedAt, 1);
                this._processChainResolve();
                return true;
            }
        }
        else {
            const holders = JSON.parse(window.localStorage[this._holdersKey]);
            const oldHolders = [...holders];
            const placedAt = holders.indexOf(key);
            if (placedAt >= 0) {
                holders.splice(placedAt, 1);
                window.localStorage.setItem(this._holdersKey, JSON.stringify(holders));
                this._localAcquiredKeys.splice(this._localAcquiredKeys.indexOf(key), 1);
                const storageEvent = new StorageEvent('storage', {
                    key: this._holdersKey,
                    oldValue: JSON.stringify(oldHolders),
                    newValue: JSON.stringify(holders),
                });
                dispatchEvent(storageEvent);
                return true;
            }
        }
        return false;
    }
    _tryResolve() {
        if ((0, compat_1.isReactNative)()) {
            if (_globalHoldersData[this._holdersKey].length < this.numLocks) {
                const key = (0, uuid_1.uuid)();
                _globalHoldersData[this._holdersKey] = [..._globalHoldersData[this._holdersKey], key];
                const resolverData = _globalResolversData[this._resolversKey].shift();
                resolverData.resolver(key);
                return true;
            }
        }
        else {
            const holders = this._getLocalHoldersData();
            if (holders.length < this.numLocks) {
                const key = (0, uuid_1.uuid)();
                const resolverData = this._localResolversData.shift();
                const resolversData = this._getLocalResolversData();
                let removeAt = resolversData
                    .map((resolverData) => resolverData.key)
                    .indexOf(resolverData.key);
                resolversData.splice(removeAt, 1);
                window.localStorage.setItem(this._resolversKey, JSON.stringify(resolversData));
                window.localStorage.setItem(this._holdersKey, JSON.stringify([...holders, key]));
                this._localAcquiredKeys.push(key);
                const storageEvent = new StorageEvent('storage', {
                    key: this._holdersKey,
                    oldValue: JSON.stringify([...holders]),
                    newValue: JSON.stringify([...holders, key]),
                });
                dispatchEvent(storageEvent);
                const resolver = resolverData.resolver;
                resolver(key);
                return true;
            }
        }
        return false;
    }
    _getLocalHoldersData() {
        const holdersStr = window.localStorage[this._holdersKey];
        return typeof holdersStr !== 'undefined' ? JSON.parse(holdersStr) : [];
    }
    _getLocalResolversData() {
        const resolversStr = window.localStorage[this._resolversKey];
        return typeof resolversStr !== 'undefined' ? JSON.parse(resolversStr) : [];
    }
}
exports.Semaphore = Semaphore;
exports.default = Semaphore;
//# sourceMappingURL=semaphore.js.map