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
exports.MembershipFilter = void 0;
const vault_1 = require("../vault");
const error_1 = require("../error");
const baseListQuery_1 = require("./baseListQuery");
const groupChannelFilter_1 = require("../model/channel/groupChannelFilter");
const groupChannelListOrder_1 = require("../model/channel/groupChannelListOrder");
const groupChannelEventCommand_1 = require("../comm/command/internal/groupChannelEventCommand");
const loadPublicGroupChannelList_1 = require("../comm/command/channel/group/loadPublicGroupChannelList");
const validator_1 = require("../utils/validator");
var MembershipFilter;
(function (MembershipFilter) {
    MembershipFilter["ALL"] = "all";
    MembershipFilter["JOINED"] = "joined";
})(MembershipFilter = exports.MembershipFilter || (exports.MembershipFilter = {}));
class PublicGroupChannelListQuery extends baseListQuery_1.default {
    constructor(iid, params) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        super(iid, params);
        this.includeEmpty = false;
        this.includeFrozen = true;
        this.includeMetaData = true;
        this.channelUrlsFilter = null;
        this.customTypesFilter = null;
        this.customTypeStartsWithFilter = null;
        this.nicknameContainsFilter = null;
        this.channelNameContainsFilter = null;
        this.membershipFilter = MembershipFilter.ALL;
        this.superChannelFilter = groupChannelFilter_1.SuperChannelFilter.ALL;
        this.metadataKey = null;
        this.metadataValues = null;
        this.metadataOrderKeyFilter = null;
        this.metadataValueStartsWith = null;
        this.order = groupChannelListOrder_1.PublicGroupChannelListOrder.CHRONOLOGICAL;
        this.includeEmpty = (_a = params.includeEmpty) !== null && _a !== void 0 ? _a : false;
        this.includeFrozen = (_b = params.includeFrozen) !== null && _b !== void 0 ? _b : true;
        this.includeMetaData = (_c = params.includeMetaData) !== null && _c !== void 0 ? _c : true;
        this.channelUrlsFilter = (_d = params.channelUrlsFilter) !== null && _d !== void 0 ? _d : null;
        this.customTypesFilter = (_e = params.customTypesFilter) !== null && _e !== void 0 ? _e : null;
        this.customTypeStartsWithFilter = (_f = params.customTypeStartsWithFilter) !== null && _f !== void 0 ? _f : null;
        this.channelNameContainsFilter = (_g = params.channelNameContainsFilter) !== null && _g !== void 0 ? _g : null;
        this.membershipFilter = (_h = params.membershipFilter) !== null && _h !== void 0 ? _h : MembershipFilter.ALL;
        this.superChannelFilter = (_j = params.superChannelFilter) !== null && _j !== void 0 ? _j : groupChannelFilter_1.SuperChannelFilter.ALL;
        this.metadataKey = (_k = params.metadataKey) !== null && _k !== void 0 ? _k : null;
        this.metadataValues = (_l = params.metadataValues) !== null && _l !== void 0 ? _l : null;
        this.metadataOrderKeyFilter = (_m = params.metadataOrderKeyFilter) !== null && _m !== void 0 ? _m : null;
        this.metadataValueStartsWith = (_o = params.metadataValueStartsWith) !== null && _o !== void 0 ? _o : null;
        this.order = (_p = params.order) !== null && _p !== void 0 ? _p : groupChannelListOrder_1.PublicGroupChannelListOrder.CHRONOLOGICAL;
    }
    _validate() {
        return (super._validate() &&
            (0, validator_1.isTypeOf)('boolean', this.includeEmpty) &&
            (0, validator_1.isTypeOf)('boolean', this.includeFrozen) &&
            (0, validator_1.isTypeOf)('boolean', this.includeMetaData) &&
            (0, validator_1.isTypeOf)('string', this.channelNameContainsFilter, true) &&
            (0, validator_1.isArrayOf)('string', this.channelUrlsFilter, true) &&
            (0, validator_1.isArrayOf)('string', this.customTypesFilter, true) &&
            (0, validator_1.isTypeOf)('string', this.customTypeStartsWithFilter, true) &&
            (0, validator_1.isEnumOf)(MembershipFilter, this.membershipFilter) &&
            (0, validator_1.isEnumOf)(groupChannelFilter_1.SuperChannelFilter, this.superChannelFilter) &&
            (0, validator_1.isEnumOf)(groupChannelListOrder_1.PublicGroupChannelListOrder, this.order) &&
            (0, validator_1.isTypeOf)('string', this.metadataOrderKeyFilter, true) &&
            (0, validator_1.isTypeOf)('string', this.metadataKey, true) &&
            (0, validator_1.isArrayOf)('string', this.metadataValues, true) &&
            (0, validator_1.isTypeOf)('string', this.metadataValueStartsWith, true));
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._validate()) {
                if (!this._isLoading) {
                    const result = [];
                    if (this._hasNext) {
                        this._isLoading = true;
                        const { requestQueue, dispatcher } = vault_1.default.of(this._iid);
                        const request = new loadPublicGroupChannelList_1.LoadPublicGroupChannelListRequestCommand(Object.assign(Object.assign({}, this), { token: this._token }));
                        const response = yield requestQueue.send(request);
                        const { channels, token } = response.as(loadPublicGroupChannelList_1.LoadPublicGroupChannelListResponseCommand);
                        this._token = token;
                        this._hasNext = !!token;
                        dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                            channels,
                            source: groupChannelEventCommand_1.GroupChannelEventSource.REQUEST_CHANNEL,
                        }));
                        this._isLoading = false;
                        return channels;
                    }
                    return result;
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
exports.default = PublicGroupChannelListQuery;
//# sourceMappingURL=publicGroupChannelListQuery.js.map