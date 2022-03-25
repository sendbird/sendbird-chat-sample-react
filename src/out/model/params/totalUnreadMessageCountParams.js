"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TotalUnreadMessageCountParamsProperties = void 0;
const validator_1 = require("../../utils/validator");
const groupChannelFilter_1 = require("../channel/groupChannelFilter");
class TotalUnreadMessageCountParamsProperties {
    constructor() {
        this.channelCustomTypesFilter = [];
        this.superChannelFilter = groupChannelFilter_1.SuperChannelFilter.ALL;
    }
}
exports.TotalUnreadMessageCountParamsProperties = TotalUnreadMessageCountParamsProperties;
class TotalUnreadMessageCountParams extends TotalUnreadMessageCountParamsProperties {
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
        return ((0, validator_1.isArrayOf)('string', this.channelCustomTypesFilter) &&
            (0, validator_1.isEnumOf)(groupChannelFilter_1.SuperChannelFilter, this.superChannelFilter));
    }
}
exports.default = TotalUnreadMessageCountParams;
//# sourceMappingURL=totalUnreadMessageCountParams.js.map