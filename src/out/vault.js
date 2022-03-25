"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("./const");
const error_1 = require("./error");
const options_1 = require("./options");
const cacheContext_1 = require("./cache/cacheContext");
const auth_1 = require("./core/auth");
const eventDispatcher_1 = require("./core/eventDispatcher");
const requestQueue_1 = require("./comm/requestQueue");
const sessionManager_1 = require("./comm/sessionManager");
const connectionManager_1 = require("./comm/connectionManager");
const logger_1 = require("./stat/logger");
const retry_1 = require("./utils/retry");
const _globalMap = {};
class Vault {
    constructor(_iid, params) {
        var _a, _b, _c, _d, _e, _f;
        this.connectedAt = 0;
        this.connectionHandlers = new Map();
        this.userEventHandlers = new Map();
        if (!_globalMap[_iid]) {
            _globalMap[_iid] = this;
            const options = (_a = params.options) !== null && _a !== void 0 ? _a : new options_1.default();
            const sdkState = this.sdkState = {
                appId: params.appId,
                appVersion: (_b = params.appVersion) !== null && _b !== void 0 ? _b : '',
                userId: null,
                extensions: {},
                api: {
                    host: (_c = params.apiHost) !== null && _c !== void 0 ? _c : `https://api-${params.appId}.sendbird.com`,
                },
                websocket: {
                    host: (_d = params.websocketHost) !== null && _d !== void 0 ? _d : `wss://ws-${params.appId}.sendbird.com`,
                    pingerDisabled: !!params.noPingpong,
                    pingInterval: null,
                    pongTimeout: null,
                    connectMaxRetry: 2,
                    reconnectMaxRetry: -1,
                    reconnectRetryStrategy: new retry_1.Immediate(),
                    responseTimeout: options.websocketResponseTimeout,
                },
            };
            this.appInfo = null;
            this.subscribedUnreadMessageCount = {
                all: 0,
                customTypes: {},
                ts: 0,
            };
            this.logger = new logger_1.default(_iid);
            this.logger.level = (_e = params.logLevel) !== null && _e !== void 0 ? _e : logger_1.LogLevel.ERROR;
            this.connectedAt = 0;
            this.connectionHandlers = new Map();
            this.userEventHandlers = new Map();
            this.cacheContext = new cacheContext_1.default({
                encryption: params.encryption,
                store: params.store,
                localCacheEnabled: params.localCacheEnabled,
            });
            this.debugMode = (_f = params.debugMode) !== null && _f !== void 0 ? _f : false;
            this.maxSuperGroupChannelUnreadCount = const_1.default.DEFAULT_MAX_UNREAD_COUNT_OF_SUPER_GROUP_CHANNEL;
            this.concurrentCallLimit = null;
            this.backOffDelay = null;
            const dispatcher = this.dispatcher = new eventDispatcher_1.CommandDispatcher();
            const auth = new auth_1.default();
            this.requestQueue = new requestQueue_1.default(_iid, {
                auth,
                sdkState,
                dispatcher,
            });
            this.sessionManager = new sessionManager_1.default({
                auth,
                sdkState,
                dispatcher,
                requestQueue: this.requestQueue,
            });
            this.connectionManager = new connectionManager_1.default(_iid, {
                sdkState,
                connectionHandlers: this.connectionHandlers,
                dispatcher,
                sessionManager: this.sessionManager,
                websocketClient: this.requestQueue.commandRouter.websocketClient,
            });
        }
        return _globalMap[_iid];
    }
    static of(_iid) {
        if (_globalMap[_iid]) {
            return _globalMap[_iid];
        }
        else {
            throw error_1.default.lostInstance;
        }
    }
}
exports.default = Vault;
//# sourceMappingURL=vault.js.map