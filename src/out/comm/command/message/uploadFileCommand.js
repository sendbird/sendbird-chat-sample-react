"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFileResponseCommand = exports.UploadFileRequestCommand = void 0;
const const_1 = require("../const");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const deundefined_1 = require("../../../utils/deundefined");
class UploadFileRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `${const_1.API_PATH_UPLOAD}`;
        this.params = (0, deundefined_1.deundefined)({
            file: params.file,
            channel_url: params.channelUrl,
        });
        if (params.thumbnailSizes) {
            for (let i = 0; i < params.thumbnailSizes.length; i++) {
                const { maxWidth, maxHeight } = params.thumbnailSizes[i];
                this.params[`thumbnail${i + 1}`] = `${maxWidth},${maxHeight}`;
            }
        }
        this.requestId = params.requestId;
    }
}
exports.UploadFileRequestCommand = UploadFileRequestCommand;
class UploadFileResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        var _a, _b, _c;
        super(_iid, payload);
        this.url = payload.url;
        this.fileSize = (_a = payload.file_size) !== null && _a !== void 0 ? _a : 0;
        this.thumbnailSizes = (_b = payload.thumbnails) !== null && _b !== void 0 ? _b : [];
        this.requireAuth = (_c = payload.require_auth) !== null && _c !== void 0 ? _c : false;
    }
}
exports.UploadFileResponseCommand = UploadFileResponseCommand;
//# sourceMappingURL=uploadFileCommand.js.map