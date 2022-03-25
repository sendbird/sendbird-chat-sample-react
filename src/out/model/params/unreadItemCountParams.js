"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnreadItemCountParamsProperties = void 0;
const validator_1 = require("../../utils/validator");
const groupChannel_1 = require("../channel/groupChannel");
class UnreadItemCountParamsProperties {
}
exports.UnreadItemCountParamsProperties = UnreadItemCountParamsProperties;
class UnreadItemCountParams extends UnreadItemCountParamsProperties {
    constructor(props) {
        super();
        if (props) {
            for (const key in props) {
                if (this.hasOwnProperty(key)) {
                    this[key] = props[key];
                }
            }
        }
    }
    validate() {
        return ((0, validator_1.isArrayOf)(groupChannel_1.UnreadItemKey, this.keys));
    }
}
exports.default = UnreadItemCountParams;
//# sourceMappingURL=unreadItemCountParams.js.map