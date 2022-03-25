"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetMyCountPreferenceResponseCommand = exports.SetMyCountPreferenceRequestCommand = void 0;
const groupChannel_1 = require("../../../model/channel/groupChannel");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class SetMyCountPreferenceRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, channelUrl, countPreference }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/count_preference/${encodeURIComponent(channelUrl)}`;
        this.params = {
            count_preference: countPreference,
        };
    }
}
exports.SetMyCountPreferenceRequestCommand = SetMyCountPreferenceRequestCommand;
class SetMyCountPreferenceResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.countPreference = groupChannel_1.CountPreference[payload.count_preference];
    }
}
exports.SetMyCountPreferenceResponseCommand = SetMyCountPreferenceResponseCommand;
//# sourceMappingURL=setMyCountPreferenceCommand.js.map