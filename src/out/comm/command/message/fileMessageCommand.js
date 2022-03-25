"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendFileMessageAPIResponseCommand = exports.FileMessageEventCommand = exports.SendFileMessageAPIRequestCommand = exports.SendFileMessageRequestCommand = void 0;
const vault_1 = require("../../../vault");
const types_1 = require("../../../model/message/types");
const fileMessage_1 = require("../../../model/message/fileMessage");
const message_1 = require("../../../module/message");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const websocketRequestCommand_1 = require("../../../core/command/websocket/websocketRequestCommand");
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
const deundefined_1 = require("../../../utils/deundefined");
const utils_1 = require("../utils");
class SendFileMessageRequestCommand extends websocketRequestCommand_1.default {
    constructor(params) {
        var _a, _b, _c;
        super({
            code: 'FILE',
            ackRequired: true,
            payload: (0, deundefined_1.deundefined)({
                channel_url: params.channelUrl,
                url: params.url,
                name: (_a = params.fileName) !== null && _a !== void 0 ? _a : '',
                type: (_b = params.mimeType) !== null && _b !== void 0 ? _b : '',
                size: (_c = params.fileSize) !== null && _c !== void 0 ? _c : 0,
                custom: params.data,
                custom_type: params.customType,
                thumbnails: params.thumbnailSizes,
                require_auth: params.requireAuth,
                metaarray: params.metaArrays,
                mention_type: params.mentionType,
                mentioned_user_ids: (params.mentionType === types_1.MentionType.USERS) ? params.mentionedUserIds : [],
                push_option: params.pushNotificationDeliveryOption && params.pushNotificationDeliveryOption !== types_1.PushNotificationDeliveryOption.DEFAULT ?
                    params.pushNotificationDeliveryOption : undefined,
                apple_critical_alert_options: params.appleCriticalAlertOptions,
                silent: params.silent,
                parent_message_id: params.parentMessageId > 0 ? params.parentMessageId : null,
                req_id: params.reqId,
            }),
        });
    }
}
exports.SendFileMessageRequestCommand = SendFileMessageRequestCommand;
class SendFileMessageAPIRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `${(0, utils_1.getChannelApiPathByType)(params.channelType)}/${encodeURIComponent(params.channelUrl)}/messages`;
        this.params = (0, deundefined_1.deundefined)({
            message_type: types_1.MessageType.FILE,
            user_id: params.userId,
            url: params.file,
            mention_type: params.mentionType,
            mentioned_user_ids: params.mentionedUserIds,
            file_name: params.fileName,
            file_size: params.fileSize,
            file_type: params.mimeType,
            data: params.data,
            custom_type: params.customType,
            thumbnails: params.thumbnailSizes.map((thumbnailSize) => message_1.Thumbnail.payloadify(thumbnailSize)),
            require_auth: params.requireAuth,
            sorted_metaarray: params.metaArrays.map((messageMetaArray) => message_1.MessageMetaArray.payloadify(messageMetaArray)),
            push_option: params.pushNotificationDeliveryOption,
            parent_message_id: params.parentMessageId > 0 ? params.parentMessageId : null,
            apple_critical_alert_options: message_1.AppleCriticalAlertOptions.payloadify(params.appleCriticalAlertOptions),
            reply_to_channel: params.isReplyToChannel,
            req_id: params.reqId,
        });
    }
}
exports.SendFileMessageAPIRequestCommand = SendFileMessageAPIRequestCommand;
class FileMessageEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        var _a;
        super(_iid, 'FILE', payload);
        this.message = new fileMessage_1.default(_iid, payload);
        const { sdkState } = vault_1.default.of(_iid);
        this.isMentioned = (0, utils_1.checkIfMentioned)(this.message.mentionType, this.message.mentionedUsers.map((user) => user.userId), sdkState.userId);
        this.forceUpdateLastMessage = (_a = payload.force_update_last_message) !== null && _a !== void 0 ? _a : false;
    }
}
exports.FileMessageEventCommand = FileMessageEventCommand;
class SendFileMessageAPIResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        var _a;
        super(_iid, payload);
        this.message = new fileMessage_1.default(_iid, payload);
        const { sdkState } = vault_1.default.of(_iid);
        this.isMentioned = (0, utils_1.checkIfMentioned)(this.message.mentionType, this.message.mentionedUsers.map((user) => user.userId), sdkState.userId);
        this.forceUpdateLastMessage = (_a = payload.force_update_last_message) !== null && _a !== void 0 ? _a : false;
    }
}
exports.SendFileMessageAPIResponseCommand = SendFileMessageAPIResponseCommand;
//# sourceMappingURL=fileMessageCommand.js.map