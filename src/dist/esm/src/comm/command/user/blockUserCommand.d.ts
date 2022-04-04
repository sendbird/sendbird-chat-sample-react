import User, { UserPayload } from '../../../model/user';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface BlockUserRequestCommandParams {
    userId: string;
    blockedUserId: string;
}
interface BlockUserRequestCommandPayload {
    target_id: string;
}
interface BlockUserResponseCommandPayload extends UserPayload {
}
/**
 * @internal
 */
export declare class BlockUserRequestCommand extends APIRequestCommand {
    params: BlockUserRequestCommandPayload;
    constructor({ userId, blockedUserId }: BlockUserRequestCommandParams);
}
/**
 * @internal
 */
export declare class BlockUserResponseCommand extends APIResponseCommand {
    user: User;
    constructor(_iid: string, payload: BlockUserResponseCommandPayload);
}
export {};
