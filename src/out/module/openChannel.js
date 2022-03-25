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
exports.ParticipantListQuery = exports.OpenChannelUpdateParams = exports.OpenChannelModule = exports.OpenChannelListQuery = exports.OpenChannelHandler = exports.OpenChannelCreateParams = exports.OpenChannel = void 0;
const baseModule_1 = require("./baseModule");
const openChannel_1 = require("../model/channel/openChannel");
exports.OpenChannel = openChannel_1.default;
const openChannelHandler_1 = require("../model/handler/openChannelHandler");
exports.OpenChannelHandler = openChannelHandler_1.default;
const openChannelCreateParams_1 = require("../model/params/openChannelCreateParams");
exports.OpenChannelCreateParams = openChannelCreateParams_1.default;
const openChannelUpdateParams_1 = require("../model/params/openChannelUpdateParams");
exports.OpenChannelUpdateParams = openChannelUpdateParams_1.default;
const openChannelManager_1 = require("../manager/openChannelManager");
const openChannelListQuery_1 = require("../query/openChannelListQuery");
exports.OpenChannelListQuery = openChannelListQuery_1.default;
const participantListQuery_1 = require("../query/participantListQuery");
exports.ParticipantListQuery = participantListQuery_1.default;
class OpenChannelModule extends baseModule_1.default {
    constructor() {
        super(...arguments);
        this.name = 'openChannel';
    }
    init(_iid, { sdkState, cacheContext, dispatcher, sessionManager, requestQueue, }) {
        super.init(_iid, { sdkState, cacheContext, dispatcher, sessionManager, requestQueue });
        this._manager = new openChannelManager_1.default(_iid, {
            sdkState,
            dispatcher,
            requestQueue,
        });
    }
    createOpenChannelListQuery(params) {
        return new openChannelListQuery_1.default(this._iid, params);
    }
    addOpenChannelHandler(key, handler) {
        this._manager.addHandler(key, handler);
    }
    removeOpenChannelHandler(key) {
        this._manager.removeHandler(key);
    }
    removeAllOpenChannelHandlers() {
        this._manager.clearHandler();
    }
    buildOpenChannelFromSerializedData(serialized) {
        return this._manager.buildOpenChannelFromSerializedData(serialized);
    }
    getChannel(channelUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._manager.getChannel(channelUrl);
        });
    }
    getChannelWithoutCache(channelUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._manager.getChannelWithoutCache(channelUrl);
        });
    }
    createChannel(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._manager.createChannel(params);
        });
    }
    createChannelWithOperatorUserIds(name, coverUrlOrImageFile, data, operatorUserIds, customType) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new openChannelCreateParams_1.default();
            params.name = name;
            params.coverUrlOrImage = coverUrlOrImageFile;
            params.data = data;
            params.operatorUserIds = operatorUserIds;
            params.customType = customType;
            return this._manager.createChannel(params);
        });
    }
}
exports.OpenChannelModule = OpenChannelModule;
//# sourceMappingURL=openChannel.js.map