"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupChannelHideParamsProperties = void 0;
const validator_1 = require("../../utils/validator");
class GroupChannelHideParamsProperties {
    constructor() {
        this.hidePreviousMessages = false;
        this.allowAutoUnhide = true;
    }
}
exports.GroupChannelHideParamsProperties = GroupChannelHideParamsProperties;
class GroupChannelHideParams extends GroupChannelHideParamsProperties {
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
        return ((0, validator_1.isTypeOf)('boolean', this.hidePreviousMessages) &&
            (0, validator_1.isTypeOf)('boolean', this.allowAutoUnhide));
    }
}
exports.default = GroupChannelHideParams;
//# sourceMappingURL=groupChannelHideParams.js.map