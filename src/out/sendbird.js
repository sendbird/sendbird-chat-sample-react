"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function (m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
exports.SendbirdChatOptions = void 0;
const package_json_1 = require("../../package.json");
const vault_1 = require("./vault");
const error_1 = require("./error");
const options_1 = require("./options");
exports.SendbirdChatOptions = options_1.default;
const types_1 = require("./types");
const message_1 = require("./module/message");
const ekey_1 = require("./model/ekey");
const user_1 = require("./model/user");
const userUpdateParams_1 = require("./model/params/userUpdateParams");
const unreadItemCountParams_1 = require("./model/params/unreadItemCountParams");
const totalUnreadMessageCountParams_1 = require("./model/params/totalUnreadMessageCountParams");
const migrate_1 = require("./cache/migrate");
const onlineDetector_1 = require("./comm/onlineDetector");
const userEvent_1 = require("./comm/event/userEvent");
const databaseOpenCommand_1 = require("./comm/command/internal/databaseOpenCommand");
const subscribedUnreadMessageCountUpdateCommand_1 = require("./comm/command/internal/subscribedUnreadMessageCountUpdateCommand");
const userEventCommand_1 = require("./comm/command/user/userEventCommand");
const updateCurrentUserInfoCommand_1 = require("./comm/command/user/updateCurrentUserInfoCommand");
const registerAPNSPushTokenCommand_1 = require("./comm/command/user/registerAPNSPushTokenCommand");
const registerFCMPushTokenCommand_1 = require("./comm/command/user/registerFCMPushTokenCommand");
const unregisterAPNSPushTokenCommand_1 = require("./comm/command/user/unregisterAPNSPushTokenCommand");
const unregisterFCMPushTokenCommand_1 = require("./comm/command/user/unregisterFCMPushTokenCommand");
const unregisterAllAPNSPushTokensCommand_1 = require("./comm/command/user/unregisterAllAPNSPushTokensCommand");
const unregisterAllFCMPushTokensCommand_1 = require("./comm/command/user/unregisterAllFCMPushTokensCommand");
const getPushTokensCommand_1 = require("./comm/command/user/getPushTokensCommand");
const getChannelInvitationPreferenceCommand_1 = require("./comm/command/user/getChannelInvitationPreferenceCommand");
const setChannelInvitationPreferenceCommand_1 = require("./comm/command/user/setChannelInvitationPreferenceCommand");
const getDoNotDisturbCommand_1 = require("./comm/command/user/getDoNotDisturbCommand");
const setDoNotDisturbCommand_1 = require("./comm/command/user/setDoNotDisturbCommand");
const getSnoozePeriodCommand_1 = require("./comm/command/user/getSnoozePeriodCommand");
const setSnoozePeriodCommand_1 = require("./comm/command/user/setSnoozePeriodCommand");
const blockUserCommand_1 = require("./comm/command/user/blockUserCommand");
const unblockUserCommand_1 = require("./comm/command/user/unblockUserCommand");
const getPushTriggerOptionCommand_1 = require("./comm/command/user/getPushTriggerOptionCommand");
const setPushTriggerOptionCommand_1 = require("./comm/command/user/setPushTriggerOptionCommand");
const getPushTemplateCommand_1 = require("./comm/command/user/getPushTemplateCommand");
const setPushTemplateCommand_1 = require("./comm/command/user/setPushTemplateCommand");
const getFriendChangeLogsCommand_1 = require("./comm/command/user/getFriendChangeLogsCommand");
const uploadFriendDiscoveriesCommand_1 = require("./comm/command/user/uploadFriendDiscoveriesCommand");
const deleteFriendDiscoveriesCommand_1 = require("./comm/command/user/deleteFriendDiscoveriesCommand");
const addFriendsCommand_1 = require("./comm/command/user/addFriendsCommand");
const deleteFriendsCommand_1 = require("./comm/command/user/deleteFriendsCommand");
const getAllowFriendDiscoveryCommand_1 = require("./comm/command/user/getAllowFriendDiscoveryCommand");
const setAllowFriendDiscoveryCommand_1 = require("./comm/command/user/setAllowFriendDiscoveryCommand");
const getUnreadItemCountCommand_1 = require("./comm/command/user/getUnreadItemCountCommand");
const getTotalUnreadChannelCountCommand_1 = require("./comm/command/user/getTotalUnreadChannelCountCommand");
const getTotalUnreadMessageCountCommand_1 = require("./comm/command/user/getTotalUnreadMessageCountCommand");
const getAllEmojiCommand_1 = require("./comm/command/extra/getAllEmojiCommand");
const getEmojiCategoryCommand_1 = require("./comm/command/extra/getEmojiCategoryCommand");
const getEmojiCommand_1 = require("./comm/command/extra/getEmojiCommand");
const websocketEventCommand_1 = require("./core/command/websocket/websocketEventCommand");
const websocketClient_1 = require("./core/websocket/websocketClient");
const applicationUserListQuery_1 = require("./query/applicationUserListQuery");
const blockedUserListQuery_1 = require("./query/blockedUserListQuery");
const friendListQuery_1 = require("./query/friendListQuery");
const messageSearchQuery_1 = require("./query/messageSearchQuery");
const nest_1 = require("./lib/nestdb/src/nest");
const unless_1 = require("./utils/unless");
const validator_1 = require("./utils/validator");
const uuid_1 = require("./utils/uuid");
const serializer_1 = require("./utils/serializer");
let _singleton = null;
class SendbirdChat {
    constructor(_iid, options, modules) {
        this._appState = 'foreground';
        this._fcmPushToken = null;
        this._apnsPushToken = null;
        this._iid = _iid;
        this.options = options;
        const { sdkState, cacheContext, connectionManager, dispatcher, sessionManager, requestQueue, logger, userEventHandlers, } = vault_1.default.of(_iid);
        modules.forEach((module) => {
            module.init(_iid, {
                sdkState,
                cacheContext,
                dispatcher,
                sessionManager,
                requestQueue,
            });
            this[module.name] = module;
        });
        this._onlineDetector = new onlineDetector_1.default({
            logger,
            connectionDelegate: {
                reconnect: () => connectionManager.reconnect(),
                disconnect: () => connectionManager.disconnect(),
            }
        });
        dispatcher.on((command) => {
            if (command instanceof websocketEventCommand_1.default) {
                switch (command.code) {
                    case 'USEV': {
                        const { event } = command.as(userEventCommand_1.UserEventCommand);
                        switch (event.category) {
                            case userEvent_1.UserEventCategory.FRIEND_DISCOVERED: {
                                const { friendDiscoveries } = userEvent_1.default.getDataAsFriendDiscoveredEvent(_iid, event);
                                userEventHandlers.forEach((handler) => handler.onFriendsDiscovered(friendDiscoveries));
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            else if (command instanceof subscribedUnreadMessageCountUpdateCommand_1.default) {
                const { subscribedUnreadMessageCount } = vault_1.default.of(this._iid);
                let unreadCountChanged = false;
                const ts = command.ts;
                if (typeof ts === 'number' && ts > subscribedUnreadMessageCount.ts) {
                    if (subscribedUnreadMessageCount.all !== command.all) {
                        unreadCountChanged = true;
                    }
                    subscribedUnreadMessageCount.all = command.all >= 0 ? command.all : 0;
                    if (command.customTypes) {
                        for (let key in command.customTypes) {
                            if (subscribedUnreadMessageCount.customTypes[key] !== command.customTypes[key]) {
                                unreadCountChanged = true;
                            }
                            subscribedUnreadMessageCount.customTypes[key] = command.customTypes[key];
                        }
                    }
                    unreadCountChanged = unreadCountChanged && subscribedUnreadMessageCount.ts > 0;
                    subscribedUnreadMessageCount.ts = ts;
                }
                if (unreadCountChanged) {
                    userEventHandlers.forEach((handler) => {
                        handler.onTotalUnreadMessageCountUpdated(subscribedUnreadMessageCount.all, subscribedUnreadMessageCount.customTypes);
                    });
                }
            }
        });
    }
    static init(params) {
        const { appId, appVersion = null, modules = [], options = new options_1.default(), debugMode = false, customApiHost, customWebSocketHost, newInstance = false, localCacheEnabled = false, localCacheEncryption = {
            encrypt: (obj) => obj,
            decrypt: (obj) => obj,
        }, useAsyncStorageStore = null, } = params;
        if (!_singleton || newInstance) {
            const _iid = `su-${(0, uuid_1.uuid)()}`;
            const encryption = localCacheEncryption;
            let store = new nest_1.MemoryStore({ encryption });
            if (!debugMode) {
                store = !useAsyncStorageStore ?
                    new nest_1.IndexedDbStore({ encryption }) :
                    new nest_1.AsyncStorageStore({ AsyncStorage: useAsyncStorageStore, encryption });
            }
            new vault_1.default(_iid, {
                appId,
                appVersion,
                options,
                apiHost: customApiHost !== null && customApiHost !== void 0 ? customApiHost : `https://api-${appId}.sendbird.com`,
                websocketHost: customWebSocketHost !== null && customWebSocketHost !== void 0 ? customWebSocketHost : `wss://ws-${appId}.sendbird.com`,
                store,
                encryption,
                localCacheEnabled,
                debugMode,
            });
            const sendbirdChat = new SendbirdChat(_iid, options, [
                ...modules,
                new message_1.MessageModule(),
            ]);
            if (!_singleton)
                _singleton = sendbirdChat;
            return sendbirdChat;
        }
    }
    static get instance() {
        return _singleton;
    }
    static get version() {
        return package_json_1.version;
    }
    get appId() {
        const { sdkState } = vault_1.default.of(this._iid);
        return sdkState.appId;
    }
    get appVersion() {
        var _a;
        const { sdkState } = vault_1.default.of(this._iid);
        return (_a = sdkState.appVersion) !== null && _a !== void 0 ? _a : '';
    }
    get debugMode() {
        const { debugMode } = vault_1.default.of(this._iid);
        return debugMode;
    }
    get isCacheEnabled() {
        const { cacheContext } = vault_1.default.of(this._iid);
        return cacheContext.localCacheEnabled;
    }
    get ekey() {
        return (0, ekey_1.ekey)(this._iid);
    }
    get currentUser() {
        var _a;
        const { sessionManager } = vault_1.default.of(this._iid);
        return (_a = sessionManager.currentUser) !== null && _a !== void 0 ? _a : null;
    }
    get connectionState() {
        const { connectionManager } = vault_1.default.of(this._iid);
        if (connectionManager.isConnected)
            return websocketClient_1.ConnectionState.OPEN;
        else if (connectionManager.isConnecting)
            return websocketClient_1.ConnectionState.CONNECTING;
        else
            return websocketClient_1.ConnectionState.CLOSED;
    }
    get lastConnectedAt() {
        const { connectedAt, connectionManager } = vault_1.default.of(this._iid);
        return connectionManager.isConnected ? connectedAt : 0;
    }
    get fcmPushToken() {
        return this._fcmPushToken;
    }
    get apnsPushToken() {
        return this._apnsPushToken;
    }
    getMemoryStoreForDebugging() {
        const { debugMode, cacheContext } = vault_1.default.of(this._iid);
        if (debugMode) {
            return (cacheContext.store instanceof nest_1.MemoryStore) ? cacheContext.store : null;
        }
        else {
            throw error_1.default.debugModeRequired;
        }
    }
    addExtension(key, version) {
        const { sdkState } = vault_1.default.of(this._iid);
        const supportedExtensionKeys = ['sb_uikit', 'sb_syncmanager'];
        if (supportedExtensionKeys.indexOf(key) > -1) {
            sdkState.extensions[key] = version;
        }
    }
    initializeCache(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sdkState, cacheContext, connectionManager, dispatcher } = vault_1.default.of(this._iid);
            if (!sdkState.userId || sdkState.userId !== userId) {
                yield connectionManager.logout();
                sdkState.userId = userId;
                if (cacheContext.localCacheEnabled) {
                    const dbname = `sendbird@${sdkState.appId}/${userId}.db`;
                    if (!cacheContext.nestdb ||
                        cacheContext.nestdb.state === nest_1.NestDBState.CLOSED ||
                        cacheContext.nestdb.name !== dbname) {
                        const nestdb = cacheContext.nestdb = new nest_1.default({
                            name: `sendbird@${sdkState.appId}/${userId}.db`,
                            version: 1,
                            store: cacheContext.store,
                        });
                        nestdb.on('upgrade', (0, migrate_1.migrate)(nestdb));
                        yield nestdb.open();
                        dispatcher.dispatch(new databaseOpenCommand_1.default(this._iid, { userId }));
                    }
                }
            }
        });
    }
    clearCache() {
        return __awaiter(this, void 0, void 0, function* () {
            const { cacheContext } = vault_1.default.of(this._iid);
            if (cacheContext.localCacheEnabled) {
                if (cacheContext.nestdb) {
                    cacheContext.nestdb.close();
                    yield cacheContext.nestdb.reset();
                }
            }
        });
    }
    connect(userId, authToken = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connectionManager } = vault_1.default.of(this._iid);
            try {
                yield this.initializeCache(userId);
            }
            catch (_a) {
                const { cacheContext, logger } = vault_1.default.of(this._iid);
                cacheContext.localCacheEnabled = false;
                logger.warning('Cache initialization failed - cache is not available.');
            }
            this._onlineDetector.start();
            yield connectionManager.connect(authToken);
            return this.currentUser;
        });
    }
    reconnect() {
        const { connectionManager, sessionManager } = vault_1.default.of(this._iid);
        const isValidReconnect = sessionManager.auth.hasSession;
        if (isValidReconnect) {
            connectionManager.reconnect()
                .catch(() => { });
        }
        return isValidReconnect;
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            const { connectionManager, cacheContext, requestQueue } = vault_1.default.of(this._iid);
            this._onlineDetector.stop();
            requestQueue.cancelAll();
            yield connectionManager.logout();
            if (cacheContext.localCacheEnabled)
                yield this.clearCache();
        });
    }
    setBackgroundState() {
        if (this._appState === 'foreground') {
            const { connectionManager } = vault_1.default.of(this._iid);
            this._appState = 'background';
            connectionManager.background();
        }
    }
    setForegroundState() {
        if (this._appState === 'background') {
            const { connectionManager } = vault_1.default.of(this._iid);
            this._appState = 'foreground';
            connectionManager.reconnect();
        }
    }
    setSessionHandler(handler) {
        const { sessionManager } = vault_1.default.of(this._iid);
        sessionManager.handler = handler;
    }
    addUserEventHandler(key, handler) {
        const { userEventHandlers } = vault_1.default.of(this._iid);
        userEventHandlers.set(key, handler);
    }
    removeUserEventHandler(key) {
        const { userEventHandlers } = vault_1.default.of(this._iid);
        userEventHandlers.delete(key);
    }
    removeAllUserEventHandler() {
        const { userEventHandlers } = vault_1.default.of(this._iid);
        userEventHandlers.clear();
    }
    addConnectionHandler(key, handler) {
        const { connectionHandlers } = vault_1.default.of(this._iid);
        connectionHandlers.set(key, handler);
    }
    removeConnectionHandler(key) {
        const { connectionHandlers } = vault_1.default.of(this._iid);
        connectionHandlers.delete(key);
    }
    removeAllConnectionHandler() {
        const { connectionHandlers } = vault_1.default.of(this._iid);
        connectionHandlers.clear();
    }
    createApplicationUserListQuery(params) {
        return new applicationUserListQuery_1.default(this._iid, params);
    }
    createBlockedUserListQuery(params) {
        return new blockedUserListQuery_1.default(this._iid, params);
    }
    createFriendListQuery(params) {
        return new friendListQuery_1.default(this._iid, params);
    }
    createMessageSearchQuery(params) {
        return new messageSearchQuery_1.default(this._iid, params);
    }
    buildUserFromSerializedData(serialized) {
        const obj = (0, serializer_1.deserialize)(serialized);
        return new user_1.default(this._iid, user_1.default.payloadify(obj));
    }
    updateCurrentUserInfo(params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(params instanceof userUpdateParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            if (this.currentUser) {
                const { sdkState, requestQueue } = vault_1.default.of(this._iid);
                const request = new updateCurrentUserInfoCommand_1.UpdateCurrentUserInfoRequestCommand(Object.assign({ userId: sdkState.userId }, params));
                const response = yield requestQueue.send(request);
                const { user } = response.as(updateCurrentUserInfoCommand_1.UpdateCurrentUserInfoResponseCommand);
                if (this.currentUser) {
                    if (params.nickname)
                        this.currentUser.nickname = user.nickname;
                    if (params.profileUrl || params.profileImage)
                        this.currentUser.plainProfileUrl = user.profileUrl;
                }
                return user;
            }
            else
                throw error_1.default.connectionRequired;
        });
    }
    updateCurrentUserInfoWithPreferredLanguages(preferredLanguages) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isArrayOf)('string', preferredLanguages))
                .throw(error_1.default.invalidParameters);
            if (this.currentUser) {
                const { sdkState, requestQueue } = vault_1.default.of(this._iid);
                const request = new updateCurrentUserInfoCommand_1.UpdateCurrentUserInfoRequestCommand({
                    userId: sdkState.userId,
                    preferredLanguages,
                });
                const response = yield requestQueue.send(request);
                const { user } = response.as(updateCurrentUserInfoCommand_1.UpdateCurrentUserInfoResponseCommand);
                if (this.currentUser) {
                    this.currentUser.preferredLanguages = user.preferredLanguages;
                }
                return user;
            }
            else
                throw error_1.default.connectionRequired;
        });
    }
    registerFCMPushTokenForCurrentUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', token))
                .throw(error_1.default.invalidParameters);
            if (this.currentUser) {
                try {
                    const { sdkState, requestQueue } = vault_1.default.of(this._iid);
                    const request = new registerFCMPushTokenCommand_1.RegisterFCMPushTokenRequestCommand({
                        userId: sdkState.userId,
                        token,
                    });
                    yield requestQueue.send(request);
                    this._fcmPushToken = '';
                    return types_1.PushTokenRegistrationState.SUCCESS;
                }
                catch (err) {
                    return types_1.PushTokenRegistrationState.ERROR;
                }
            }
            else {
                this._fcmPushToken = token;
                return types_1.PushTokenRegistrationState.PENDING;
            }
        });
    }
    unregisterFCMPushTokenForCurrentUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', token))
                .throw(error_1.default.invalidParameters);
            if (this.currentUser) {
                try {
                    const { sdkState, requestQueue } = vault_1.default.of(this._iid);
                    const request = new unregisterFCMPushTokenCommand_1.UnregisterFCMPushTokenRequestCommand({
                        userId: sdkState.userId,
                        token,
                    });
                    yield requestQueue.send(request);
                    this._fcmPushToken = '';
                    return types_1.PushTokenRegistrationState.SUCCESS;
                }
                catch (err) {
                    return types_1.PushTokenRegistrationState.ERROR;
                }
            }
            else {
                this._fcmPushToken = token;
                return types_1.PushTokenRegistrationState.PENDING;
            }
        });
    }
    unregisterFCMPushTokenAllForCurrentUser() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentUser) {
                const { sdkState, requestQueue } = vault_1.default.of(this._iid);
                const request = new unregisterAllFCMPushTokensCommand_1.UnregisterAllFCMPushTokensRequestCommand({
                    userId: sdkState.userId,
                });
                yield requestQueue.send(request);
            }
        });
    }
    registerAPNSPushTokenForCurrentUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', token))
                .throw(error_1.default.invalidParameters);
            if (this.currentUser) {
                try {
                    const { sdkState, requestQueue } = vault_1.default.of(this._iid);
                    const request = new registerAPNSPushTokenCommand_1.RegisterAPNSPushTokenRequestCommand({
                        userId: sdkState.userId,
                        token,
                    });
                    yield requestQueue.send(request);
                    this._fcmPushToken = '';
                    return types_1.PushTokenRegistrationState.SUCCESS;
                }
                catch (err) {
                    return types_1.PushTokenRegistrationState.ERROR;
                }
            }
            else {
                this._fcmPushToken = token;
                return types_1.PushTokenRegistrationState.PENDING;
            }
        });
    }
    unregisterAPNSPushTokenForCurrentUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', token))
                .throw(error_1.default.invalidParameters);
            if (this.currentUser) {
                try {
                    const { sdkState, requestQueue } = vault_1.default.of(this._iid);
                    const request = new unregisterAPNSPushTokenCommand_1.UnregisterAPNSPushTokenRequestCommand({
                        userId: sdkState.userId,
                        token,
                    });
                    yield requestQueue.send(request);
                    this._fcmPushToken = '';
                    return types_1.PushTokenRegistrationState.SUCCESS;
                }
                catch (err) {
                    return types_1.PushTokenRegistrationState.ERROR;
                }
            }
            else {
                this._fcmPushToken = token;
                return types_1.PushTokenRegistrationState.PENDING;
            }
        });
    }
    unregisterAPNSPushTokenAllForCurrentUser() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentUser) {
                const { sdkState, requestQueue } = vault_1.default.of(this._iid);
                const request = new unregisterAllAPNSPushTokensCommand_1.UnregisterAllAPNSPushTokensRequestCommand({
                    userId: sdkState.userId,
                });
                yield requestQueue.send(request);
            }
        });
    }
    getChannelInvitationPreference() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new getChannelInvitationPreferenceCommand_1.GetChannelInvitationPreferenceRequestCommand({
                userId: sdkState.userId,
            });
            const response = yield requestQueue.send(request);
            const { autoAccept } = response.as(getChannelInvitationPreferenceCommand_1.GetChannelInvitationPreferenceResponseCommand);
            return { autoAccept };
        });
    }
    setChannelInvitationPreference(willAutoAccept) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('boolean', willAutoAccept))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new setChannelInvitationPreferenceCommand_1.SetChannelInvitationPreferenceRequestCommand({
                userId: sdkState.userId,
                willAutoAccept,
            });
            const response = yield requestQueue.send(request);
            const { autoAccept } = response.as(setChannelInvitationPreferenceCommand_1.SetChannelInvitationPreferenceResponseCommand);
            return { autoAccept };
        });
    }
    getDoNotDisturb() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new getDoNotDisturbCommand_1.GetDoNotDisturbRequestCommand({
                userId: sdkState.userId,
            });
            const response = yield requestQueue.send(request);
            const { preference } = response.as(getDoNotDisturbCommand_1.GetDoNotDisturbResponseCommand);
            return preference;
        });
    }
    setDoNotDisturb(doNotDisturbOn, startHour = 0, startMin = 0, endHour = 0, endMin = 0, timezone = '') {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('boolean', doNotDisturbOn) &&
                (0, validator_1.isTypeOf)('number', startHour) &&
                (0, validator_1.isTypeOf)('number', startMin) &&
                (0, validator_1.isTypeOf)('number', endHour) &&
                (0, validator_1.isTypeOf)('number', endMin) &&
                (0, validator_1.isTypeOf)('string', timezone))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new setDoNotDisturbCommand_1.SetDoNotDisturbRequestCommand({
                userId: sdkState.userId,
                doNotDisturbOn,
                startHour,
                startMin,
                endHour,
                endMin,
                timezone,
            });
            const response = yield requestQueue.send(request);
            const { preference } = response.as(setDoNotDisturbCommand_1.SetDoNotDisturbResponseCommand);
            return preference;
        });
    }
    getSnoozePeriod() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new getSnoozePeriodCommand_1.GetSnoozePeriodRequestCommand({
                userId: sdkState.userId,
            });
            const response = yield requestQueue.send(request);
            const { snoozePeriod } = response.as(getSnoozePeriodCommand_1.GetSnoozePeriodResponseCommand);
            return snoozePeriod;
        });
    }
    setSnoozePeriod(snoozeOn, startTs = 0, endTs = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('boolean', snoozeOn) &&
                (0, validator_1.isTypeOf)('number', startTs) &&
                (0, validator_1.isTypeOf)('number', endTs))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new setSnoozePeriodCommand_1.SetSnoozePeriodRequestCommand({
                userId: sdkState.userId,
                snoozeOn,
                startTs,
                endTs,
            });
            const response = yield requestQueue.send(request);
            const { snoozePeriod } = response.as(setSnoozePeriodCommand_1.SetSnoozePeriodResponseCommand);
            return snoozePeriod;
        });
    }
    getMyPushTokensByToken(token, type) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', token) && (0, validator_1.isEnumOf)(types_1.PushTokenType, type))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new getPushTokensCommand_1.GetPushTokensRequestCommand({
                userId: sdkState.userId,
                type,
                token,
            });
            const response = yield requestQueue.send(request);
            const { pushTokens } = response.as(getPushTokensCommand_1.GetPushTokensResponseCommand);
            return pushTokens;
        });
    }
    getPushTriggerOption() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new getPushTriggerOptionCommand_1.GetPushTriggerOptionRequestCommand({
                userId: sdkState.userId,
            });
            const response = yield requestQueue.send(request);
            return response.as(getPushTriggerOptionCommand_1.GetPushTriggerOptionResponseCommand).pushTriggerOption;
        });
    }
    setPushTriggerOption(pushTriggerOption) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isEnumOf)(types_1.PushTriggerOption, pushTriggerOption))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new setPushTriggerOptionCommand_1.SetPushTriggerOptionRequestCommand({
                userId: sdkState.userId,
                pushTriggerOption,
            });
            const response = yield requestQueue.send(request);
            return response.as(setPushTriggerOptionCommand_1.SetPushTriggerOptionResponseCommand).pushTriggerOption;
        });
    }
    getPushTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new getPushTemplateCommand_1.GetPushTemplateRequestCommand({
                userId: sdkState.userId,
            });
            const response = yield requestQueue.send(request);
            return response.as(getPushTemplateCommand_1.GetPushTemplateResponseCommand).name;
        });
    }
    setPushTemplate(templateName) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isEnumOf)(types_1.PushTemplate, templateName))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new setPushTemplateCommand_1.SetPushTemplateRequestCommand({
                userId: sdkState.userId,
                templateName,
            });
            const response = yield requestQueue.send(request);
            return response.as(setPushTemplateCommand_1.SetPushTemplateResponseCommand).name;
        });
    }
    blockUser(userOrUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(userOrUserId instanceof user_1.default || (0, validator_1.isTypeOf)('string', userOrUserId))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new blockUserCommand_1.BlockUserRequestCommand({
                userId: sdkState.userId,
                blockedUserId: (userOrUserId instanceof user_1.default) ? userOrUserId.userId : userOrUserId,
            });
            yield requestQueue.send(request);
        });
    }
    blockUserWithUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blockUser(userId);
        });
    }
    unblockUser(userOrUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(userOrUserId instanceof user_1.default || (0, validator_1.isTypeOf)('string', userOrUserId))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new unblockUserCommand_1.UnblockUserRequestCommand({
                userId: sdkState.userId,
                unblockedUserId: (userOrUserId instanceof user_1.default) ? userOrUserId.userId : userOrUserId,
            });
            yield requestQueue.send(request);
        });
    }
    unblockUserWithUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.unblockUser(userId);
        });
    }
    getFriendChangeLogsByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', token, null))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new getFriendChangeLogsCommand_1.GetFriendChangeLogsByTokenRequestCommand({
                userId: sdkState.userId,
                token,
            });
            const response = yield requestQueue.send(request);
            const { changelogs } = response.as(getFriendChangeLogsCommand_1.GetFriendChangeLogsByTokenResponseCommand);
            return changelogs;
        });
    }
    getAllowFriendDiscovery() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new getAllowFriendDiscoveryCommand_1.GetAllowFriendDiscoveryRequestCommand({ userId: sdkState.userId });
            const response = yield requestQueue.send(request);
            const { allowFriendDiscovery } = response.as(getAllowFriendDiscoveryCommand_1.GetAllowFriendDiscoveryResponseCommand);
            return allowFriendDiscovery;
        });
    }
    setAllowFriendDiscovery(allowFriendDiscovery) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('boolean', allowFriendDiscovery))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new setAllowFriendDiscoveryCommand_1.SetAllowFriendDiscoveryRequestCommand({ userId: sdkState.userId, allowFriendDiscovery });
            yield requestQueue.send(request);
            return allowFriendDiscovery;
        });
    }
    uploadFriendDiscoveries(discoveries) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new uploadFriendDiscoveriesCommand_1.UploadFriendDiscoveriesRequestCommand({
                userId: sdkState.userId,
                discoveries,
            });
            const response = yield requestQueue.send(request);
            const { friendDiscoveryRequestId } = response.as(uploadFriendDiscoveriesCommand_1.UploadFriendDiscoveriesResponseCommand);
            return friendDiscoveryRequestId;
        });
    }
    deleteFriendDiscovery(discoveryKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deleteFriendDiscoveries([discoveryKey]);
        });
    }
    deleteFriendDiscoveries(discoveryKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isArrayOf)('string', discoveryKeys))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new deleteFriendDiscoveriesCommand_1.DeleteFriendDiscoveriesRequestCommand({
                userId: sdkState.userId,
                discoveryKeys,
            });
            yield requestQueue.send(request);
        });
    }
    addFriends(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isArrayOf)('string', userIds))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new addFriendsCommand_1.AddFriendsRequestCommand({
                userId: sdkState.userId,
                userIds,
            });
            const response = yield requestQueue.send(request);
            const { users } = response.as(addFriendsCommand_1.AddFriendsResponseCommand);
            return users;
        });
    }
    deleteFriend(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deleteFriends([userId]);
        });
    }
    deleteFriends(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isArrayOf)('string', userIds))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new deleteFriendsCommand_1.DeleteFriendsRequestCommand({
                userId: sdkState.userId,
                userIds,
            });
            yield requestQueue.send(request);
        });
    }
    getAllEmoji() {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new getAllEmojiCommand_1.GetAllEmojiRequestCommand();
            const response = yield requestQueue.send(request);
            const { emojiContainer } = response.as(getAllEmojiCommand_1.GetAllEmojiResponseCommand);
            return emojiContainer;
        });
    }
    getEmojiCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new getEmojiCategoryCommand_1.GetEmojiCategoryRequestCommand({ categoryId });
            const response = yield requestQueue.send(request);
            const { emojiCategory } = response.as(getEmojiCategoryCommand_1.GetEmojiCategoryResponseCommand);
            return emojiCategory;
        });
    }
    getEmoji(emojiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new getEmojiCommand_1.GetEmojiRequestCommand({ key: emojiKey });
            const response = yield requestQueue.send(request);
            const { emoji } = response.as(getEmojiCommand_1.GetEmojiResponseCommand);
            return emoji;
        });
    }
    getUnreadItemCount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(params instanceof unreadItemCountParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new getUnreadItemCountCommand_1.GetUnreadItemCountRequestCommand({
                userId: sdkState.userId,
                filter: params,
            });
            const response = yield requestQueue.send(request);
            return response.as(getUnreadItemCountCommand_1.GetUnreadItemCountResponseCommand);
        });
    }
    getTotalUnreadChannelCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new getTotalUnreadChannelCountCommand_1.GetTotalUnreadChannelCountRequestCommand({
                userId: sdkState.userId,
            });
            const response = yield requestQueue.send(request);
            const { unreadCount } = response.as(getTotalUnreadChannelCountCommand_1.GetTotalUnreadChannelCountResponseCommand);
            return unreadCount;
        });
    }
    getTotalUnreadMessageCount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(params instanceof totalUnreadMessageCountParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new getTotalUnreadMessageCountCommand_1.GetTotalUnreadMessageCountRequestCommand({
                userId: sdkState.userId,
                filter: params,
            });
            const response = yield requestQueue.send(request);
            const { unreadCount } = response.as(getTotalUnreadMessageCountCommand_1.GetTotalUnreadMessageCountResponseCommand);
            return unreadCount;
        });
    }
    getSubscribedTotalUnreadMessageCount() {
        const { subscribedUnreadMessageCount } = vault_1.default.of(this._iid);
        return subscribedUnreadMessageCount.all >= 0 ? subscribedUnreadMessageCount.all : 0;
    }
    getSubscribedCustomTypeTotalUnreadMessageCount() {
        let sum = 0;
        const { subscribedUnreadMessageCount } = vault_1.default.of(this._iid);
        for (let customType in subscribedUnreadMessageCount.customTypes) {
            sum += subscribedUnreadMessageCount.customTypes[customType];
        }
        return sum;
    }
    getSubscribedCustomTypeUnreadMessageCount(customType) {
        var _a;
        const { subscribedUnreadMessageCount } = vault_1.default.of(this._iid);
        return (_a = subscribedUnreadMessageCount.customTypes[customType]) !== null && _a !== void 0 ? _a : 0;
    }
}
exports.default = SendbirdChat;
__exportStar(require("./exports"), exports);
//# sourceMappingURL=sendbird.js.map