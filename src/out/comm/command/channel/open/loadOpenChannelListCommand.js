"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadOpenChannelListResponseCommand = exports.LoadOpenChannelListRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const openChannel_1 = require("../../../../model/channel/openChannel");
const deundefined_1 = require("../../../../utils/deundefined");
class LoadOpenChannelListRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { token, limit, nameKeyword, urlKeyword, customTypes, includeFrozen, includeMetaData, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = const_1.API_PATH_OPEN_CHANNELS;
        this.params = (0, deundefined_1.deundefined)({
            token,
            limit,
            name_contains: nameKeyword,
            url_contains: urlKeyword,
            custom_types: customTypes,
            show_frozen: includeFrozen,
            show_metadata: includeMetaData,
        });
    }
}
exports.LoadOpenChannelListRequestCommand = LoadOpenChannelListRequestCommand;
class LoadOpenChannelListResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.token = null;
        this.channels = [];
        this.ts = null;
        const { next, channels, ts } = payload;
        this.token = next;
        if (channels && channels.length > 0) {
            this.channels = channels.map((payload) => {
                return new openChannel_1.default(_iid, payload);
            });
        }
        this.ts = typeof ts === 'number' ? ts : null;
    }
}
exports.LoadOpenChannelListResponseCommand = LoadOpenChannelListResponseCommand;
//# sourceMappingURL=loadOpenChannelListCommand.js.map