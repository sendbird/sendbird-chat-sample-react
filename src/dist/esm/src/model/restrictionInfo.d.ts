export declare enum RestrictionType {
    MUTED = "muted",
    BANNED = "banned"
}
/**
 * @internal
 */
export interface RestrictionInfoPayload {
    'restriction_type'?: string;
    'description'?: string;
    'end_at'?: number;
    'muted_end_at'?: number;
}
export default class RestrictionInfo {
    readonly restrictionType: RestrictionType;
    readonly description: string;
    readonly endAt: number;
    /**
     * @private
     */
    constructor(payload: RestrictionInfoPayload);
    /**
     * @private
     */
    static payloadify(obj: RestrictionInfo): RestrictionInfoPayload;
}
