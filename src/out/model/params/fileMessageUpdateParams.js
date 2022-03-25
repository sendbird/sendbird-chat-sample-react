"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileMessageUpdateParamsProperties = void 0;
const baseMessageUpdateParams_1 = require("./baseMessageUpdateParams");
class FileMessageUpdateParamsProperties extends baseMessageUpdateParams_1.BaseMessageUpdateParamsProperties {
}
exports.FileMessageUpdateParamsProperties = FileMessageUpdateParamsProperties;
class FileMessageUpdateParams extends FileMessageUpdateParamsProperties {
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
        return (new baseMessageUpdateParams_1.default(this).validate());
    }
}
exports.default = FileMessageUpdateParams;
//# sourceMappingURL=fileMessageUpdateParams.js.map