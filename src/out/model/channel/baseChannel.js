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
const vault_1 = require("../../vault");
const instancedObject_1 = require("../instancedObject");
const user_1 = require("../user");
const types_1 = require("./types");
const messageManager_1 = require("../../manager/messageManager");
const sender_1 = require("../message/sender");
const baseMessage_1 = require("../message/baseMessage");
const userMessage_1 = require("../message/userMessage");
const fileMessage_1 = require("../message/fileMessage");
const sendableMessage_1 = require("../message/sendableMessage");
const messageMetaArray_1 = require("../message/messageMetaArray");
const messageRequestHandler_1 = require("../message/messageRequestHandler");
const appleCriticalAlertOptions_1 = require("../message/appleCriticalAlertOptions");
const types_2 = require("../message/types");
const userMessageParams_1 = require("../params/userMessageParams");
const fileMessageParams_1 = require("../params/fileMessageParams");
const userMessageUpdateParams_1 = require("../params/userMessageUpdateParams");
const fileMessageUpdateParams_1 = require("../params/fileMessageUpdateParams");
const messageListParams_1 = require("../params/messageListParams");
const messageChangeLogsParams_1 = require("../params/messageChangeLogsParams");
const operatorListQuery_1 = require("../../query/operatorListQuery");
const previousMessageListQuery_1 = require("../../query/previousMessageListQuery");
const mutedUserListQuery_1 = require("../../query/mutedUserListQuery");
const bannedUserListQuery_1 = require("../../query/bannedUserListQuery");
const error_1 = require("../../error");
const report_1 = require("../report");
const groupChannelEventCommand_1 = require("../../comm/command/internal/groupChannelEventCommand");
const messageEventCommand_1 = require("../../comm/command/internal/messageEventCommand");
const addOperatorsCommand_1 = require("../../comm/command/channel/addOperatorsCommand");
const removeOperatorsCommand_1 = require("../../comm/command/channel/removeOperatorsCommand");
const getMyMutedInfoCommand_1 = require("../../comm/command/channel/getMyMutedInfoCommand");
const getMetaDataCommand_1 = require("../../comm/command/channel/getMetaDataCommand");
const createMetaDataCommand_1 = require("../../comm/command/channel/createMetaDataCommand");
const updateMetaDataCommand_1 = require("../../comm/command/channel/updateMetaDataCommand");
const deleteMetaDataCommand_1 = require("../../comm/command/channel/deleteMetaDataCommand");
const deleteAllMetaDataCommand_1 = require("../../comm/command/channel/deleteAllMetaDataCommand");
const getMetaCountersCommand_1 = require("../../comm/command/channel/getMetaCountersCommand");
const createMetaCountersCommand_1 = require("../../comm/command/channel/createMetaCountersCommand");
const updateMetaCountersCommand_1 = require("../../comm/command/channel/updateMetaCountersCommand");
const deleteMetaCounterCommand_1 = require("../../comm/command/channel/deleteMetaCounterCommand");
const deleteAllMetaCountersCommand_1 = require("../../comm/command/channel/deleteAllMetaCountersCommand");
const muteUserCommand_1 = require("../../comm/command/channel/muteUserCommand");
const unmuteUserCommand_1 = require("../../comm/command/channel/unmuteUserCommand");
const banUserCommand_1 = require("../../comm/command/channel/banUserCommand");
const unbanUserCommand_1 = require("../../comm/command/channel/unbanUserCommand");
const freezeCommand_1 = require("../../comm/command/channel/freezeCommand");
const reportCommand_1 = require("../../comm/command/channel/reportCommand");
const userMessageCommand_1 = require("../../comm/command/message/userMessageCommand");
const updateUserMessageCommand_1 = require("../../comm/command/message/updateUserMessageCommand");
const updateFileMessageCommand_1 = require("../../comm/command/message/updateFileMessageCommand");
const deleteMessageCommand_1 = require("../../comm/command/message/deleteMessageCommand");
const addReactionCommand_1 = require("../../comm/command/message/addReactionCommand");
const deleteReactionCommand_1 = require("../../comm/command/message/deleteReactionCommand");
const translateUserMessageCommand_1 = require("../../comm/command/message/translateUserMessageCommand");
const unless_1 = require("../../utils/unless");
const validator_1 = require("../../utils/validator");
const deundefined_1 = require("../../utils/deundefined");
const deferred_1 = require("../../utils/deferred");
const uuid_1 = require("../../utils/uuid");
const sleep_1 = require("../../utils/sleep");
const PENDING_MESSAGE_DELAY = 5;
class BaseChannel extends instancedObject_1.default {
    constructor(_iid, payload) {
        var _a, _b, _c, _d;
        super(_iid);
        this.url = '';
        this.channelType = types_1.ChannelType.BASE;
        this.name = '';
        this.coverUrl = '';
        this.customType = '';
        this.data = '';
        this.isFrozen = false;
        this.isEphemeral = false;
        this.creator = null;
        this.createdAt = 0;
        this.url = payload['channel_url'];
        this.name = (_a = payload['name']) !== null && _a !== void 0 ? _a : '';
        this.coverUrl = (_b = payload['cover_url']) !== null && _b !== void 0 ? _b : '';
        this.customType = (_c = payload['custom_type']) !== null && _c !== void 0 ? _c : '';
        this.data = (_d = payload['data']) !== null && _d !== void 0 ? _d : '';
        this.isFrozen = (0, validator_1.isTypeOf)('boolean', payload['freeze']) ? payload['freeze'] : false;
        this.isEphemeral = (0, validator_1.isTypeOf)('boolean', payload['is_ephemeral']) ? payload['is_ephemeral'] : false;
        this.creator = payload['created_by'] ? new user_1.default(this._iid, payload['created_by']) : null;
        this.createdAt = payload['created_at'] * 1000;
        this._cachedMetaData = new Map();
        if (payload['metadata'] && payload['ts']) {
            Object.keys(payload['metadata']).forEach((key) => {
                this._cachedMetaData.set(key, {
                    value: payload['metadata'][key],
                    isRemoved: false,
                    updatedAt: payload['ts'],
                });
            });
        }
    }
    static payloadify(obj) {
        return (0, deundefined_1.deundefined)(Object.assign(Object.assign({}, super.payloadify(obj)), { 'channel_url': obj.url, 'name': obj.name, 'cover_url': obj.coverUrl, 'custom_type': obj.customType, 'data': obj.data, 'freeze': obj.isFrozen, 'is_ephemeral': obj.isEphemeral, 'created_by': user_1.default.payloadify(obj.creator), 'created_at': obj.createdAt / 1000 }));
    }
    get isGroupChannel() {
        return this.channelType === types_1.ChannelType.GROUP;
    }
    get isOpenChannel() {
        return this.channelType === types_1.ChannelType.OPEN;
    }
    get cachedMetaData() {
        const result = {};
        this._cachedMetaData.forEach((info, key) => {
            if (!info.isRemoved) {
                result[key] = info.value;
            }
        });
        return result;
    }
    _upsertCachedMetaData(metaData, ts) {
        Object.keys(metaData).forEach((key) => {
            const cachedMetaData = this._cachedMetaData.get(key);
            if (!cachedMetaData || cachedMetaData.updatedAt <= ts) {
                this._cachedMetaData.set(key, {
                    value: metaData[key],
                    isRemoved: false,
                    updatedAt: ts,
                });
            }
        });
    }
    _removeFromCachedMetaData(keys, ts) {
        keys.forEach((key) => {
            const cachedMetaData = this._cachedMetaData.get(key);
            if (cachedMetaData && cachedMetaData.updatedAt < ts) {
                cachedMetaData.isRemoved = false;
                cachedMetaData.updatedAt = ts;
            }
        });
    }
    _generateRequestId() {
        return `rq-${(0, uuid_1.uuid)()}`;
    }
    isIdentical(channel) {
        return channel && this.url === channel.url;
    }
    isEqual(channel) {
        return (0, validator_1.deepEqual)(this, channel);
    }
    createOperatorListQuery(params) {
        return new operatorListQuery_1.default(this._iid, this.url, this.channelType, params);
    }
    createMutedUserListQuery(params) {
        return new mutedUserListQuery_1.default(this._iid, this.url, this.channelType, params);
    }
    createBannedUserListQuery(params) {
        return new bannedUserListQuery_1.default(this._iid, this.url, this.channelType, params);
    }
    createPreviousMessageListQuery(params) {
        return new previousMessageListQuery_1.default(this._iid, this.url, this.channelType, params);
    }
    addOperators(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isArrayOf)('string', userIds))
                .throw(error_1.default.invalidParameters);
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new addOperatorsCommand_1.AddOperatorsRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                operatorUserIds: userIds,
            });
            yield requestQueue.send(request);
        });
    }
    removeOperators(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isArrayOf)('string', userIds))
                .throw(error_1.default.invalidParameters);
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new removeOperatorsCommand_1.RemoveOperatorsRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                operatorUserIds: userIds,
            });
            yield requestQueue.send(request);
        });
    }
    getMyMutedInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new getMyMutedInfoCommand_1.GetMyMutedInfoRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                userId: sdkState.userId,
            });
            const response = yield requestQueue.send(request);
            const { isMuted, startAt, endAt, remainingDuration, description, } = response.as(getMyMutedInfoCommand_1.GetMyMutedInfoResponseCommand);
            return {
                isMuted,
                startAt,
                endAt,
                remainingDuration,
                description,
            };
        });
    }
    getMetaData(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isArrayOf)('string', keys))
                .throw(error_1.default.invalidParameters);
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new getMetaDataCommand_1.GetMetaDataRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                keys,
            });
            const response = yield requestQueue.send(request);
            const { metadata, ts } = response.as(getMetaDataCommand_1.GetMetaDataResponseCommand);
            this._upsertCachedMetaData(metadata, ts);
            return metadata;
        });
    }
    getAllMetaData() {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new getMetaDataCommand_1.GetMetaDataRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                keys: [],
            });
            const response = yield requestQueue.send(request);
            const { metadata, ts } = response.as(getMetaDataCommand_1.GetMetaDataResponseCommand);
            this._upsertCachedMetaData(metadata, ts);
            return metadata;
        });
    }
    createMetaData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new createMetaDataCommand_1.CreateMetaDataRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                metadata: data,
            });
            const response = yield requestQueue.send(request);
            const { metaData } = response.as(createMetaDataCommand_1.CreateMetaDataResponseCommand);
            this._upsertCachedMetaData(metaData, 0);
            return metaData;
        });
    }
    updateMetaData(data, upsert = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new updateMetaDataCommand_1.UpdateMetaDataRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                metadata: data,
                upsert,
            });
            const response = yield requestQueue.send(request);
            const { metadata, ts } = response.as(updateMetaDataCommand_1.UpdateMetaDataResponseCommand);
            this._upsertCachedMetaData(metadata, ts);
            return metadata;
        });
    }
    deleteMetaData(key) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', key))
                .throw(error_1.default.invalidParameters);
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new deleteMetaDataCommand_1.DeleteMetaDataRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                key,
            });
            const response = yield requestQueue.send(request);
            const { ts } = response.as(deleteMetaDataCommand_1.DeleteMetaDataResponseCommand);
            this._removeFromCachedMetaData([key], ts);
        });
    }
    deleteAllMetaData() {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new deleteAllMetaDataCommand_1.DeleteAllMetaDataRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
            });
            const response = yield requestQueue.send(request);
            const { ts } = response.as(deleteAllMetaDataCommand_1.DeleteAllMetaDataResponseCommand);
            this._removeFromCachedMetaData([...this._cachedMetaData.keys()], ts);
        });
    }
    getMetaCounters(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isArrayOf)('string', keys))
                .throw(error_1.default.invalidParameters);
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new getMetaCountersCommand_1.GetMetaCountersRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                keys,
            });
            const response = yield requestQueue.send(request);
            const { metaCounter } = response.as(getMetaCountersCommand_1.GetMetaCountersResponseCommand);
            return metaCounter;
        });
    }
    getAllMetaCounters() {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new getMetaCountersCommand_1.GetMetaCountersRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                keys: [],
            });
            const response = yield requestQueue.send(request);
            const { metaCounter } = response.as(getMetaCountersCommand_1.GetMetaCountersResponseCommand);
            return metaCounter;
        });
    }
    createMetaCounters(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new createMetaCountersCommand_1.CreateMetaCountersRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                metaCounter: data,
            });
            const response = yield requestQueue.send(request);
            const { metaCounter } = response.as(createMetaCountersCommand_1.CreateMetaCountersResponseCommand);
            return metaCounter;
        });
    }
    updateMetaCounters(data, upsert = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new updateMetaCountersCommand_1.UpdateMetaCountersRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                metaCounter: data,
                upsert,
            });
            const response = yield requestQueue.send(request);
            const { metaCounter } = response.as(updateMetaCountersCommand_1.UpdateMetaCountersResponseCommand);
            return metaCounter;
        });
    }
    increaseMetaCounters(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new updateMetaCountersCommand_1.UpdateMetaCountersRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                metaCounter: data,
                upsert: false,
                mode: 'increase',
            });
            const response = yield requestQueue.send(request);
            const { metaCounter } = response.as(updateMetaCountersCommand_1.UpdateMetaCountersResponseCommand);
            return metaCounter;
        });
    }
    decreaseMetaCounters(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new updateMetaCountersCommand_1.UpdateMetaCountersRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                metaCounter: data,
                upsert: false,
                mode: 'decrease',
            });
            const response = yield requestQueue.send(request);
            const { metaCounter } = response.as(updateMetaCountersCommand_1.UpdateMetaCountersResponseCommand);
            return metaCounter;
        });
    }
    deleteMetaCounter(key) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', key))
                .throw(error_1.default.invalidParameters);
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new deleteMetaCounterCommand_1.DeleteMetaCounterRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                key,
            });
            yield requestQueue.send(request);
        });
    }
    deleteAllMetaCounters() {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new deleteAllMetaCountersCommand_1.DeleteAllMetaCountersRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
            });
            yield requestQueue.send(request);
        });
    }
    muteUser(user, duration, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.muteUserWithUserId(user.userId, duration, description);
        });
    }
    muteUserWithUserId(userId, duration, description) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', userId) && (0, validator_1.isTypeOf)('number', duration, true) && (0, validator_1.isTypeOf)('string', description, true))
                .throw(error_1.default.invalidParameters);
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new muteUserCommand_1.MuteUserRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                userId,
                seconds: duration,
                description,
            });
            yield requestQueue.send(request);
        });
    }
    unmuteUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.unmuteUserWithUserId(user.userId);
        });
    }
    unmuteUserWithUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', userId))
                .throw(error_1.default.invalidParameters);
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new unmuteUserCommand_1.UnmuteUserRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                userId,
            });
            yield requestQueue.send(request);
        });
    }
    banUser(user, duration, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.banUserWithUserId(user.userId, duration, description);
        });
    }
    banUserWithUserId(userId, duration, description) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', userId) && (0, validator_1.isTypeOf)('number', duration, true) && (0, validator_1.isTypeOf)('string', description, true))
                .throw(error_1.default.invalidParameters);
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new banUserCommand_1.BanUserRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                userId,
                seconds: duration,
                description,
            });
            yield requestQueue.send(request);
        });
    }
    unbanUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.unbanUserWithUserId(user.userId);
        });
    }
    unbanUserWithUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', userId))
                .throw(error_1.default.invalidParameters);
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new unbanUserCommand_1.UnbanUserRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                userId,
            });
            yield requestQueue.send(request);
        });
    }
    freeze() {
        return __awaiter(this, void 0, void 0, function* () {
            const { dispatcher, requestQueue } = vault_1.default.of(this._iid);
            const request = new freezeCommand_1.FreezeRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                freezing: true,
            });
            yield requestQueue.send(request);
            this.isFrozen = true;
            dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                channels: [this],
                source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_HIDDEN,
            }));
        });
    }
    unfreeze() {
        return __awaiter(this, void 0, void 0, function* () {
            const { dispatcher, requestQueue } = vault_1.default.of(this._iid);
            const request = new freezeCommand_1.FreezeRequestCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                freezing: false,
            });
            yield requestQueue.send(request);
            this.isFrozen = false;
            dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                channels: [this],
                source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_UNHIDDEN,
            }));
        });
    }
    getMessagesByTimestamp(ts, params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('number', ts) && params instanceof messageListParams_1.default)
                .throw(error_1.default.invalidParameters);
            const messageManager = messageManager_1.default.of(this._iid);
            return yield messageManager.getMessagesByTimestamp(this.url, this.channelType, ts, params);
        });
    }
    getMessageChangelogsSinceTimestamp(ts, params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('number', ts) && params instanceof messageChangeLogsParams_1.default)
                .throw(error_1.default.invalidParameters);
            const messageManager = messageManager_1.default.of(this._iid);
            return yield messageManager.getMessageChangelogs(this.url, this.channelType, ts, params);
        });
    }
    getMessageChangelogsSinceToken(token, params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', token) && params instanceof messageChangeLogsParams_1.default)
                .throw(error_1.default.invalidParameters);
            const messageManager = messageManager_1.default.of(this._iid);
            return yield messageManager.getMessageChangelogs(this.url, this.channelType, token, params);
        });
    }
    _createPendingSendableMessagePayload(params, requestId) {
        const { sessionManager } = vault_1.default.of(this._iid);
        return (0, deundefined_1.deundefined)({
            'channel_url': this.url,
            'channel_type': this.channelType,
            'msg_id': 0,
            'parent_message_id': params.parentMessageId,
            'data': params.data,
            'custom_type': params.customType,
            'mention_type': params.mentionType,
            'sorted_metaarray': params.metaArrays ?
                params.metaArrays.map((metaArray) => messageMetaArray_1.default.payloadify(metaArray)) :
                null,
            'apple_critical_alert_options': params.appleCriticalAlertOptions ?
                appleCriticalAlertOptions_1.default.payloadify(params.appleCriticalAlertOptions) :
                null,
            'created_at': Date.now(),
            'user': sender_1.default.payloadify(sessionManager.currentUser),
            'req_id': requestId,
            'request_state': types_2.RequestState.PENDING,
            'requested_mention_user_ids': params.mentionedUserIds,
        });
    }
    _createPendingUserMessage(params, requestId) {
        const translations = {};
        if (params.translationTargetLanguages) {
            for (const lang of params.translationTargetLanguages)
                translations[lang] = '';
        }
        const payload = (0, deundefined_1.deundefined)(Object.assign(Object.assign({}, this._createPendingSendableMessagePayload(params, requestId)), { 'type': types_2.MessageType.USER, 'message': params.message, 'translations': translations }));
        return new userMessage_1.default(this._iid, payload);
    }
    _createPendingFileMessage(params, requestId) {
        const payload = (0, deundefined_1.deundefined)(Object.assign(Object.assign({}, this._createPendingSendableMessagePayload(params, requestId)), { 'type': types_2.MessageType.FILE, 'url': typeof params.file === 'string' ? params.file : '', 'file': {
                'name': params.fileName,
                'size': params.fileSize,
                'type': params.mimeType,
                'data': params.data,
            }, 'thumbnails': params.thumbnailSizes.map((thumbnailSize) => {
                return {
                    'url': '',
                    'width': thumbnailSize.maxWidth,
                    'height': thumbnailSize.maxHeight,
                };
            }) }));
        return new fileMessage_1.default(this._iid, payload);
    }
    _markMessageAsFailed(message, err) {
        message.requestState = (err.code !== error_1.SendbirdErrorCode.REQUEST_CANCELED) ? types_2.RequestState.FAILED : types_2.RequestState.CANCELED;
        message.errorCode = err.code;
    }
    sendUserMessage(params) {
        (0, unless_1.unless)(params instanceof userMessageParams_1.default)
            .throw(error_1.default.invalidParameters);
        const { dispatcher, requestQueue } = vault_1.default.of(this._iid);
        const requestId = this._generateRequestId();
        const requestHandler = new messageRequestHandler_1.default();
        const request = new userMessageCommand_1.SendUserMessageRequestCommand(Object.assign({ channelUrl: this.url, channelType: this.channelType, requestId }, params));
        requestQueue.send(request)
            .then((response) => {
            const { message } = response.as(userMessageCommand_1.UserMessageEventCommand);
            dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({
                messages: [message],
                source: messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_SENT_SUCCESS,
            }));
            requestHandler.trigger(null, message);
        })
            .catch((err) => {
            const failedMessage = this._createPendingUserMessage(params, requestId);
            this._markMessageAsFailed(failedMessage, err);
            dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({
                messages: [failedMessage],
                source: messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_SENT_FAILED,
            }));
            requestHandler.trigger(err, failedMessage);
        });
        (0, sleep_1.sleep)(PENDING_MESSAGE_DELAY)
            .then(() => {
            const pendingMessage = this._createPendingUserMessage(params, requestId);
            dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({
                messages: [pendingMessage],
                source: messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_SENT_PENDING,
            }));
            requestHandler.trigger(null, pendingMessage);
        });
        return requestHandler;
    }
    resendUserMessage(failedMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(failedMessage instanceof userMessage_1.default)
                .throw(error_1.default.invalidParameters);
            const deferred = new deferred_1.Deferred();
            const params = userMessageParams_1.default.fromFailedUserMessage(failedMessage);
            this.sendUserMessage(params)
                .onFailed((err) => deferred.reject(err))
                .onSucceeded((message) => deferred.resolve(message));
            return deferred.promise;
        });
    }
    updateUserMessage(messageId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('number', messageId) && params instanceof userMessageUpdateParams_1.default)
                .throw(error_1.default.invalidParameters);
            const { dispatcher, requestQueue } = vault_1.default.of(this._iid);
            const request = new updateUserMessageCommand_1.UpdateUserMessageRequestCommand(Object.assign({ channelType: this.channelType, channelUrl: this.url, messageId }, params));
            const response = yield requestQueue.send(request);
            const { message } = response.as(updateUserMessageCommand_1.UpdateUserMessageEventCommand);
            dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({
                messages: [message],
                source: messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_UPDATED,
            }));
            return message;
        });
    }
    copyUserMessage(targetChannel, message) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(targetChannel instanceof BaseChannel && message instanceof userMessage_1.default && targetChannel.url === message.channelUrl)
                .throw(error_1.default.invalidParameters);
            const deferred = new deferred_1.Deferred();
            const params = new userMessageParams_1.default(Object.assign(Object.assign({}, message), { mentionType: message.mentionType, mentionedUserIds: message.mentionedUsers.map((user) => user.userId), translationTargetLanguages: Object.keys(message.translations), pushNotificationDeliveryOption: types_2.PushNotificationDeliveryOption.DEFAULT, parentMessageId: null, isReplyToChannel: false }));
            targetChannel.sendUserMessage(params)
                .onSucceeded((message) => deferred.resolve(message))
                .onFailed((err) => deferred.reject(err));
            return deferred.promise;
        });
    }
    translateUserMessage(targetMessage, languages) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(targetMessage instanceof userMessage_1.default && targetMessage.messageId > 0 && (0, validator_1.isArrayOf)('string', languages))
                .throw(error_1.default.invalidParameters);
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new translateUserMessageCommand_1.TranslateUserMessageRequestCommand({
                channelType: this.channelType,
                channelUrl: this.url,
                messageId: targetMessage.messageId,
                translationTargetLanguages: languages,
            });
            const response = yield requestQueue.send(request);
            const { message } = response.as(translateUserMessageCommand_1.TranslateUserMessageResponseCommand);
            return message;
        });
    }
    sendFileMessage(params) {
        (0, unless_1.unless)(params instanceof fileMessageParams_1.default)
            .throw(error_1.default.invalidParameters);
        const { dispatcher } = vault_1.default.of(this._iid);
        const { fileMessageQueue } = messageManager_1.default.of(this._iid);
        const requestId = this._generateRequestId();
        const requestHandler = new messageRequestHandler_1.default();
        fileMessageQueue.request(this, requestId, params)
            .then((message) => {
            dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({
                messages: [message],
                source: messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_SENT_SUCCESS,
            }));
            requestHandler.trigger(null, message);
        })
            .catch((err) => {
            const failedMessage = this._createPendingFileMessage(params, requestId);
            this._markMessageAsFailed(failedMessage, err);
            dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({
                messages: [failedMessage],
                source: messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_SENT_FAILED,
            }));
            requestHandler.trigger(err, failedMessage);
        });
        (0, sleep_1.sleep)(PENDING_MESSAGE_DELAY)
            .then(() => {
            const pendingMessage = this._createPendingFileMessage(params, requestId);
            dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({
                messages: [pendingMessage],
                source: messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_SENT_PENDING,
            }));
            requestHandler.trigger(null, pendingMessage);
        });
        return requestHandler;
    }
    sendFileMessages(paramsList) {
        (0, unless_1.unless)(paramsList.every((params) => params instanceof fileMessageParams_1.default))
            .throw(error_1.default.invalidParameters);
        const requestHandler = new messageRequestHandler_1.default();
        for (const params of paramsList) {
            this.sendFileMessage(params)
                .onPending((pendingMessage) => requestHandler.trigger(null, pendingMessage))
                .onFailed((err, failedMessage) => requestHandler.trigger(err, failedMessage))
                .onSucceeded((message) => requestHandler.trigger(null, message));
        }
        return requestHandler;
    }
    resendFileMessage(failedMessage, blob) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(failedMessage instanceof fileMessage_1.default && blob instanceof Blob)
                .throw(error_1.default.invalidParameters);
            const deferred = new deferred_1.Deferred();
            const params = fileMessageParams_1.default.fromFailedFileMessage(failedMessage, blob);
            this.sendFileMessage(params)
                .onFailed((err) => deferred.reject(err))
                .onSucceeded((message) => deferred.resolve(message));
            return deferred.promise;
        });
    }
    updateFileMessage(messageId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('number', messageId) && params instanceof fileMessageUpdateParams_1.default)
                .throw(error_1.default.invalidParameters);
            const { dispatcher, requestQueue } = vault_1.default.of(this._iid);
            const request = new updateFileMessageCommand_1.UpdateFileMessageRequestCommand(Object.assign({ channelType: this.channelType, channelUrl: this.url, messageId }, params));
            const response = yield requestQueue.send(request);
            const { message } = response.as(updateFileMessageCommand_1.UpdateFileMessageEventCommand);
            dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({
                messages: [message],
                source: messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_UPDATED,
            }));
            return message;
        });
    }
    cancelUploadingFileMessage(requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', requestId))
                .throw(error_1.default.invalidParameters);
            const { fileMessageQueue } = messageManager_1.default.of(this._iid);
            fileMessageQueue.cancel(this, requestId);
            return true;
        });
    }
    copyFileMessage(targetChannel, message) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(targetChannel instanceof BaseChannel && message instanceof fileMessage_1.default && targetChannel.url === message.channelUrl)
                .throw(error_1.default.invalidParameters);
            const deferred = new deferred_1.Deferred();
            const params = new fileMessageParams_1.default(Object.assign(Object.assign({}, message), { file: message.url, fileName: message.name, fileSize: message.size, mimeType: message.type, mentionType: message.mentionType, mentionedUserIds: message.mentionedUsers.map((user) => user.userId), pushNotificationDeliveryOption: types_2.PushNotificationDeliveryOption.DEFAULT, parentMessageId: null, isReplyToChannel: false, thumbnailSizes: message.thumbnails.map((thumbnail) => {
                    return {
                        maxWidth: thumbnail.width,
                        maxHeight: thumbnail.height,
                    };
                }) }));
            targetChannel.sendFileMessage(params)
                .onSucceeded((message) => deferred.resolve(message))
                .onFailed((err) => deferred.reject(err));
            return deferred.promise;
        });
    }
    deleteMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(message instanceof sendableMessage_1.default)
                .throw(error_1.default.invalidParameters);
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new deleteMessageCommand_1.DeleteMessageRequestCommand({
                channelType: this.channelType,
                channelUrl: this.url,
                messageId: message.messageId,
            });
            yield requestQueue.send(request);
        });
    }
    addReaction(message, key) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(message instanceof baseMessage_1.default && message.messageId > 0 && (0, validator_1.isTypeOf)('string', key))
                .throw(error_1.default.invalidParameters);
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new addReactionCommand_1.AddReactionRequestCommand({
                channelType: this.channelType,
                channelUrl: this.url,
                messageId: message.messageId,
                reactionKey: key,
            });
            const response = yield requestQueue.send(request);
            const { reactionEvent } = response.as(addReactionCommand_1.AddReactionResponseCommand);
            return reactionEvent;
        });
    }
    deleteReaction(message, key) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(message instanceof baseMessage_1.default && message.messageId > 0 && (0, validator_1.isTypeOf)('string', key))
                .throw(error_1.default.invalidParameters);
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new deleteReactionCommand_1.DeleteReactionRequestCommand({
                channelType: this.channelType,
                channelUrl: this.url,
                messageId: message.messageId,
                reactionKey: key,
            });
            const response = yield requestQueue.send(request);
            const { reactionEvent } = response.as(deleteReactionCommand_1.DeleteReactionResponseCommand);
            return reactionEvent;
        });
    }
    _updateMessageMetaArray(messageId, metaArrays, mode, upsert) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dispatcher, requestQueue } = vault_1.default.of(this._iid);
            const request = new updateUserMessageCommand_1.UpdateUserMessageRequestCommand({
                channelType: this.channelType,
                channelUrl: this.url,
                messageId,
                metaArrayParams: { metaArrays, mode, upsert },
            });
            const response = yield requestQueue.send(request);
            const { message } = response.as(updateUserMessageCommand_1.UpdateUserMessageEventCommand);
            dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({
                messages: [message],
                source: messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_UPDATED,
            }));
            return message;
        });
    }
    createMessageMetaArrayKeys(message, keys) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(message instanceof sendableMessage_1.default && message.messageId > 0 && (0, validator_1.isArrayOf)('string', keys))
                .throw(error_1.default.invalidParameters);
            const metaArrays = keys.map((key) => new messageMetaArray_1.default({ key }));
            return this._updateMessageMetaArray(message.messageId, metaArrays, 'add', true);
        });
    }
    deleteMessageMetaArrayKeys(message, keys) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(message instanceof sendableMessage_1.default && message.messageId > 0 && (0, validator_1.isArrayOf)('string', keys))
                .throw(error_1.default.invalidParameters);
            const metaArrays = keys.map((key) => new messageMetaArray_1.default({ key }));
            return this._updateMessageMetaArray(message.messageId, metaArrays, 'remove', true);
        });
    }
    addMessageMetaArrayValues(message, metaArrays) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(message instanceof sendableMessage_1.default &&
                message.messageId > 0 &&
                metaArrays.every((metaArray) => metaArray instanceof messageMetaArray_1.default))
                .throw(error_1.default.invalidParameters);
            return this._updateMessageMetaArray(message.messageId, metaArrays, 'add', true);
        });
    }
    removeMessageMetaArrayValues(message, metaArrays) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(message instanceof sendableMessage_1.default &&
                message.messageId > 0 &&
                metaArrays.every((metaArray) => metaArray instanceof messageMetaArray_1.default))
                .throw(error_1.default.invalidParameters);
            return this._updateMessageMetaArray(message.messageId, metaArrays, 'remove', true);
        });
    }
    report(category, description) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isEnumOf)(report_1.ReportCategory, category) && (0, validator_1.isTypeOf)('string', description))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new reportCommand_1.ReportChannelCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                userId: sdkState.userId,
                category,
                description,
            });
            yield requestQueue.send(request);
        });
    }
    reportUser(user, category, description) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(user instanceof user_1.default && (0, validator_1.isEnumOf)(report_1.ReportCategory, category) && (0, validator_1.isTypeOf)('string', description))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new reportCommand_1.ReportUserCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                userId: sdkState.userId,
                offendingUserId: user.userId,
                category,
                description,
            });
            yield requestQueue.send(request);
        });
    }
    reportMessage(message, category, description) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(message instanceof sendableMessage_1.default && (0, validator_1.isEnumOf)(report_1.ReportCategory, category) && (0, validator_1.isTypeOf)('string', description))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new reportCommand_1.ReportMessageCommand({
                channelUrl: this.url,
                channelType: this.channelType,
                userId: sdkState.userId,
                offendingUserId: message.sender.userId,
                messageId: message.messageId,
                category,
                description,
            });
            yield requestQueue.send(request);
        });
    }
}
exports.default = BaseChannel;
//# sourceMappingURL=baseChannel.js.map