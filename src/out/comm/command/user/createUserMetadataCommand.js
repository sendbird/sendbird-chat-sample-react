"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserMetadataResponseCommand = exports.CreateUserMetadataRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class CreateUserMetadataRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, metadata }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `${const_1.API_PATH_USERS}/${userId}/metadata`;
        this.params = {
            metadata: metadata,
        };
    }
}
exports.CreateUserMetadataRequestCommand = CreateUserMetadataRequestCommand;
class CreateUserMetadataResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.metadata = payload;
    }
}
exports.CreateUserMetadataResponseCommand = CreateUserMetadataResponseCommand;
//# sourceMappingURL=createUserMetadataCommand.js.map