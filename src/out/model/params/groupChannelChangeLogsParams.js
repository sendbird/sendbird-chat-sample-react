"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupChannelChangeLogsParamsProperties = void 0;
const validator_1 = require("../../utils/validator");
class GroupChannelChangeLogsParamsProperties {
    constructor() {
        this.customTypes = [];
        this.includeEmpty = false;
        this.includeFrozen = true;
    }
}
exports.GroupChannelChangeLogsParamsProperties = GroupChannelChangeLogsParamsProperties;
class GroupChannelChangeLogsParams extends GroupChannelChangeLogsParamsProperties {
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
        return (((0, validator_1.isArrayOf)('string', this.customTypes) || this.customTypes === null) &&
            ((0, validator_1.isTypeOf)('boolean', this.includeEmpty) || this.includeEmpty === null) &&
            (0, validator_1.isTypeOf)('boolean', this.includeFrozen));
    }
}
exports.default = GroupChannelChangeLogsParams;
//# sourceMappingURL=groupChannelChangeLogsParams.js.map