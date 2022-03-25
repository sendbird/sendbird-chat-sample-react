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
const error_1 = require("../../error");
const user_1 = require("../user");
const baseChannel_1 = require("./baseChannel");
const types_1 = require("./types");
const openChannelManager_1 = require("../../manager/openChannelManager");
const messageManager_1 = require("../../manager/messageManager");
const openChannelUpdateParams_1 = require("../params/openChannelUpdateParams");
const participantListQuery_1 = require("../../query/participantListQuery");
const updateOpenChannelCommand_1 = require("../../comm/command/channel/open/updateOpenChannelCommand");
const deleteOpenChannelCommand_1 = require("../../comm/command/channel/open/deleteOpenChannelCommand");
const enterOpenChannelCommand_1 = require("../../comm/command/channel/open/enterOpenChannelCommand");
const exitOpenChannelCommand_1 = require("../../comm/command/channel/open/exitOpenChannelCommand");
const serializer_1 = require("../../utils/serializer");
const unless_1 = require("../../utils/unless");
const deundefined_1 = require("../../utils/deundefined");
class OpenChannel extends baseChannel_1.default {
    constructor(_iid, payload) {
        var _a;
        super(_iid, payload);
        this._lastParticipantCountUpdated = 0;
        this.participantCount = 0;
        this.operators = [];
        this.channelType = types_1.ChannelType.OPEN;
        this.participantCount = (_a = payload['participant_count']) !== null && _a !== void 0 ? _a : 0;
        this.operators = Array.isArray(payload['operators']) ?
            payload['operators'].map((payload) => new user_1.default(_iid, payload)) :
            [];
    }
    static payloadify(obj) {
        return obj ? (0, deundefined_1.deundefined)(Object.assign(Object.assign({}, baseChannel_1.default.payloadify(obj)), { 'participant_count': obj.participantCount, 'operators': obj.operators.map((user) => user_1.default.payloadify(user)) })) : null;
    }
    serialize() {
        return (0, serializer_1.serialize)(this);
    }
    isOperator(userOrUserId) {
        return (userOrUserId instanceof user_1.default) ?
            this.isOperator(userOrUserId.userId) :
            this.operators.some((user) => user.userId === userOrUserId);
    }
    _updateParticipantCount(count, updatedAt) {
        if (updatedAt > this._lastParticipantCountUpdated) {
            this.participantCount = count;
            this._lastParticipantCountUpdated = updatedAt;
            return true;
        }
        return false;
    }
    createParticipantListQuery(params) {
        return new participantListQuery_1.default(this._iid, this.url, params);
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const manager = openChannelManager_1.default.of(this._iid);
            return yield manager.getChannelWithoutCache(this.url);
        });
    }
    enter() {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new enterOpenChannelCommand_1.EnterOpenChannelRequestCommand({ channelUrl: this.url });
            const response = yield requestQueue.send(request);
            const { participantCount, ts } = response.as(enterOpenChannelCommand_1.EnterOpenChannelEventCommand);
            this._updateParticipantCount(participantCount, ts);
            const manager = openChannelManager_1.default.of(this._iid);
            manager.setEnteredToCache(this);
        });
    }
    exit() {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new exitOpenChannelCommand_1.ExitOpenChannelRequestCommand({ channelUrl: this.url });
            const response = yield requestQueue.send(request);
            const { participantCount, ts } = response.as(exitOpenChannelCommand_1.ExitOpenChannelEventCommand);
            this._updateParticipantCount(participantCount, ts);
            const openChannelManager = openChannelManager_1.default.of(this._iid);
            openChannelManager.setExitedToCache(this);
            const messageManager = messageManager_1.default.of(this._iid);
            messageManager.fileMessageQueue.cancel(this);
        });
    }
    updateChannel(params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(params instanceof openChannelUpdateParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new updateOpenChannelCommand_1.UpdateOpenChannelRequestCommand(Object.assign({ channelUrl: this.url }, params));
            const response = yield requestQueue.send(request);
            const { channel } = response.as(updateOpenChannelCommand_1.UpdateOpenChannelResponseCommand);
            const manager = openChannelManager_1.default.of(this._iid);
            yield manager.upsertChannelsToCache([channel]);
            return channel;
        });
    }
    updateChannelWithOperatorUserIds(name, coverUrlOrImageFile, data, operatorUserIds, customType) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new openChannelUpdateParams_1.default();
            params.name = name;
            params.coverUrlOrImage = coverUrlOrImageFile;
            params.data = data;
            params.operatorUserIds = operatorUserIds;
            params.customType = customType;
            return this.updateChannel(params);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new deleteOpenChannelCommand_1.DeleteOpenChannelRequestCommand({
                channelUrl: this.url,
            });
            yield requestQueue.send(request);
            const manager = openChannelManager_1.default.of(this._iid);
            yield manager.removeChannelsFromCache([this.url]);
        });
    }
}
exports.default = OpenChannel;
//# sourceMappingURL=openChannel.js.map