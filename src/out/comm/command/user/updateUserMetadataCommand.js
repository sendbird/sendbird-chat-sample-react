"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserMetadataResponseCommand = exports.UpdateUserMetadataRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class UpdateUserMetadataRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, metadata, upsert }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_USERS}/${userId}/metadata`;
        this.params = {
            metadata: metadata,
            upsert: upsert,
        };
    }
}
exports.UpdateUserMetadataRequestCommand = UpdateUserMetadataRequestCommand;
class UpdateUserMetadataResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.metadata = payload;
    }
}
exports.UpdateUserMetadataResponseCommand = UpdateUserMetadataResponseCommand;
//# sourceMappingURL=updateUserMetadataCommand.js.map