"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestState = exports.PushNotificationDeliveryOption = exports.ReplyType = exports.MentionType = exports.MessageTypeFilter = exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["BASE"] = "base";
    MessageType["USER"] = "user";
    MessageType["FILE"] = "file";
    MessageType["ADMIN"] = "admin";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var MessageTypeFilter;
(function (MessageTypeFilter) {
    MessageTypeFilter["ALL"] = "";
    MessageTypeFilter["USER"] = "MESG";
    MessageTypeFilter["FILE"] = "FILE";
    MessageTypeFilter["ADMIN"] = "ADMM";
})(MessageTypeFilter = exports.MessageTypeFilter || (exports.MessageTypeFilter = {}));
var MentionType;
(function (MentionType) {
    MentionType["USERS"] = "users";
    MentionType["CHANNEL"] = "channel";
})(MentionType = exports.MentionType || (exports.MentionType = {}));
var ReplyType;
(function (ReplyType) {
    ReplyType["ALL"] = "all";
    ReplyType["NONE"] = "none";
    ReplyType["ONLY_REPLY_TO_CHANNEL"] = "only_reply_to_channel";
})(ReplyType = exports.ReplyType || (exports.ReplyType = {}));
var PushNotificationDeliveryOption;
(function (PushNotificationDeliveryOption) {
    PushNotificationDeliveryOption["DEFAULT"] = "default";
    PushNotificationDeliveryOption["SUPPRESS"] = "suppress";
})(PushNotificationDeliveryOption = exports.PushNotificationDeliveryOption || (exports.PushNotificationDeliveryOption = {}));
var RequestState;
(function (RequestState) {
    RequestState["PENDING"] = "pending";
    RequestState["FAILED"] = "failed";
    RequestState["CANCELED"] = "canceled";
    RequestState["SUCCEEDED"] = "succeeded";
})(RequestState = exports.RequestState || (exports.RequestState = {}));
//# sourceMappingURL=types.js.map