"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledStatus = void 0;
const instancedObject_1 = require("../instancedObject");
const user_1 = require("../user");
const sender_1 = require("./sender");
const messageMetaArray_1 = require("./messageMetaArray");
const appleCriticalAlertOptions_1 = require("./appleCriticalAlertOptions");
const types_1 = require("../channel/types");
const types_2 = require("./types");
const validator_1 = require("../../utils/validator");
var ScheduledStatus;
(function (ScheduledStatus) {
    ScheduledStatus["SCHEDULED"] = "scheduled";
    ScheduledStatus["SENT"] = "sent";
    ScheduledStatus["CANCELED"] = "canceled";
    ScheduledStatus["FAILED"] = "failed";
})(ScheduledStatus = exports.ScheduledStatus || (exports.ScheduledStatus = {}));
class ScheduledUserMessage extends instancedObject_1.default {
    constructor(_iid, payload) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        super(_iid);
        this.scheduleId = 0;
        this.scheduledDateTimeString = '';
        this.scheduledTimezone = '';
        this.status = ScheduledStatus.SCHEDULED;
        this.channelUrl = '';
        this.channelType = types_1.ChannelType.BASE;
        this.messageType = types_2.MessageType.USER;
        this.sender = null;
        this.message = '';
        this.customType = '';
        this.data = '';
        this.mentionType = types_2.MentionType.USERS;
        this.mentionedUsers = [];
        this.metaArrays = [];
        this.translationTargetLanguages = [];
        this.appleCriticalAlertOptions = null;
        this.pushNotificationDeliveryOption = types_2.PushNotificationDeliveryOption.DEFAULT;
        this.createdAt = 0;
        this.updatedAt = 0;
        this.errorCode = 0;
        this.errorMessage = '';
        this.scheduleId = payload['scheduled_id'];
        this.scheduledDateTimeString = (_a = payload['scheduled_dt']) !== null && _a !== void 0 ? _a : '';
        this.scheduledTimezone = (_b = payload['scheduled_timezone']) !== null && _b !== void 0 ? _b : '';
        this.status = (0, validator_1.isEnumOf)(ScheduledStatus, payload['status']) ? payload['status'] : ScheduledStatus.SCHEDULED;
        this.channelUrl = payload['channel_url'];
        this.channelType = payload['channel_type'];
        this.sender = new sender_1.default(this._iid, payload['user']);
        this.message = payload['message'];
        this.customType = (_c = payload['custom_type']) !== null && _c !== void 0 ? _c : '';
        this.data = (_d = payload['data']) !== null && _d !== void 0 ? _d : '';
        this.mentionType = (0, validator_1.isEnumOf)(types_2.MentionType, payload['mention_type']) ?
            payload['mention_type'] :
            null;
        this.mentionedUsers = payload['mentioned_users'] ?
            payload['mentioned_users'].map((payload) => new user_1.default(this._iid, payload)) :
            [];
        const metaArrayBody = (_e = payload['metaarray']) !== null && _e !== void 0 ? _e : {};
        const metaArrayKeyOrder = (_f = payload['metaarray_key_order']) !== null && _f !== void 0 ? _f : Object.keys(metaArrayBody).sort((a, b) => a.localeCompare(b));
        for (let i = 0; i < metaArrayKeyOrder.length; i++) {
            const metaArrayKey = metaArrayKeyOrder[i];
            this.metaArrays.push(new messageMetaArray_1.default({
                key: metaArrayKey,
                value: metaArrayBody[metaArrayKey] || []
            }));
        }
        this.translationTargetLanguages = (_g = payload['translation_target_langs']) !== null && _g !== void 0 ? _g : [];
        this.appleCriticalAlertOptions = payload['apple_critical_alert_options'] ?
            new appleCriticalAlertOptions_1.default(payload['apple_critical_alert_options']) :
            null;
        this.pushNotificationDeliveryOption = (0, validator_1.isEnumOf)(types_2.PushNotificationDeliveryOption, payload['push_option']) ?
            payload['push_option'] :
            types_2.PushNotificationDeliveryOption.DEFAULT;
        if (this.status === ScheduledStatus.FAILED) {
            if (payload['error']) {
                this.errorCode = payload['error']['code'];
                this.errorMessage = payload['error']['message'];
            }
        }
        this.createdAt = payload['created_at'];
        this.updatedAt = (_h = payload['updated_at']) !== null && _h !== void 0 ? _h : 0;
    }
}
exports.default = ScheduledUserMessage;
//# sourceMappingURL=scheduledUserMessage.js.map