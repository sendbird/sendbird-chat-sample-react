"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseCommand_1 = require("../baseCommand");
const WEBSOCKET_COMMAND_CODE_LENGTH = 4;
class WebSocketEventCommand extends baseCommand_1.default {
    constructor(_iid, code, payload, requestId = '') {
        var _a;
        super();
        this._iid = _iid;
        this.code = code;
        this.payload = payload;
        this.requestId = payload ? (_a = payload['req_id']) !== null && _a !== void 0 ? _a : requestId : '';
    }
    static createFromRawMessage(_iid, message) {
        let code = message.substring(0, WEBSOCKET_COMMAND_CODE_LENGTH);
        let payload = null;
        try {
            payload = JSON.parse(message.substring(WEBSOCKET_COMMAND_CODE_LENGTH));
        }
        catch (err) {
            code = 'NOOP';
        }
        finally {
            return new WebSocketEventCommand(_iid, code, payload);
        }
    }
    convertToMessage() {
        return `${this.code}${JSON.stringify(this.payload)}\n`;
    }
    as(SpecifiedEventCommand) {
        return new SpecifiedEventCommand(this._iid, this.code, this.payload);
    }
}
exports.default = WebSocketEventCommand;
//# sourceMappingURL=websocketEventCommand.js.map