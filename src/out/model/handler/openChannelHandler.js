"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenChannelHandlerParams = void 0;
const baseChannelHandler_1 = require("./baseChannelHandler");
const noop_1 = require("../../utils/noop");
class OpenChannelHandlerParams extends baseChannelHandler_1.BaseChannelHandlerParams {
}
exports.OpenChannelHandlerParams = OpenChannelHandlerParams;
class OpenChannelHandler extends OpenChannelHandlerParams {
    constructor(params = {}) {
        super();
        Object.keys(this).forEach((prop) => {
            var _a;
            this[prop] = (_a = params[prop]) !== null && _a !== void 0 ? _a : noop_1.noop;
        });
    }
}
exports.default = OpenChannelHandler;
//# sourceMappingURL=openChannelHandler.js.map