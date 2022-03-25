"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_LIST_QUERY_LIMIT = void 0;
const validator_1 = require("../utils/validator");
exports.DEFAULT_LIST_QUERY_LIMIT = 20;
class BaseListQuery {
    constructor(iid, params) {
        var _a;
        this._iid = null;
        this.limit = exports.DEFAULT_LIST_QUERY_LIMIT;
        this._isLoading = false;
        this._hasNext = true;
        this._token = '';
        this._iid = iid;
        this.limit = (_a = params.limit) !== null && _a !== void 0 ? _a : exports.DEFAULT_LIST_QUERY_LIMIT;
    }
    get hasNext() {
        return this._hasNext;
    }
    get isLoading() {
        return this._isLoading;
    }
    _validate() {
        return (0, validator_1.isTypeOf)('number', this.limit) && this.limit > 0;
    }
}
exports.default = BaseListQuery;
//# sourceMappingURL=baseListQuery.js.map