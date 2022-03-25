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
exports.MemberListOrder = exports.MutedMemberFilter = void 0;
const vault_1 = require("../vault");
const error_1 = require("../error");
const channelDataListQuery_1 = require("./channelDataListQuery");
const groupChannelFilter_1 = require("../model/channel/groupChannelFilter");
const types_1 = require("../model/channel/types");
const loadMemberList_1 = require("../comm/command/channel/group/loadMemberList");
const validator_1 = require("../utils/validator");
var MutedMemberFilter;
(function (MutedMemberFilter) {
    MutedMemberFilter["ALL"] = "all";
    MutedMemberFilter["MUTED"] = "muted";
    MutedMemberFilter["UNMUTED"] = "unmuted";
})(MutedMemberFilter = exports.MutedMemberFilter || (exports.MutedMemberFilter = {}));
var MemberListOrder;
(function (MemberListOrder) {
    MemberListOrder["MEMBER_NICKNAME_ALPHABETICAL"] = "member_nickname_alphabetical";
    MemberListOrder["OPERATOR_THEN_MEMBER_ALPHABETICAL"] = "operator_then_member_alphabetical";
})(MemberListOrder = exports.MemberListOrder || (exports.MemberListOrder = {}));
class MemberListQuery extends channelDataListQuery_1.default {
    constructor(iid, channelUrl, params) {
        var _a, _b, _c, _d;
        super(iid, channelUrl, types_1.ChannelType.GROUP, params);
        this.mutedMemberFilter = MutedMemberFilter.ALL;
        this.memberStateFilter = groupChannelFilter_1.MemberStateFilter.ALL;
        this.nicknameStartsWithFilter = null;
        this.order = MemberListOrder.MEMBER_NICKNAME_ALPHABETICAL;
        this.mutedMemberFilter = (_a = params.mutedMemberFilter) !== null && _a !== void 0 ? _a : MutedMemberFilter.ALL;
        this.memberStateFilter = (_b = params.memberStateFilter) !== null && _b !== void 0 ? _b : groupChannelFilter_1.MemberStateFilter.ALL;
        this.nicknameStartsWithFilter = (_c = params.nicknameStartsWithFilter) !== null && _c !== void 0 ? _c : null;
        this.order = (_d = params.order) !== null && _d !== void 0 ? _d : MemberListOrder.MEMBER_NICKNAME_ALPHABETICAL;
    }
    _validate() {
        return (super._validate() &&
            (0, validator_1.isEnumOf)(MutedMemberFilter, this.mutedMemberFilter) &&
            (0, validator_1.isEnumOf)(groupChannelFilter_1.MemberStateFilter, this.memberStateFilter) &&
            ((0, validator_1.isTypeOf)('string', this.nicknameStartsWithFilter) || this.nicknameStartsWithFilter === null) &&
            (0, validator_1.isEnumOf)(MemberListOrder, this.order));
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._validate()) {
                if (!this._isLoading) {
                    if (this._hasNext) {
                        this._isLoading = true;
                        const { requestQueue } = vault_1.default.of(this._iid);
                        const request = new loadMemberList_1.LoadMemberListRequestCommand(Object.assign(Object.assign({}, this), { token: this._token }));
                        const response = yield requestQueue.send(request);
                        const { members, token } = response.as(loadMemberList_1.LoadMemberListResponseCommand);
                        this._token = token;
                        this._hasNext = !!token;
                        this._isLoading = false;
                        return members;
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
exports.default = MemberListQuery;
//# sourceMappingURL=memberListQuery.js.map