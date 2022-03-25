"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const encrypt_1 = require("../lib/nestdb/src/store/encrypt");
class CacheContext {
    constructor({ encryption = null, store = null, localCacheEnabled = true, }) {
        this.nestdb = null;
        this.store = store;
        this.encryption = encryption !== null && encryption !== void 0 ? encryption : encrypt_1.DEFAULT_ENCRYPTION;
        this.localCacheEnabled = localCacheEnabled;
    }
}
exports.default = CacheContext;
//# sourceMappingURL=cacheContext.js.map