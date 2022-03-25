"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMessagePayload = exports.payloadifyMessage = void 0;
const adminMessage_1 = require("./adminMessage");
const fileMessage_1 = require("./fileMessage");
const userMessage_1 = require("./userMessage");
const types_1 = require("./types");
const payloadifyMessage = (obj) => {
    if (obj) {
        switch (obj.messageType) {
            case types_1.MessageType.USER: return userMessage_1.default.payloadify(obj);
            case types_1.MessageType.FILE: return fileMessage_1.default.payloadify(obj);
            case types_1.MessageType.ADMIN: return adminMessage_1.default.payloadify(obj);
        }
    }
    return null;
};
exports.payloadifyMessage = payloadifyMessage;
const parseMessagePayload = (_iid, payload) => {
    switch (payload['type']) {
        case 'MESG':
            return new userMessage_1.default(_iid, payload);
        case 'FILE':
            return new fileMessage_1.default(_iid, payload);
        case 'ADMM':
        case 'BRDM':
            return new adminMessage_1.default(_iid, payload);
    }
    return null;
};
exports.parseMessagePayload = parseMessagePayload;
//# sourceMappingURL=messageParser.js.map