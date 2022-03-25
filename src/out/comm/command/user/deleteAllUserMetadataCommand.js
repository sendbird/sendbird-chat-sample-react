"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAllUserMetadataResponseCommand = exports.DeleteAllUserMetadataRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class DeleteAllUserMetadataRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.DELETE;
        this.path = `${const_1.API_PATH_USERS}/${userId}/metadata`;
    }
}
exports.DeleteAllUserMetadataRequestCommand = DeleteAllUserMetadataRequestCommand;
class DeleteAllUserMetadataResponseCommand extends apiResponseCommand_1.default {
}
exports.DeleteAllUserMetadataResponseCommand = DeleteAllUserMetadataResponseCommand;
//# sourceMappingURL=deleteAllUserMetadataCommand.js.map