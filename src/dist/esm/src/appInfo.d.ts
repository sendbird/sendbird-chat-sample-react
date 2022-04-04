/**
 * @internal
 */
export interface AppInfoParams {
    'emoji_hash'?: string;
    'file_upload_size_limit'?: number;
    'application_attributes'?: string[];
    'premium_feature_list'?: string[];
}
export default class AppInfo {
    readonly emojiHash: string;
    readonly uploadSizeLimit: number;
    readonly useReaction: boolean;
    readonly applicationAttributes: string[];
    readonly premiumFeatureList: string[];
    /**
     * @private
     */
    constructor(params?: AppInfoParams);
}
