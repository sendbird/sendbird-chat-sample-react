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
const baseListQuery_1 = require("./baseListQuery");
const groupChannelManager_1 = require("../manager/groupChannelManager");
const groupChannelFilter_1 = require("../model/channel/groupChannelFilter");
const groupChannelListOrder_1 = require("../model/channel/groupChannelListOrder");
const serializer_1 = require("../utils/serializer");
const validator_1 = require("../utils/validator");
class GroupChannelListQuery extends baseListQuery_1.default {
    constructor(iid, params) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        super(iid, params);
        this.includeEmpty = false;
        this.includeFrozen = true;
        this.includeMetaData = true;
        this.channelUrlsFilter = null;
        this.customTypesFilter = null;
        this.customTypeStartsWithFilter = null;
        this.nicknameContainsFilter = '';
        this.channelNameContainsFilter = '';
        this.memberStateFilter = groupChannelFilter_1.MemberStateFilter.ALL;
        this.unreadChannelFilter = groupChannelFilter_1.UnreadChannelFilter.ALL;
        this.superChannelFilter = groupChannelFilter_1.SuperChannelFilter.ALL;
        this.publicChannelFilter = groupChannelFilter_1.PublicChannelFilter.ALL;
        this.hiddenChannelFilter = groupChannelFilter_1.HiddenChannelFilter.UNHIDDEN;
        this.searchFilter = {
            fields: [],
            query: null,
        };
        this.userIdsFilter = {
            userIds: [],
            includeMode: true,
            queryType: groupChannelFilter_1.QueryType.AND,
        };
        this.metadataKey = null;
        this.metadataValues = null;
        this.metadataOrderKeyFilter = null;
        this.metadataValueStartsWith = null;
        this.order = groupChannelListOrder_1.GroupChannelListOrder.LATEST_LAST_MESSAGE;
        this.includeEmpty = (_a = params.includeEmpty) !== null && _a !== void 0 ? _a : false;
        this.includeFrozen = (_b = params.includeFrozen) !== null && _b !== void 0 ? _b : true;
        this.includeMetaData = (_c = params.includeMetaData) !== null && _c !== void 0 ? _c : true;
        this.channelUrlsFilter = (_d = params.channelUrlsFilter) !== null && _d !== void 0 ? _d : null;
        this.customTypesFilter = (_e = params.customTypesFilter) !== null && _e !== void 0 ? _e : null;
        this.customTypeStartsWithFilter = (_f = params.customTypeStartsWithFilter) !== null && _f !== void 0 ? _f : '';
        this.nicknameContainsFilter = (_g = params.nicknameContainsFilter) !== null && _g !== void 0 ? _g : '';
        this.channelNameContainsFilter = (_h = params.channelNameContainsFilter) !== null && _h !== void 0 ? _h : '';
        this.memberStateFilter = (_j = params.memberStateFilter) !== null && _j !== void 0 ? _j : groupChannelFilter_1.MemberStateFilter.ALL;
        this.unreadChannelFilter = (_k = params.unreadChannelFilter) !== null && _k !== void 0 ? _k : groupChannelFilter_1.UnreadChannelFilter.ALL;
        this.superChannelFilter = (_l = params.superChannelFilter) !== null && _l !== void 0 ? _l : groupChannelFilter_1.SuperChannelFilter.ALL;
        this.publicChannelFilter = (_m = params.publicChannelFilter) !== null && _m !== void 0 ? _m : groupChannelFilter_1.PublicChannelFilter.ALL;
        this.hiddenChannelFilter = (_o = params.hiddenChannelFilter) !== null && _o !== void 0 ? _o : groupChannelFilter_1.HiddenChannelFilter.UNHIDDEN;
        this.searchFilter = (_p = params.searchFilter) !== null && _p !== void 0 ? _p : {
            fields: [],
            query: null,
        };
        this.userIdsFilter = (_q = params.userIdsFilter) !== null && _q !== void 0 ? _q : {
            userIds: [],
            includeMode: true,
            queryType: groupChannelFilter_1.QueryType.AND,
        };
        this.metadataKey = (_r = params.metadataKey) !== null && _r !== void 0 ? _r : null;
        this.metadataValues = (_s = params.metadataValues) !== null && _s !== void 0 ? _s : null;
        this.metadataOrderKeyFilter = (_t = params.metadataOrderKeyFilter) !== null && _t !== void 0 ? _t : null;
        this.metadataValueStartsWith = (_u = params.metadataValueStartsWith) !== null && _u !== void 0 ? _u : null;
        this.order = (_v = params.order) !== null && _v !== void 0 ? _v : groupChannelListOrder_1.GroupChannelListOrder.LATEST_LAST_MESSAGE;
    }
    _validate() {
        return (super._validate() &&
            (0, validator_1.isTypeOf)('boolean', this.includeEmpty) &&
            (0, validator_1.isTypeOf)('boolean', this.includeFrozen) &&
            (0, validator_1.isTypeOf)('boolean', this.includeMetaData) &&
            (0, validator_1.isTypeOf)('string', this.channelNameContainsFilter) &&
            (0, validator_1.isArrayOf)('string', this.channelUrlsFilter, true) &&
            (0, validator_1.isArrayOf)('string', this.customTypesFilter, true) &&
            (0, validator_1.isTypeOf)('string', this.customTypeStartsWithFilter) &&
            (0, validator_1.isTypeOf)('string', this.nicknameContainsFilter) &&
            (0, validator_1.isEnumOf)(groupChannelFilter_1.MemberStateFilter, this.memberStateFilter) &&
            (0, validator_1.isEnumOf)(groupChannelFilter_1.SuperChannelFilter, this.superChannelFilter) &&
            (0, validator_1.isEnumOf)(groupChannelFilter_1.PublicChannelFilter, this.publicChannelFilter) &&
            (0, validator_1.isEnumOf)(groupChannelFilter_1.UnreadChannelFilter, this.unreadChannelFilter) &&
            (0, validator_1.isEnumOf)(groupChannelFilter_1.HiddenChannelFilter, this.hiddenChannelFilter) &&
            (0, validator_1.isArrayOf)(groupChannelFilter_1.GroupChannelSearchField, this.searchFilter.fields) &&
            (0, validator_1.isTypeOf)('string', this.searchFilter.query, true) &&
            (0, validator_1.isArrayOf)('string', this.userIdsFilter.userIds) &&
            (0, validator_1.isTypeOf)('boolean', this.userIdsFilter.includeMode) &&
            (0, validator_1.isEnumOf)(groupChannelFilter_1.QueryType, this.userIdsFilter.queryType) &&
            (0, validator_1.isEnumOf)(groupChannelListOrder_1.GroupChannelListOrder, this.order) &&
            (0, validator_1.isTypeOf)('string', this.metadataOrderKeyFilter, true) &&
            (0, validator_1.isTypeOf)('string', this.metadataKey, true) &&
            (0, validator_1.isArrayOf)('string', this.metadataValues, true) &&
            (0, validator_1.isTypeOf)('string', this.metadataValueStartsWith, true));
    }
    serialize() {
        return (0, serializer_1.serialize)(this);
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._validate()) {
                if (!this._isLoading) {
                    if (this._hasNext) {
                        this._isLoading = true;
                        const groupChannelManager = groupChannelManager_1.default.of(this._iid);
                        const { channels, token } = yield groupChannelManager.getMyGroupChannels(this._token, this, this.limit);
                        this._token = token;
                        this._hasNext = !!token;
                        this._isLoading = false;
                        return channels;
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
exports.default = GroupChannelListQuery;
//# sourceMappingURL=groupChannelListQuery.js.map