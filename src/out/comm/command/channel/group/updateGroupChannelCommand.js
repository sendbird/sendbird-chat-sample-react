"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGroupChannelResponseCommand = exports.UpdateGroupChannelRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const groupChannel_1 = require("../../../../model/channel/groupChannel");
;
class UpdateGroupChannelRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, isDistinct, isPublic, isDiscoverable, coverUrl, coverImage, accessCode, name, data, customType, operatorUserIds, messageSurvivalSeconds } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_GROUP_CHANNELS}/${encodeURIComponent(channelUrl)}`;
        this.params = {
            is_distinct: isDistinct,
            is_public: isPublic,
            is_discoverable: isDiscoverable,
            name: name,
            data: data,
            custom_type: customType,
            cover_url: coverUrl,
            cover_file: coverImage,
            access_code: accessCode,
            operator_ids: operatorUserIds,
            message_survival_seconds: messageSurvivalSeconds,
        };
    }
}
exports.UpdateGroupChannelRequestCommand = UpdateGroupChannelRequestCommand;
class UpdateGroupChannelResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.channel = new groupChannel_1.default(_iid, payload);
    }
}
exports.UpdateGroupChannelResponseCommand = UpdateGroupChannelResponseCommand;
//# sourceMappingURL=updateGroupChannelCommand.js.map