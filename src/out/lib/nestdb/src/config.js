"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_CACHE_LIMIT = 256;
const DEFAULT_BLOCK_HASH_BASE = 2;
const DEFAULT_BLOCK_HASH_MULTIPLIER = 10;
const DEFAULT_BLOCK_HASH_CONSTANT = 11;
const DEFAULT_TRANSACTION_APPLY_DELAY = 200;
const ITEM_SIZE_LIMIT = 1 * 1024 * 1024;
const _configByDbname = {};
class Config {
    constructor({ dbname, itemSizeLimit = ITEM_SIZE_LIMIT, cacheLimit = DEFAULT_CACHE_LIMIT, blockHashBase = DEFAULT_BLOCK_HASH_BASE, blockHashMultiplier = DEFAULT_BLOCK_HASH_MULTIPLIER, blockHashConstant = DEFAULT_BLOCK_HASH_CONSTANT, transactionApplyDelay = DEFAULT_TRANSACTION_APPLY_DELAY, disableLogger = false, }) {
        if (!_configByDbname[dbname]) {
            this.itemSizeLimit = itemSizeLimit;
            this.cacheLimit = cacheLimit;
            this.blockHashBase = blockHashBase;
            this.blockHashMultiplier = blockHashMultiplier;
            this.blockHashConstant = blockHashConstant;
            this.transactionApplyDelay = transactionApplyDelay;
            this.disableLogger = disableLogger;
            _configByDbname[dbname] = this;
        }
        return _configByDbname[dbname];
    }
    static get(dbname) {
        return _configByDbname[dbname];
    }
}
exports.default = Config;
//# sourceMappingURL=config.js.map