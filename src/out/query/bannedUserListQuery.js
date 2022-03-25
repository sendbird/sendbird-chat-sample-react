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
const channelDataListQuery_1 = require("./channelDataListQuery");
const loadBannedUserListCommand_1 = require("../comm/command/channel/loadBannedUserListCommand");
class BannedUserListQuery extends channelDataListQuery_1.default {
    constructor(iid, channelUrl, channelType, params) {
        super(iid, channelUrl, channelType, params);
    }
    _validate() {
        return (super._validate());
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._validate()) {
                if (!this._isLoading) {
                    if (this._hasNext) {
                        this._isLoading = true;
                        const { requestQueue } = vault_1.default.of(this._iid);
                        const request = new loadBannedUserListCommand_1.LoadBannedUserListRequestCommand(Object.assign(Object.assign({}, this), { token: this._token }));
                        const response = yield requestQueue.send(request);
                        const { bannedUsers, token } = response.as(loadBannedUserListCommand_1.LoadBannedUserListResponseCommand);
                        this._token = token;
                        this._hasNext = !!token;
                        this._isLoading = false;
                        return bannedUsers;
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
exports.default = BannedUserListQuery;
//# sourceMappingURL=bannedUserListQuery.js.map