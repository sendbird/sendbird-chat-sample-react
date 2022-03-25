"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vault_1 = require("../../../vault");
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
const appInfo_1 = require("../../../appInfo");
const ekey_1 = require("../../../model/ekey");
const user_1 = require("../../../model/user");
const error_1 = require("../../../error");
const DEFAULT_PING_INTERVAL = 15000;
const DEFAULT_PONG_TIMEOUT = 5000;
const DEFAULT_RECONNECT_MAX_RETRY = 5;
const DEFAULT_RECONNECT_INTERVAL = 3000;
const DEFAULT_RECONNECT_MAX_INTERVAL = 60000;
const DEFAULT_RECONNECT_MULTIPLIER = 2;
const DEFAULT_MAX_SUPER_GROUPCHANNEL_UNREAD_COUNT = 100;
const DEFAULT_CONCURRENT_CALL_LIMIT = 5;
const DEFAULT_BACKOFF_DELAY = 100;
class LoginCommand extends websocketEventCommand_1.default {
    constructor(_iid, code, payload) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        super(_iid, code, payload);
        this.pingInterval = DEFAULT_PING_INTERVAL;
        this.pongTimeout = DEFAULT_PONG_TIMEOUT;
        this.reconnectInterval = DEFAULT_RECONNECT_INTERVAL;
        this.reconnectMaxInterval = DEFAULT_RECONNECT_MAX_INTERVAL;
        this.reconnectRetryCount = DEFAULT_RECONNECT_MAX_RETRY;
        this.reconnectIntervalMultiple = DEFAULT_RECONNECT_MULTIPLIER;
        this.error = null;
        this.appInfo = new appInfo_1.default(payload);
        this.user = new user_1.default(_iid, payload);
        this.key = payload.key;
        this.ekey = (_a = payload.ekey) !== null && _a !== void 0 ? _a : '';
        this.connectedAt = ((_b = payload.login_ts) !== null && _b !== void 0 ? _b : 0) * 1000;
        this.pingInterval = (_c = payload.ping_interval) !== null && _c !== void 0 ? _c : DEFAULT_PING_INTERVAL;
        this.pongTimeout = (_d = payload.pong_timeout) !== null && _d !== void 0 ? _d : DEFAULT_PONG_TIMEOUT;
        if (payload.reconnect) {
            this.reconnectInterval = (_e = payload.reconnect.interval) !== null && _e !== void 0 ? _e : DEFAULT_RECONNECT_INTERVAL;
            this.reconnectMaxInterval = (_f = payload.reconnect.max_interval) !== null && _f !== void 0 ? _f : DEFAULT_RECONNECT_MAX_INTERVAL;
            this.reconnectRetryCount = (_g = payload.reconnect.retry_cnt) !== null && _g !== void 0 ? _g : DEFAULT_RECONNECT_MAX_RETRY;
            this.reconnectIntervalMultiple = (_h = payload.reconnect.mul) !== null && _h !== void 0 ? _h : DEFAULT_RECONNECT_MULTIPLIER;
        }
        this.maxUnreadCountOnSuperGroup = (_j = payload.max_unread_cnt_on_super_group) !== null && _j !== void 0 ? _j : DEFAULT_MAX_SUPER_GROUPCHANNEL_UNREAD_COUNT;
        this.profileImageEncryption = payload.profile_image_encryption;
        this.concurrentCallLimit = (_k = payload.concurrent_call_limit) !== null && _k !== void 0 ? _k : DEFAULT_CONCURRENT_CALL_LIMIT;
        this.backOffDelay = (_l = payload.back_off_delay) !== null && _l !== void 0 ? _l : DEFAULT_BACKOFF_DELAY;
        this.error = payload['error'] ? new error_1.default(payload) : null;
    }
    static asError(err) {
        return new LoginCommand(null, 'LOGI', Object.assign({ 'user_id': null, 'error': true }, err));
    }
    applyTo(_iid) {
        if (!this.error) {
            const vault = vault_1.default.of(_iid);
            if (vault) {
                vault.sessionManager.auth.sessionKey = this.key;
                (0, ekey_1.ekey)(_iid, this.ekey);
                vault.sdkState.websocket.pingInterval = this.pingInterval;
                vault.sdkState.websocket.pongTimeout = this.pongTimeout;
                vault.sdkState.websocket.reconnectMaxRetry = this.reconnectRetryCount;
                vault.sdkState.websocket.reconnectRetryStrategy = {
                    calcTimeout: (count) => count > 0 ?
                        Math.min(seed * Math.pow(mult, count - 1), cap) :
                        10,
                };
                vault.appInfo = this.appInfo;
                vault.sessionManager.currentUser = this.user;
                const seed = this.reconnectInterval;
                const cap = this.reconnectMaxInterval;
                const mult = this.reconnectIntervalMultiple;
                vault.connectedAt = this.connectedAt;
                vault.maxSuperGroupChannelUnreadCount = this.maxUnreadCountOnSuperGroup;
                vault.concurrentCallLimit = this.concurrentCallLimit;
                vault.backOffDelay = this.backOffDelay;
            }
            else {
                throw error_1.default.lostInstance;
            }
        }
        else {
            throw this.error;
        }
    }
}
exports.default = LoginCommand;
//# sourceMappingURL=loginCommand.js.map