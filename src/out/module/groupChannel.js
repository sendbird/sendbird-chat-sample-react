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
exports.UnreadItemKey = exports.UnreadChannelFilter = exports.SuperChannelFilter = exports.ReadStatus = exports.QueryType = exports.PublicGroupChannelListQuery = exports.PublicGroupChannelListOrder = exports.PublicChannelFilter = exports.MutedState = exports.MessageFilter = exports.MessageCollection = exports.MemberStateFilter = exports.MemberState = exports.MemberListQuery = exports.MemberListOrder = exports.Member = exports.HiddenState = exports.HiddenChannelFilter = exports.GroupChannelUpdateParams = exports.GroupChannelSearchField = exports.GroupChannelListQuery = exports.GroupChannelListOrder = exports.GroupChannelHideParams = exports.GroupChannelHandler = exports.GroupChannelFilter = exports.GroupChannelCountParams = exports.GroupChannelCollection = exports.GroupChannelCreateParams = exports.GroupChannelChangeLogsParams = exports.GroupChannel = exports.GroupChannelModule = exports.CountPreference = void 0;
const error_1 = require("../error");
const baseModule_1 = require("./baseModule");
const groupChannel_1 = require("../model/channel/groupChannel");
exports.GroupChannel = groupChannel_1.default;
Object.defineProperty(exports, "CountPreference", { enumerable: true, get: function () { return groupChannel_1.CountPreference; } });
Object.defineProperty(exports, "HiddenState", { enumerable: true, get: function () { return groupChannel_1.HiddenState; } });
Object.defineProperty(exports, "MutedState", { enumerable: true, get: function () { return groupChannel_1.MutedState; } });
Object.defineProperty(exports, "UnreadItemKey", { enumerable: true, get: function () { return groupChannel_1.UnreadItemKey; } });
const member_1 = require("../model/channel/member");
exports.Member = member_1.default;
Object.defineProperty(exports, "MemberState", { enumerable: true, get: function () { return member_1.MemberState; } });
const readStatus_1 = require("../model/channel/readStatus");
exports.ReadStatus = readStatus_1.default;
const groupChannelListOrder_1 = require("../model/channel/groupChannelListOrder");
Object.defineProperty(exports, "GroupChannelListOrder", { enumerable: true, get: function () { return groupChannelListOrder_1.GroupChannelListOrder; } });
Object.defineProperty(exports, "PublicGroupChannelListOrder", { enumerable: true, get: function () { return groupChannelListOrder_1.PublicGroupChannelListOrder; } });
const groupChannel_2 = require("../collection/groupChannel");
exports.GroupChannelCollection = groupChannel_2.default;
const groupChannelFilter_1 = require("../cache/groupChannelFilter");
exports.GroupChannelFilter = groupChannelFilter_1.default;
const message_1 = require("../collection/message");
exports.MessageCollection = message_1.default;
const messageFilter_1 = require("../cache/messageFilter");
exports.MessageFilter = messageFilter_1.default;
const groupChannelHandler_1 = require("../model/handler/groupChannelHandler");
exports.GroupChannelHandler = groupChannelHandler_1.default;
const groupChannelFilter_2 = require("../model/channel/groupChannelFilter");
Object.defineProperty(exports, "GroupChannelSearchField", { enumerable: true, get: function () { return groupChannelFilter_2.GroupChannelSearchField; } });
Object.defineProperty(exports, "HiddenChannelFilter", { enumerable: true, get: function () { return groupChannelFilter_2.HiddenChannelFilter; } });
Object.defineProperty(exports, "MemberStateFilter", { enumerable: true, get: function () { return groupChannelFilter_2.MemberStateFilter; } });
Object.defineProperty(exports, "PublicChannelFilter", { enumerable: true, get: function () { return groupChannelFilter_2.PublicChannelFilter; } });
Object.defineProperty(exports, "QueryType", { enumerable: true, get: function () { return groupChannelFilter_2.QueryType; } });
Object.defineProperty(exports, "SuperChannelFilter", { enumerable: true, get: function () { return groupChannelFilter_2.SuperChannelFilter; } });
Object.defineProperty(exports, "UnreadChannelFilter", { enumerable: true, get: function () { return groupChannelFilter_2.UnreadChannelFilter; } });
const groupChannelCreateParams_1 = require("../model/params/groupChannelCreateParams");
exports.GroupChannelCreateParams = groupChannelCreateParams_1.default;
const groupChannelCountParams_1 = require("../model/params/groupChannelCountParams");
exports.GroupChannelCountParams = groupChannelCountParams_1.default;
const groupChannelChangeLogsParams_1 = require("../model/params/groupChannelChangeLogsParams");
exports.GroupChannelChangeLogsParams = groupChannelChangeLogsParams_1.default;
const groupChannelHideParams_1 = require("../model/params/groupChannelHideParams");
exports.GroupChannelHideParams = groupChannelHideParams_1.default;
const groupChannelUpdateParams_1 = require("../model/params/groupChannelUpdateParams");
exports.GroupChannelUpdateParams = groupChannelUpdateParams_1.default;
const groupChannelManager_1 = require("../manager/groupChannelManager");
const groupChannelListQuery_1 = require("../query/groupChannelListQuery");
exports.GroupChannelListQuery = groupChannelListQuery_1.default;
const publicGroupChannelListQuery_1 = require("../query/publicGroupChannelListQuery");
exports.PublicGroupChannelListQuery = publicGroupChannelListQuery_1.default;
const memberListQuery_1 = require("../query/memberListQuery");
exports.MemberListQuery = memberListQuery_1.default;
Object.defineProperty(exports, "MemberListOrder", { enumerable: true, get: function () { return memberListQuery_1.MemberListOrder; } });
const unless_1 = require("../utils/unless");
const validator_1 = require("../utils/validator");
class GroupChannelModule extends baseModule_1.default {
    constructor() {
        super(...arguments);
        this.name = 'groupChannel';
    }
    init(_iid, { sdkState, cacheContext, dispatcher, sessionManager, requestQueue, }) {
        super.init(_iid, { sdkState, cacheContext, dispatcher, sessionManager, requestQueue });
        this._manager = new groupChannelManager_1.default(_iid, {
            sdkState,
            cacheContext,
            dispatcher,
            sessionManager,
            requestQueue,
        });
    }
    createGroupChannelCollection(params) {
        return new groupChannel_2.default(this._iid, params);
    }
    createMyGroupChannelListQuery(params) {
        return new groupChannelListQuery_1.default(this._iid, params);
    }
    createPublicGroupChannelListQuery(params) {
        return new publicGroupChannelListQuery_1.default(this._iid, params);
    }
    addGroupChannelHandler(key, handler) {
        (0, unless_1.unless)((0, validator_1.isTypeOf)('string', key) && handler instanceof groupChannelHandler_1.default)
            .throw(error_1.default.invalidParameters);
        this._manager.addHandler(key, handler);
    }
    removeGroupChannelHandler(key) {
        (0, unless_1.unless)((0, validator_1.isTypeOf)('string', key))
            .throw(error_1.default.invalidParameters);
        this._manager.removeHandler(key);
    }
    removeAllGroupChannelHandlers() {
        this._manager.clearHandler();
    }
    buildGroupChannelFromSerializedData(serialized) {
        return this._manager.buildGroupChannelFromSerializedData(serialized);
    }
    buildGroupChannelListQueryFromSerializedData(serialized) {
        return this._manager.buildGroupChannelListQueryFromSerializedData(serialized);
    }
    buildMemberFromSerializedData(serialized) {
        return this._manager.buildMemberFromSerializedData(serialized);
    }
    getChannel(channelUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', channelUrl))
                .throw(error_1.default.invalidParameters);
            return this._manager.getChannel(channelUrl);
        });
    }
    getChannelWithoutCache(channelUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', channelUrl))
                .throw(error_1.default.invalidParameters);
            return this._manager.getChannelWithoutCache(channelUrl);
        });
    }
    getMyGroupChannelChangeLogsByToken(token, params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', token) && params instanceof groupChannelChangeLogsParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            return yield this._manager.getMyGroupChannelChangeLogs(token, params);
        });
    }
    getMyGroupChannelChangeLogsByTimestamp(ts, params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('number', ts) && params instanceof groupChannelChangeLogsParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            return yield this._manager.getMyGroupChannelChangeLogs(ts, params);
        });
    }
    getGroupChannelCount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(params instanceof groupChannelCountParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            return this._manager.getGroupChannelCount(params);
        });
    }
    createChannel(params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(params instanceof groupChannelCreateParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            return this._manager.createChannel(params);
        });
    }
    createDistinctChannelIfNotExist(params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(params instanceof groupChannelCreateParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            if (params)
                params.isDistinct = true;
            return this.createChannel(params);
        });
    }
    createChannelWithUserIds(userIds, isDistinct = false, name = null, coverUrlOrImageFile = null, data = '', customType = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new groupChannelCreateParams_1.default();
            params.addUserIds(userIds);
            params.isDistinct = isDistinct;
            params.name = name;
            params.data = data;
            params.customType = customType;
            if (typeof coverUrlOrImageFile === 'string')
                params.coverUrl = coverUrlOrImageFile;
            else
                params.coverImage = coverUrlOrImageFile;
            return this.createChannel(params);
        });
    }
    markAsReadAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this._manager.markAsReadAll();
        });
    }
    markAsReadWithChannelUrls(channelUrls) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isArrayOf)('string', channelUrls))
                .throw(error_1.default.invalidParameters);
            this._manager.markAsReadWithChannelUrls(channelUrls);
        });
    }
    markAsDelivered(channelUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', channelUrl))
                .throw(error_1.default.invalidParameters);
            const channel = yield this.getChannel(channelUrl);
            yield channel.markAsDelivered();
        });
    }
}
exports.GroupChannelModule = GroupChannelModule;
//# sourceMappingURL=groupChannel.js.map