"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOpenChannelResponseCommand = exports.CreateOpenChannelRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const openChannel_1 = require("../../../../model/channel/openChannel");
const validator_1 = require("../../../../utils/validator");
;
class CreateOpenChannelRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, coverUrlOrImage, name, data, customType, operatorUserIds, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = const_1.API_PATH_OPEN_CHANNELS;
        this.params = {
            channel_url: channelUrl,
            cover_url: (0, validator_1.isTypeOf)('string', coverUrlOrImage) ? coverUrlOrImage : null,
            cover_file: (0, validator_1.isFile)(coverUrlOrImage) ? coverUrlOrImage : null,
            name,
            data,
            custom_type: customType,
            operators: operatorUserIds,
        };
    }
}
exports.CreateOpenChannelRequestCommand = CreateOpenChannelRequestCommand;
class CreateOpenChannelResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.channel = new openChannel_1.default(_iid, payload);
    }
}
exports.CreateOpenChannelResponseCommand = CreateOpenChannelResponseCommand;
//# sourceMappingURL=createOpenChannelCommand.js.map