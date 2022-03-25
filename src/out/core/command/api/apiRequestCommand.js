"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIRequestMethod = void 0;
const baseCommand_1 = require("../baseCommand");
const deundefined_1 = require("../../../utils/deundefined");
const validator_1 = require("../../../utils/validator");
const uuid_1 = require("../../../utils/uuid");
var APIRequestMethod;
(function (APIRequestMethod) {
    APIRequestMethod["GET"] = "GET";
    APIRequestMethod["POST"] = "POST";
    APIRequestMethod["PUT"] = "PUT";
    APIRequestMethod["DELETE"] = "DELETE";
})(APIRequestMethod = exports.APIRequestMethod || (exports.APIRequestMethod = {}));
class APIRequestCommand extends baseCommand_1.default {
    constructor() {
        super(...arguments);
        this.params = {};
        this.requireAuth = true;
        this.headers = {};
        this.requestId = (0, uuid_1.uuid)();
    }
    stringifyParams(val) {
        if (typeof val === 'object' && !Array.isArray(val)) {
            return val ? JSON.stringify(val) : '';
        }
        return String(val);
    }
    get query() {
        const validParams = (0, deundefined_1.deundefined)(this.params);
        return `?${Object.keys(validParams)
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(this.stringifyParams(validParams[key]))}`)
            .join('&')}`;
    }
    get payload() {
        const validParams = (0, deundefined_1.deundefined)(this.params);
        if (Object.keys(validParams).some((key) => (0, validator_1.isFile)(validParams[key]))) {
            const formData = new FormData();
            Object.keys(validParams).forEach((key) => {
                var _a;
                if (validParams[key] instanceof Blob) {
                    const blob = validParams[key];
                    formData.append(key, blob, (_a = blob['name']) !== null && _a !== void 0 ? _a : 'filename');
                }
                else {
                    formData.append(key, this.stringifyParams(validParams[key]));
                }
            });
            return formData;
        }
        return JSON.stringify(validParams);
    }
}
exports.default = APIRequestCommand;
//# sourceMappingURL=apiRequestCommand.js.map