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
exports.UserOnlineState = void 0;
const vault_1 = require("../vault");
const error_1 = require("../error");
const instancedObject_1 = require("./instancedObject");
const ekey_1 = require("./ekey");
const createUserMetadataCommand_1 = require("../comm/command/user/createUserMetadataCommand");
const createMetaDataCommand_1 = require("../comm/command/channel/createMetaDataCommand");
const updateUserMetadataCommand_1 = require("../comm/command/user/updateUserMetadataCommand");
const deleteUserMetadataCommand_1 = require("../comm/command/user/deleteUserMetadataCommand");
const deleteAllUserMetadataCommand_1 = require("../comm/command/user/deleteAllUserMetadataCommand");
const serializer_1 = require("../utils/serializer");
const validator_1 = require("../utils/validator");
const unless_1 = require("../utils/unless");
const deundefined_1 = require("../utils/deundefined");
var UserOnlineState;
(function (UserOnlineState) {
    UserOnlineState["ONLINE"] = "online";
    UserOnlineState["OFFLINE"] = "offline";
    UserOnlineState["NON_AVAILABLE"] = "nonavailable";
})(UserOnlineState = exports.UserOnlineState || (exports.UserOnlineState = {}));
class User extends instancedObject_1.default {
    constructor(_iid, payload) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        super(_iid);
        this.userId = (_b = (_a = payload['guest_id']) !== null && _a !== void 0 ? _a : payload['user_id']) !== null && _b !== void 0 ? _b : '';
        this.nickname = (_c = payload['nickname']) !== null && _c !== void 0 ? _c : '';
        this.plainProfileUrl = (_e = (_d = payload['profile_url']) !== null && _d !== void 0 ? _d : payload['image']) !== null && _e !== void 0 ? _e : '';
        this.requireAuth = (_f = payload['require_auth_for_profile_image']) !== null && _f !== void 0 ? _f : false;
        this.metaData = (_g = payload['metadata']) !== null && _g !== void 0 ? _g : {};
        this.connectionStatus = UserOnlineState.NON_AVAILABLE;
        if ((0, validator_1.isEnumOf)(UserOnlineState, payload['is_online'])) {
            this.connectionStatus = payload['is_online'];
        }
        else if ((0, validator_1.isTypeOf)('boolean', payload['is_online'])) {
            this.connectionStatus = payload['is_online'] ? UserOnlineState.ONLINE : UserOnlineState.OFFLINE;
        }
        this.isActive = (_h = payload['is_active']) !== null && _h !== void 0 ? _h : true;
        this.lastSeenAt = (_j = payload['last_seen_at']) !== null && _j !== void 0 ? _j : null;
        this.preferredLanguages = payload['preferred_languages'] ? [...payload['preferred_languages']] : null;
        this.friendDiscoveryKey = (_k = payload['friend_discovery_key']) !== null && _k !== void 0 ? _k : null;
        this.friendName = (_l = payload['friend_name']) !== null && _l !== void 0 ? _l : null;
    }
    static payloadify(obj) {
        return obj ? (0, deundefined_1.deundefined)(Object.assign(Object.assign({}, super.payloadify(obj)), { 'user_id': obj.userId, 'nickname': obj.nickname, 'profile_url': obj.plainProfileUrl, 'require_auth_for_profile_image': obj.requireAuth, 'metadata': obj.metaData, 'is_online': obj.connectionStatus, 'is_active': obj.isActive, 'last_seen_at': obj.lastSeenAt, 'preferred_languages': obj.preferredLanguages, 'friend_discovery_key': obj.friendDiscoveryKey, 'friend_name': obj.friendName })) : null;
    }
    get profileUrl() {
        return this.requireAuth
            ? `${this.plainProfileUrl}?auth=${(0, ekey_1.ekey)(this._iid)}`
            : this.plainProfileUrl;
    }
    serialize() {
        return (0, serializer_1.serialize)(this);
    }
    _isValidMetaData(metaData) {
        return !Array.isArray(metaData) &&
            Object.keys(metaData).length > 0 &&
            Object.keys(metaData)
                .map((key) => metaData[key])
                .every((item) => (0, validator_1.isTypeOf)('string', item));
    }
    _applyMetaData(metaData, deleted = false) {
        Object.keys(metaData).forEach((key) => {
            if (!deleted) {
                this.metaData[key] = metaData[key];
            }
            else {
                delete this.metaData[key];
            }
        });
    }
    createMetaData(input) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(this._isValidMetaData(input))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new createUserMetadataCommand_1.CreateUserMetadataRequestCommand({ userId: sdkState.userId, metadata: input });
            const response = yield requestQueue.send(request);
            const { metaData } = response.as(createMetaDataCommand_1.CreateMetaDataResponseCommand);
            this._applyMetaData(metaData);
            return this.metaData;
        });
    }
    updateMetaData(input, upsert = false) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(this._isValidMetaData(input))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new updateUserMetadataCommand_1.UpdateUserMetadataRequestCommand({ userId: sdkState.userId, metadata: input, upsert });
            const response = yield requestQueue.send(request);
            const { metadata } = response.as(updateUserMetadataCommand_1.UpdateUserMetadataResponseCommand);
            this._applyMetaData(metadata);
            return this.metaData;
        });
    }
    deleteMetaData(metadataKey) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', metadataKey))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new deleteUserMetadataCommand_1.DeleteUserMetadataRequestCommand({ userId: sdkState.userId, metadataKey });
            yield requestQueue.send(request);
            this._applyMetaData({ [metadataKey]: true }, true);
            return this.metaData;
        });
    }
    deleteAllMetaData() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new deleteAllUserMetadataCommand_1.DeleteAllUserMetadataRequestCommand({ userId: sdkState.userId });
            yield requestQueue.send(request);
            this.metaData = {};
        });
    }
}
exports.default = User;
//# sourceMappingURL=user.js.map