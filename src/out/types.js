"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushTemplate = exports.PushTokenType = exports.PushTriggerOption = exports.PushTokenRegistrationState = void 0;
var PushTokenRegistrationState;
(function (PushTokenRegistrationState) {
    PushTokenRegistrationState["SUCCESS"] = "success";
    PushTokenRegistrationState["PENDING"] = "pending";
    PushTokenRegistrationState["ERROR"] = "error";
})(PushTokenRegistrationState = exports.PushTokenRegistrationState || (exports.PushTokenRegistrationState = {}));
var PushTriggerOption;
(function (PushTriggerOption) {
    PushTriggerOption["DEFAULT"] = "default";
    PushTriggerOption["ALL"] = "all";
    PushTriggerOption["MENTION_ONLY"] = "mention_only";
    PushTriggerOption["OFF"] = "off";
})(PushTriggerOption = exports.PushTriggerOption || (exports.PushTriggerOption = {}));
var PushTokenType;
(function (PushTokenType) {
    PushTokenType["FCM"] = "gcm";
    PushTokenType["APNS"] = "apns";
    PushTokenType["UNKNOWN"] = "unknown";
})(PushTokenType = exports.PushTokenType || (exports.PushTokenType = {}));
var PushTemplate;
(function (PushTemplate) {
    PushTemplate["ALTERNATIVE"] = "alternative";
    PushTemplate["DEFAULT"] = "default";
})(PushTemplate = exports.PushTemplate || (exports.PushTemplate = {}));
//# sourceMappingURL=types.js.map