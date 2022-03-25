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
const vault_1 = require("../vault");
const error_1 = require("../error");
const baseListQuery_1 = require("./baseListQuery");
const loadOpenChannelListCommand_1 = require("../comm/command/channel/open/loadOpenChannelListCommand");
const validator_1 = require("../utils/validator");
const openChannelManager_1 = require("../manager/openChannelManager");
class OpenChannelListQuery extends baseListQuery_1.default {
    constructor(iid, params) {
        var _a, _b, _c, _d, _e;
        super(iid, params);
        this.includeFrozen = true;
        this.includeMetaData = true;
        this.nameKeyword = null;
        this.urlKeyword = null;
        this.customTypes = null;
        this.includeFrozen = (_a = params.includeFrozen) !== null && _a !== void 0 ? _a : true;
        this.includeMetaData = (_b = params.includeMetaData) !== null && _b !== void 0 ? _b : true;
        this.nameKeyword = (_c = params.nameKeyword) !== null && _c !== void 0 ? _c : null;
        this.urlKeyword = (_d = params.urlKeyword) !== null && _d !== void 0 ? _d : null;
        this.customTypes = (_e = params.customTypes) !== null && _e !== void 0 ? _e : null;
    }
    _validate() {
        return (super._validate() &&
            (0, validator_1.isTypeOf)('boolean', this.includeFrozen) &&
            (0, validator_1.isTypeOf)('boolean', this.includeMetaData) &&
            (0, validator_1.isTypeOf)('string', this.nameKeyword, true) &&
            (0, validator_1.isTypeOf)('string', this.urlKeyword, true) &&
            (0, validator_1.isArrayOf)('string', this.customTypes, true));
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._validate()) {
                if (!this._isLoading) {
                    if (this._hasNext) {
                        this._isLoading = true;
                        const { requestQueue } = vault_1.default.of(this._iid);
                        const request = new loadOpenChannelListCommand_1.LoadOpenChannelListRequestCommand(Object.assign(Object.assign({}, this), { token: this._token }));
                        const response = yield requestQueue.send(request);
                        const { channels, token } = response.as(loadOpenChannelListCommand_1.LoadOpenChannelListResponseCommand);
                        this._token = token;
                        this._hasNext = !!token;
                        const manager = openChannelManager_1.default.of(this._iid);
                        yield manager.upsertChannelsToCache(channels);
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
exports.default = OpenChannelListQuery;
//# sourceMappingURL=openChannelListQuery.js.map