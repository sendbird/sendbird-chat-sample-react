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
exports.MessageSearchOrder = void 0;
const vault_1 = require("../vault");
const error_1 = require("../error");
const baseListQuery_1 = require("./baseListQuery");
const searchMessagesCommand_1 = require("../comm/command/user/searchMessagesCommand");
const validator_1 = require("../utils/validator");
var MessageSearchOrder;
(function (MessageSearchOrder) {
    MessageSearchOrder["SCORE"] = "score";
    MessageSearchOrder["TIMESTAMP"] = "ts";
})(MessageSearchOrder = exports.MessageSearchOrder || (exports.MessageSearchOrder = {}));
class MessageSearchQuery extends baseListQuery_1.default {
    constructor(iid, params) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        super(iid, params);
        this.keyword = '';
        this.reverse = false;
        this.exactMatch = false;
        this.channelUrl = '';
        this.channelCustomType = '';
        this.messageTimestampFrom = null;
        this.messageTimestampTo = null;
        this.order = MessageSearchOrder.SCORE;
        this.advancedQuery = false;
        this.targetFields = [];
        this._previousToken = '';
        this._nextToken = '';
        this.keyword = params.keyword;
        this.reverse = (_a = params.reverse) !== null && _a !== void 0 ? _a : false;
        this.exactMatch = (_b = params.exactMatch) !== null && _b !== void 0 ? _b : false;
        this.channelUrl = (_c = params.channelUrl) !== null && _c !== void 0 ? _c : '';
        this.channelCustomType = (_d = params.channelCustomType) !== null && _d !== void 0 ? _d : '';
        this.messageTimestampFrom = (_e = params.messageTimestampFrom) !== null && _e !== void 0 ? _e : null;
        this.messageTimestampTo = (_f = params.messageTimestampTo) !== null && _f !== void 0 ? _f : null;
        this.order = (_g = params.order) !== null && _g !== void 0 ? _g : MessageSearchOrder.SCORE;
        this.advancedQuery = (_h = params.advancedQuery) !== null && _h !== void 0 ? _h : false;
        this.targetFields = (_j = params.targetFields) !== null && _j !== void 0 ? _j : [];
    }
    _validate() {
        return (super._validate() &&
            (0, validator_1.isTypeOf)('string', this.keyword) && this.keyword.length > 0 &&
            (0, validator_1.isTypeOf)('boolean', this.reverse) &&
            (0, validator_1.isTypeOf)('boolean', this.exactMatch) &&
            (0, validator_1.isTypeOf)('string', this.channelUrl) &&
            (0, validator_1.isTypeOf)('string', this.channelCustomType) &&
            ((0, validator_1.isTypeOf)('number', this.messageTimestampFrom) || this.messageTimestampFrom === null) &&
            ((0, validator_1.isTypeOf)('number', this.messageTimestampTo) || this.messageTimestampTo === null) &&
            (0, validator_1.isEnumOf)(MessageSearchOrder, this.order) &&
            (0, validator_1.isTypeOf)('boolean', this.advancedQuery) &&
            (0, validator_1.isArrayOf)('string', this.targetFields));
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._validate()) {
                if (!this._isLoading) {
                    if (this._hasNext) {
                        this._isLoading = true;
                        const { requestQueue } = vault_1.default.of(this._iid);
                        const request = new searchMessagesCommand_1.SearchMessagesRequestCommand(Object.assign(Object.assign({}, this), { nextToken: this._nextToken }));
                        const response = yield requestQueue.send(request);
                        const { messages, hasNext, nextToken } = response.as(searchMessagesCommand_1.SearchMessagesResponseCommand);
                        this._nextToken = nextToken;
                        this._hasNext = hasNext;
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
exports.default = MessageSearchQuery;
//# sourceMappingURL=messageSearchQuery.js.map