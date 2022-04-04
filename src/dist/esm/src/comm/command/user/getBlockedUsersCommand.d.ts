import User, { UserPayload } from '../../../model/user';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface GetBlockedUsersRequestCommandParams {
    userId: string;
    limit: number;
    token: string;
    userIdsFilter?: string[];
}
interface GetBlockedUsersRequestCommandPayload {
    limit: number;
    token: string;
    user_ids?: string[];
}
interface GetBlockedUsersResponseCommandPayload extends APIResponseCommandPayload {
    users: UserPayload[];
    next: string;
}
/**
 * @internal
 */
export declare class GetBlockedUsersRequestCommand extends APIRequestCommand {
    params: GetBlockedUsersRequestCommandPayload;
    constructor({ userId, limit, token, userIdsFilter }: GetBlockedUsersRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetBlockedUsersResponseCommand extends APIResponseCommand {
    users: User[];
    next: string;
    constructor(_iid: string, payload: GetBlockedUsersResponseCommandPayload);
}
export {};
