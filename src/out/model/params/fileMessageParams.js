"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileMessageParamsProperties = void 0;
const baseMessageParams_1 = require("./baseMessageParams");
const validator_1 = require("../../utils/validator");
class FileMessageParamsProperties extends baseMessageParams_1.BaseMessageParamsProperties {
    constructor() {
        super(...arguments);
        this.file = null;
        this.fileName = null;
        this.fileSize = null;
        this.mimeType = null;
        this.thumbnailSizes = [];
    }
}
exports.FileMessageParamsProperties = FileMessageParamsProperties;
class FileMessageParams extends FileMessageParamsProperties {
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
    get fileUrl() {
        return (0, validator_1.isTypeOf)('string', this.file) ? this.file : null;
    }
    set fileUrl(value) {
        if ((0, validator_1.isTypeOf)('string', value)) {
            this.file = value;
        }
    }
    static fromFailedFileMessage(failedMessage, blob) {
        return new FileMessageParams({
            data: failedMessage.data,
            customType: failedMessage.customType,
            mentionType: failedMessage.mentionType,
            mentionedUserIds: failedMessage.requestedMentionUserIds,
            metaArrays: failedMessage.metaArrays,
            parentMessageId: failedMessage.parentMessageId,
            appleCriticalAlertOptions: failedMessage.appleCriticalAlertOptions,
            file: blob,
            fileName: failedMessage.name,
            fileSize: failedMessage.size,
            mimeType: failedMessage.type,
            thumbnailSizes: failedMessage.thumbnails.map((thumbnail) => {
                return {
                    maxWidth: thumbnail.width,
                    maxHeight: thumbnail.height,
                };
            }),
        });
    }
    validate() {
        return (new baseMessageParams_1.default(this).validate() &&
            ((0, validator_1.isFile)(this.file) || (0, validator_1.isTypeOf)('string', this.fileUrl)) &&
            ((0, validator_1.isTypeOf)('string', this.fileName) || this.fileName === null) &&
            ((0, validator_1.isTypeOf)('string', this.mimeType) || this.mimeType === null) &&
            ((0, validator_1.isTypeOf)('number', this.fileSize) || this.fileSize === null) &&
            (this.thumbnailSizes === null ||
                this.thumbnailSizes.every((size) => (0, validator_1.isTypeOf)('object', size) && size['maxWidth'] > 0 && size['maxHeight'] > 0)));
    }
}
exports.default = FileMessageParams;
//# sourceMappingURL=fileMessageParams.js.map