"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseCommand_1 = require("../baseCommand");
const uuid_1 = require("../../../utils/uuid");
class WebSocketRequestCommand extends baseCommand_1.default {
    constructor({ code, ackRequired, payload = null, }) {
        var _a;
        super();
        this.code = code;
        this.payload = payload;
        this.requestId = (_a = this.payload['req_id']) !== null && _a !== void 0 ? _a : (0, uuid_1.uuid)();
        this.ackRequired = ackRequired;
        this.payload['req_id'] = this.requestId;
    }
    convertToMessage() {
        return `${this.code}${JSON.stringify(this.payload)}\n`;
    }
}
exports.default = WebSocketRequestCommand;
//# sourceMappingURL=websocketRequestCommand.js.map