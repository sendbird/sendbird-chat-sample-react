"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../error");
const messageManager_1 = require("../../manager/messageManager");
const sendableMessage_1 = require("./sendableMessage");
const types_1 = require("./types");
const plugin_1 = require("../plugin");
const threadedMessageListParams_1 = require("../params/threadedMessageListParams");
const deundefined_1 = require("../../utils/deundefined");
const unless_1 = require("../../utils/unless");
const validator_1 = require("../../utils/validator");
class UserMessage extends sendableMessage_1.default {
    constructor(_iid, payload) {
        var _a, _b;
        super(_iid, payload);
        this.message = '';
        this.translations = {};
        this.messageSurvivalSeconds = -1;
        this.plugins = [];
        this.message = payload['message'];
        this.messageType = types_1.MessageType.USER;
        this.translations = (_a = payload['translations']) !== null && _a !== void 0 ? _a : {};
        this.messageSurvivalSeconds = (_b = payload['message_survival_seconds']) !== null && _b !== void 0 ? _b : -1;
        this.plugins = payload['plugins'] ? payload['plugins'].map((payload) => new plugin_1.default(payload)) : [];
    }
    static payloadify(obj) {
        return obj ? (0, deundefined_1.deundefined)(Object.assign(Object.assign({}, super.payloadify(obj)), { 'message': obj.message, 'translations': obj.translations, 'message_survival_seconds': obj.messageSurvivalSeconds, 'plugins': obj.plugins.map((plugin) => plugin_1.default.payloadify(plugin)) })) : null;
    }
    getThreadedMessages(ts, params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(this.messageId > 0 && (0, validator_1.isTypeOf)('number', ts) && params instanceof threadedMessageListParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            const manager = messageManager_1.default.of(this._iid);
            return yield manager.getThreadedMessages(this, ts, params);
        });
    }
}
exports.default = UserMessage;
//# sourceMappingURL=userMessage.js.map