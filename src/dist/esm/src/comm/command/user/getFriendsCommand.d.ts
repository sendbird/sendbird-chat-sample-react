import User, { UserPayload } from '../../../model/user';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface GetFriendsRequestCommandParams {
    userId: string;
    limit: number;
    token: string;
}
interface GetFriendsRequestCommandPayload {
    limit: number;
    token: string;
}
interface GetFriendsResponseCommandPayload extends APIResponseCommandPayload {
    has_more: boolean;
    users: UserPayload[];
    next: string;
}
/**
 * @internal
 */
export declare class GetFriendsRequestCommand extends APIRequestCommand {
    params: GetFriendsRequestCommandPayload;
    constructor({ userId, limit, token }: GetFriendsRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetFriendsResponseCommand extends APIResponseCommand {
    hasMore: boolean;
    users: User[];
    next: string;
    constructor(_iid: string, payload: GetFriendsResponseCommandPayload);
}
export {};
