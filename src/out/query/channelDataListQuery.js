"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseListQuery_1 = require("./baseListQuery");
const types_1 = require("../model/channel/types");
const validator_1 = require("../utils/validator");
class ChannelDataListQuery extends baseListQuery_1.default {
    constructor(iid, channelUrl, channelType, params) {
        super(iid, params);
        this.channelUrl = channelUrl;
        this.channelType = channelType;
    }
    _validate() {
        return super._validate() &&
            (0, validator_1.isTypeOf)('string', this.channelUrl) &&
            (0, validator_1.isEnumOf)(types_1.ChannelType, this.channelType);
    }
}
exports.default = ChannelDataListQuery;
//# sourceMappingURL=channelDataListQuery.js.map