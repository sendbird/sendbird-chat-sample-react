import User, { UserPayload } from '../user';
import { Role } from '../channel/types';
/**
 * @internal
 */
export interface SenderPayload extends UserPayload {
    'role'?: string;
    'is_blocked_by_me'?: boolean;
}
export default class Sender extends User {
    role: Role;
    isBlockedByMe: boolean;
    /**
     * @private
     */
    constructor(_iid: string, payload: SenderPayload);
    /**
     * @private
     */
    static payloadify(obj: Sender): SenderPayload;
}
