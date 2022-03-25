"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Module {
    init(_iid, { sdkState, dispatcher, sessionManager, requestQueue, cacheContext = null }) {
        this._iid = _iid;
        this._cacheContext = cacheContext;
        this._sdkState = sdkState;
        this._dispatcher = dispatcher;
        this._sessionManager = sessionManager;
        this._requestQueue = requestQueue;
    }
}
exports.default = Module;
//# sourceMappingURL=baseModule.js.map