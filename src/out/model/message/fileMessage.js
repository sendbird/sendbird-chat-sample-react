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
const ekey_1 = require("../ekey");
const threadedMessageListParams_1 = require("../params/threadedMessageListParams");
const messageManager_1 = require("../../manager/messageManager");
const sendableMessage_1 = require("./sendableMessage");
const thumbnail_1 = require("./thumbnail");
const types_1 = require("./types");
const deundefined_1 = require("../../utils/deundefined");
const unless_1 = require("../../utils/unless");
const validator_1 = require("../../utils/validator");
class FileMessage extends sendableMessage_1.default {
    constructor(_iid, payload) {
        var _a, _b, _c, _d, _e, _f;
        super(_iid, payload);
        this.plainUrl = '';
        this.requireAuth = false;
        this.name = null;
        this.size = 0;
        this.type = null;
        this.thumbnails = [];
        this.messageSurvivalSeconds = -1;
        this.messageType = types_1.MessageType.FILE;
        const file = payload['file'];
        if (file) {
            if (file['url'])
                this.plainUrl = file['url'].split('?auth=')[0];
            this.name = (_a = file['name']) !== null && _a !== void 0 ? _a : 'File';
            this.size = (_b = file['size']) !== null && _b !== void 0 ? _b : 0;
            this.type = (_c = file['type']) !== null && _c !== void 0 ? _c : '';
            this.data = (_d = file['data']) !== null && _d !== void 0 ? _d : '';
        }
        if (payload['url'])
            this.plainUrl = payload['url'].split('?auth=')[0];
        if (payload['custom'])
            this.data = payload['custom'];
        this.requireAuth = (_e = payload['require_auth']) !== null && _e !== void 0 ? _e : false;
        this.thumbnails = payload['thumbnails'] ?
            payload['thumbnails'].map((payload) => new thumbnail_1.default(Object.assign(Object.assign({}, payload), { url: `${payload['url'].split('?auth=')[0]}${this.requireAuth ? `?auth=${(0, ekey_1.ekey)(this._iid)}` : ''}` }))) :
            [];
        this.messageSurvivalSeconds = (_f = payload['message_survival_seconds']) !== null && _f !== void 0 ? _f : -1;
    }
    static payloadify(obj) {
        return obj ? (0, deundefined_1.deundefined)(Object.assign(Object.assign({}, super.payloadify(obj)), { 'url': obj.plainUrl, 'require_auth': obj.requireAuth, 'file': {
                'name': obj.name,
                'size': obj.size,
                'type': obj.type,
                'data': obj.data,
            }, 'thumbnails': obj.thumbnails.map((thumbnail) => {
                return {
                    'url': thumbnail.url,
                    'width': thumbnail.width,
                    'height': thumbnail.height,
                    'real_width': thumbnail.realWidth,
                    'real_height': thumbnail.realHeight,
                };
            }), 'message_survival_seconds': obj.messageSurvivalSeconds })) : null;
    }
    get url() {
        return this.requireAuth ? `${this.plainUrl}?auth=${(0, ekey_1.ekey)(this._iid)}` : this.plainUrl;
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
exports.default = FileMessage;
//# sourceMappingURL=fileMessage.js.map