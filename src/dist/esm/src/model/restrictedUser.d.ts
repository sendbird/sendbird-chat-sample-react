import User, { UserPayload } from './user';
import RestrictionInfo, { RestrictionInfoPayload } from './restrictionInfo';
/**
 * @internal
 */
export interface RestrictedUserPayload extends UserPayload, RestrictionInfoPayload {
}
export default class RestrictedUser extends User {
    readonly restrictionInfo: RestrictionInfo;
    /**
     * @private
     */
    constructor(_iid: string, payload: RestrictedUserPayload);
    /**
     * @private
     */
    static payloadify(obj: RestrictedUser): RestrictedUserPayload;
}
