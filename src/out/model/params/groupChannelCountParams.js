"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupChannelCountParamsProperties = void 0;
const validator_1 = require("../../utils/validator");
const groupChannelFilter_1 = require("../channel/groupChannelFilter");
class GroupChannelCountParamsProperties {
}
exports.GroupChannelCountParamsProperties = GroupChannelCountParamsProperties;
class GroupChannelCountParams extends GroupChannelCountParamsProperties {
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
        return ((0, validator_1.isEnumOf)(groupChannelFilter_1.MemberStateFilter, this.memberStateFilter));
    }
}
exports.default = GroupChannelCountParams;
//# sourceMappingURL=groupChannelCountParams.js.map