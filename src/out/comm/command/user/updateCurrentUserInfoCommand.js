"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCurrentUserInfoResponseCommand = exports.UpdateCurrentUserInfoRequestCommand = void 0;
const user_1 = require("../../../model/user");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
const deundefined_1 = require("../../../utils/deundefined");
class UpdateCurrentUserInfoRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, nickname = null, profileUrl = null, profileImage = null, preferredLanguages = null, }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}`;
        this.params = (0, deundefined_1.deundefined)({
            nickname: nickname,
            profile_url: profileUrl,
            profile_file: profileImage,
            preferred_languages: preferredLanguages,
        });
    }
}
exports.UpdateCurrentUserInfoRequestCommand = UpdateCurrentUserInfoRequestCommand;
class UpdateCurrentUserInfoResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.user = null;
        this.user = new user_1.default(_iid, Object.assign({}, payload));
    }
}
exports.UpdateCurrentUserInfoResponseCommand = UpdateCurrentUserInfoResponseCommand;
//# sourceMappingURL=updateCurrentUserInfoCommand.js.map