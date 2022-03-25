"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGroupChannelResponseCommand = exports.CreateGroupChannelRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const groupChannel_1 = require("../../../../model/channel/groupChannel");
;
class CreateGroupChannelRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { userId, channelUrl, coverUrl, coverImage, isDistinct, isSuper, isBroadcast, isPublic, isDiscoverable, isStrict, isEphemeral, accessCode, name, data, customType, messageSurvivalSeconds, invitedUserIds, operatorUserIds, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = const_1.API_PATH_GROUP_CHANNELS;
        this.params = {
            user_ids: [userId, ...invitedUserIds]
                .filter((item, index, self) => index === self.indexOf(item)),
            channel_url: channelUrl,
            cover_url: coverUrl,
            cover_file: coverImage,
            is_distinct: isDistinct,
            is_super: isSuper,
            is_broadcast: isBroadcast,
            is_public: isPublic,
            is_discoverable: isDiscoverable,
            strict: isStrict,
            is_ephemeral: isEphemeral,
            access_code: accessCode,
            name,
            data,
            custom_type: customType,
            operator_ids: operatorUserIds,
            message_survival_seconds: messageSurvivalSeconds,
        };
    }
}
exports.CreateGroupChannelRequestCommand = CreateGroupChannelRequestCommand;
class CreateGroupChannelResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.channel = new groupChannel_1.default(_iid, payload);
        this.isCreated = payload.is_created;
    }
}
exports.CreateGroupChannelResponseCommand = CreateGroupChannelResponseCommand;
//# sourceMappingURL=createGroupChannelCommand.js.map