"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreezeEventCommand = exports.FreezeResponseCommand = exports.FreezeRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
const utils_1 = require("../utils");
class FreezeRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, freezing } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/freeze`;
        this.params = {
            freeze: freezing,
        };
    }
}
exports.FreezeRequestCommand = FreezeRequestCommand;
class FreezeResponseCommand extends apiResponseCommand_1.default {
}
exports.FreezeResponseCommand = FreezeResponseCommand;
class FreezeEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        super(_iid, 'SYEV', payload);
        this.freeze = payload.data.freeze;
    }
}
exports.FreezeEventCommand = FreezeEventCommand;
//# sourceMappingURL=freezeCommand.js.map