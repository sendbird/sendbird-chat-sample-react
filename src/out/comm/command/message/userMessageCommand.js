"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMessageEventCommand = exports.SendUserMessageRequestCommand = void 0;
const vault_1 = require("../../../vault");
const types_1 = require("../../../model/message/types");
const userMessage_1 = require("../../../model/message/userMessage");
const websocketRequestCommand_1 = require("../../../core/command/websocket/websocketRequestCommand");
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
const deundefined_1 = require("../../../utils/deundefined");
const utils_1 = require("../utils");
class SendUserMessageRequestCommand extends websocketRequestCommand_1.default {
    constructor(params) {
        super({
            code: 'MESG',
            ackRequired: true,
            payload: (0, deundefined_1.deundefined)({
                channel_url: params.channelUrl,
                message: params.message,
                data: params.data,
                custom_type: params.customType,
                metaarray: params.metaArrays,
                mention_type: params.mentionType,
                mentioned_user_ids: (params.mentionType === types_1.MentionType.USERS) ? params.mentionedUserIds : [],
                target_langs: params.translationTargetLanguages,
                push_option: params.pushNotificationDeliveryOption && params.pushNotificationDeliveryOption !== types_1.PushNotificationDeliveryOption.DEFAULT ?
                    params.pushNotificationDeliveryOption : undefined,
                apple_critical_alert_options: params.appleCriticalAlertOptions,
                silent: params.silent,
                parent_message_id: params.parentMessageId > 0 ? params.parentMessageId : null,
                req_id: params.requestId,
            }),
        });
    }
}
exports.SendUserMessageRequestCommand = SendUserMessageRequestCommand;
class UserMessageEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        var _a;
        super(_iid, 'MESG', payload);
        this.message = new userMessage_1.default(_iid, payload);
        const { sdkState } = vault_1.default.of(_iid);
        this.isMentioned = (0, utils_1.checkIfMentioned)(this.message.mentionType, this.message.mentionedUsers.map((user) => user.userId), sdkState.userId);
        this.forceUpdateLastMessage = (_a = payload.force_update_last_message) !== null && _a !== void 0 ? _a : false;
    }
}
exports.UserMessageEventCommand = UserMessageEventCommand;
//# sourceMappingURL=userMessageCommand.js.map