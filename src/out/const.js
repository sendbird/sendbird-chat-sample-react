"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = require("../../package.json");
class Constant {
    static get OS_VERSION() {
        return typeof navigator !== 'undefined' && navigator.userAgent ? navigator.userAgent.replace(/,/g, '.') : 'noAgent';
    }
    static get SDK_VERSION() {
        return package_json_1.version;
    }
    static get SDK_MAJOR_VERSION() {
        return Constant.SDK_VERSION.split('.')[0];
    }
    static get DEFAULT_MAX_UNREAD_COUNT_OF_SUPER_GROUP_CHANNEL() {
        return 100;
    }
    static get INTERNAL_CALL() {
        return 'ic';
    }
}
exports.default = Constant;
//# sourceMappingURL=const.js.map