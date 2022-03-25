"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseCommand_1 = require("../baseCommand");
class APIResponseCommand extends baseCommand_1.default {
    constructor(_iid, payload) {
        super();
        this._iid = _iid;
        this._payload = payload;
    }
    get payload() {
        return Object.assign({}, this._payload);
    }
    as(SpecifiedEventCommand) {
        return new SpecifiedEventCommand(this._iid, this.payload);
    }
}
exports.default = APIResponseCommand;
//# sourceMappingURL=apiResponseCommand.js.map