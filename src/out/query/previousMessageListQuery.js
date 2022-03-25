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
const error_1 = require("../error");
const types_1 = require("../model/message/types");
const channelDataListQuery_1 = require("./channelDataListQuery");
const validator_1 = require("../utils/validator");
const messageManager_1 = require("../manager/messageManager");
class PreviousMessageListQuery extends channelDataListQuery_1.default {
    constructor(iid, channelUrl, channelType, params) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        super(iid, channelUrl, channelType, params);
        this.reverse = false;
        this.messageTypeFilter = types_1.MessageTypeFilter.ALL;
        this.customTypesFilter = null;
        this.senderUserIdsFilter = null;
        this.includeMetaArray = false;
        this.includeReactions = false;
        this.includeReplies = false;
        this.includeParentMessageInfo = false;
        this.includeThreadInfo = false;
        this.showSubchannelMessagesOnly = false;
        this._edge = Number.MAX_SAFE_INTEGER;
        this.reverse = (_a = params.reverse) !== null && _a !== void 0 ? _a : false;
        this.messageTypeFilter = (_b = params.messageTypeFilter) !== null && _b !== void 0 ? _b : types_1.MessageTypeFilter.ALL;
        this.customTypesFilter = (_c = params.customTypesFilter) !== null && _c !== void 0 ? _c : null;
        this.senderUserIdsFilter = (_d = params.senderUserIdsFilter) !== null && _d !== void 0 ? _d : null;
        this.includeMetaArray = (_e = params.includeMetaArray) !== null && _e !== void 0 ? _e : false;
        this.includeReactions = (_f = params.includeReactions) !== null && _f !== void 0 ? _f : false;
        this.includeReplies = (_g = params.includeReplies) !== null && _g !== void 0 ? _g : false;
        this.includeParentMessageInfo = (_h = params.includeParentMessageInfo) !== null && _h !== void 0 ? _h : false;
        this.includeThreadInfo = (_j = params.includeThreadInfo) !== null && _j !== void 0 ? _j : false;
        this.showSubchannelMessagesOnly = (_k = params.showSubchannelMessagesOnly) !== null && _k !== void 0 ? _k : false;
    }
    _validate() {
        return (super._validate() &&
            (0, validator_1.isTypeOf)('boolean', this.reverse) &&
            (0, validator_1.isEnumOf)(types_1.MessageTypeFilter, this.messageTypeFilter) &&
            (0, validator_1.isArrayOf)('string', this.customTypesFilter, true) &&
            (0, validator_1.isArrayOf)('string', this.senderUserIdsFilter, true) &&
            (0, validator_1.isTypeOf)('boolean', this.includeMetaArray) &&
            (0, validator_1.isTypeOf)('boolean', this.includeReactions) &&
            (0, validator_1.isTypeOf)('boolean', this.includeReplies) &&
            (0, validator_1.isTypeOf)('boolean', this.includeParentMessageInfo) &&
            (0, validator_1.isTypeOf)('boolean', this.includeThreadInfo) &&
            (0, validator_1.isTypeOf)('boolean', this.showSubchannelMessagesOnly));
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._validate()) {
                if (!this._isLoading) {
                    if (this._hasNext) {
                        this._isLoading = true;
                        const messageManager = messageManager_1.default.of(this._iid);
                        const messages = yield messageManager.getMessagesByTimestamp(this.channelUrl, this.channelType, this._edge, {
                            prevResultSize: this.limit,
                            nextResultSize: 0,
                            isInclusive: false,
                            reverse: this.reverse,
                            messageType: this.messageTypeFilter,
                            customTypes: this.customTypesFilter,
                            replyType: types_1.ReplyType.NONE,
                            senderUserIds: this.senderUserIdsFilter,
                            includeReactions: this.includeReactions,
                            includeReplies: this.includeReplies,
                            includeMetaArray: this.includeMetaArray,
                            includeParentMessageInfo: this.includeParentMessageInfo,
                            includeThreadInfo: this.includeThreadInfo,
                            showSubchannelMessagesOnly: this.showSubchannelMessagesOnly,
                        });
                        this._edge = Math.min(...messages.map(m => m.createdAt));
                        this._hasNext = messages.length >= this.limit;
                        this._isLoading = false;
                        return messages;
                    }
                    return [];
                }
                else {
                    throw error_1.default.queryInProgress;
                }
            }
            else {
                throw error_1.default.invalidParameters;
            }
        });
    }
}
exports.default = PreviousMessageListQuery;
//# sourceMappingURL=previousMessageListQuery.js.map