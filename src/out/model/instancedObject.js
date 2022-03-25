"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deundefined_1 = require("../utils/deundefined");
class InstancedObject {
    constructor(_iid) {
        this._iid = '';
        this._iid = _iid;
    }
    static payloadify(obj) {
        return obj ? (0, deundefined_1.deundefined)({
            '_iid': obj._iid,
        }) : null;
    }
}
exports.default = InstancedObject;
//# sourceMappingURL=instancedObject.js.map