"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliverEventCommand = exports.DeliverResponseCommand = exports.DeliverRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const websocketEventCommand_1 = require("../../../../core/command/websocket/websocketEventCommand");
const deundefined_1 = require("../../../../utils/deundefined");
class DeliverRequestCommand extends apiRequestCommand_1.default {
    constructor({ channelUrl, userId }) {
        super();
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_GROUP_CHANNELS}/${encodeURIComponent(channelUrl)}/messages/mark_as_delivered`;
        this.params = (0, deundefined_1.deundefined)({ userId });
    }
}
exports.DeliverRequestCommand = DeliverRequestCommand;
class DeliverResponseCommand extends apiResponseCommand_1.default {
}
exports.DeliverResponseCommand = DeliverResponseCommand;
class DeliverEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        super(_iid, 'DLVR', payload);
        this.channelUrl = payload.channel_url;
        this.deliveredStateUpdate = payload.updated;
    }
}
exports.DeliverEventCommand = DeliverEventCommand;
//# sourceMappingURL=deliverCommand.js.map