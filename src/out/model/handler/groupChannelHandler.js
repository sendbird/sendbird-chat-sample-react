"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupChannelHandlerParams = void 0;
const baseChannelHandler_1 = require("./baseChannelHandler");
const noop_1 = require("../../utils/noop");
class GroupChannelHandlerParams extends baseChannelHandler_1.BaseChannelHandlerParams {
}
exports.GroupChannelHandlerParams = GroupChannelHandlerParams;
class GroupChannelHandler extends GroupChannelHandlerParams {
    constructor(params = {}) {
        super();
        Object.keys(this).forEach((prop) => {
            var _a;
            this[prop] = (_a = params[prop]) !== null && _a !== void 0 ? _a : noop_1.noop;
        });
    }
}
exports.default = GroupChannelHandler;
//# sourceMappingURL=groupChannelHandler.js.map