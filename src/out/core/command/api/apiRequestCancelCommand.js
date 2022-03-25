"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseCommand_1 = require("../baseCommand");
class APIRequestCancelCommand extends baseCommand_1.default {
    constructor(requestId) {
        super();
        this.requestId = requestId;
    }
}
exports.default = APIRequestCancelCommand;
//# sourceMappingURL=apiRequestCancelCommand.js.map