"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserMetadataResponseCommand = exports.DeleteUserMetadataRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class DeleteUserMetadataRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, metadataKey }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.DELETE;
        this.path = `${const_1.API_PATH_USERS}/${userId}/metadata/${metadataKey}`;
    }
}
exports.DeleteUserMetadataRequestCommand = DeleteUserMetadataRequestCommand;
class DeleteUserMetadataResponseCommand extends apiResponseCommand_1.default {
}
exports.DeleteUserMetadataResponseCommand = DeleteUserMetadataResponseCommand;
//# sourceMappingURL=deleteUserMetadataCommand.js.map