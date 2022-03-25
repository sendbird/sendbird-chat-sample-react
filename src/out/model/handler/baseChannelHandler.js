"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseChannelHandlerParams = void 0;
const noop_1 = require("../../utils/noop");
class BaseChannelHandlerParams {
}
exports.BaseChannelHandlerParams = BaseChannelHandlerParams;
class BaseChannelHandler extends BaseChannelHandlerParams {
    constructor(params = {}) {
        super();
        Object.keys(this).forEach((prop) => {
            var _a;
            this[prop] = (_a = params[prop]) !== null && _a !== void 0 ? _a : noop_1.noop;
        });
    }
}
exports.default = BaseChannelHandler;
//# sourceMappingURL=baseChannelHandler.js.map