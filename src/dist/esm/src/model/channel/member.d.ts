import RestrictedUser, { RestrictedUserPayload } from '../restrictedUser';
import { Role } from './types';
export declare enum MemberState {
    NONE = "none",
    JOINED = "joined",
    INVITED = "invited"
}
/**
 * @internal
 */
export interface MemberPayload extends RestrictedUserPayload {
    'state': string;
    'role': string;
    'is_muted'?: boolean;
    'is_blocked_by_me'?: boolean;
    'is_blocking_me'?: boolean;
}
export default class Member extends RestrictedUser {
    state: MemberState;
    role: Role;
    isMuted: boolean;
    isBlockedByMe: boolean;
    isBlockingMe: boolean;
    /**
     * @private
     */
    constructor(_iid: string, payload: MemberPayload);
    /**
     * @private
     */
    static payloadify(obj: Member): MemberPayload;
}
