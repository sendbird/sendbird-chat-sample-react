"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMetaCounterEventCommand = exports.UpdateMetaCountersResponseCommand = exports.UpdateMetaCountersRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
const utils_1 = require("../utils");
class UpdateMetaCountersRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, metaCounter, upsert = false, mode = 'set', } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/metacounter`;
        this.params = {
            metacounter: metaCounter,
            upsert,
            mode,
        };
    }
}
exports.UpdateMetaCountersRequestCommand = UpdateMetaCountersRequestCommand;
class UpdateMetaCountersResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.metaCounter = payload;
    }
}
exports.UpdateMetaCountersResponseCommand = UpdateMetaCountersResponseCommand;
class UpdateMetaCounterEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        super(_iid, 'SYEV', payload);
        this.created = null;
        this.updated = null;
        this.deleted = null;
        if (payload.data) {
            this.created = payload.data.created;
            this.updated = payload.data.updated;
            this.deleted = payload.data.deleted;
        }
    }
}
exports.UpdateMetaCounterEventCommand = UpdateMetaCounterEventCommand;
//# sourceMappingURL=updateMetaCountersCommand.js.map