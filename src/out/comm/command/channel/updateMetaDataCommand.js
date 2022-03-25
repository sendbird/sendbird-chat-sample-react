"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMetaDataEventCommand = exports.UpdateMetaDataResponseCommand = exports.UpdateMetaDataRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
const utils_1 = require("../utils");
class UpdateMetaDataRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, metadata, upsert, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/metadata`;
        this.params = {
            metadata,
            include_ts: true,
            upsert: upsert !== null && upsert !== void 0 ? upsert : false,
        };
    }
}
exports.UpdateMetaDataRequestCommand = UpdateMetaDataRequestCommand;
class UpdateMetaDataResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.ts = null;
        const { metadata, ts } = payload;
        this.metadata = metadata;
        this.ts = ts !== null && ts !== void 0 ? ts : null;
    }
}
exports.UpdateMetaDataResponseCommand = UpdateMetaDataResponseCommand;
class UpdateMetaDataEventCommand extends websocketEventCommand_1.default {
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
exports.UpdateMetaDataEventCommand = UpdateMetaDataEventCommand;
//# sourceMappingURL=updateMetaDataCommand.js.map