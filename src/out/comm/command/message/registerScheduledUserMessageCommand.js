"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterScheduledUserMessageResponseCommand = exports.RegisterScheduledUserMessageRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const utils_1 = require("../utils");
const scheduledUserMessage_1 = require("../../../model/message/scheduledUserMessage");
const types_1 = require("../../../model/message/types");
const appleCriticalAlertOptions_1 = require("../../../model/message/appleCriticalAlertOptions");
const messageMetaArray_1 = require("../../../model/message/messageMetaArray");
class RegisterScheduledUserMessageRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        super();
        const { channelType, channelUrl } = params;
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/scheduled_messages`;
        this.params = {
            message_type: types_1.MessageType.USER,
            user_id: params.userId,
            message: params.message,
            mention_type: params.mentionType,
            mentioned_user_ids: params.mentionedUserIds,
            data: params.data,
            custom_type: params.customType,
            translation_target_langs: params.translationTargetLanguages,
            sorted_metaarray: params.metaArrays.map((metaArray) => messageMetaArray_1.default.payloadify(metaArray)),
            push_option: params.pushNotificationDeliveryOption,
            parent_message_id: params.parentMessageId,
            apple_critical_alert_options: appleCriticalAlertOptions_1.default.payloadify(params.appleCriticalAlertOptions),
            reply_to_channel: params.isReplyToChannel,
            scheduled_dt: params.scheduleDatetime,
        };
    }
}
exports.RegisterScheduledUserMessageRequestCommand = RegisterScheduledUserMessageRequestCommand;
class RegisterScheduledUserMessageResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.message = new scheduledUserMessage_1.default(_iid, payload);
    }
}
exports.RegisterScheduledUserMessageResponseCommand = RegisterScheduledUserMessageResponseCommand;
//# sourceMappingURL=registerScheduledUserMessageCommand.js.map