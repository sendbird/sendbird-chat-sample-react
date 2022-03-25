"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UNIT_MB = 1024 * 1024;
class AppInfo {
    constructor(params = {}) {
        this.emojiHash = params['emoji_hash'] || '';
        this.uploadSizeLimit = params['file_upload_size_limit'] ? params['file_upload_size_limit'] * UNIT_MB : Number.MAX_VALUE;
        this.useReaction = !!params['use_reaction'];
        this.applicationAttributes = params['application_attributes'] || [];
        this.premiumFeatureList = params['premium_feature_list'] || [];
    }
}
exports.default = AppInfo;
//# sourceMappingURL=appInfo.js.map