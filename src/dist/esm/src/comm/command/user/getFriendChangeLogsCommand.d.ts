import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
import { UserPayload } from '../../../model/user';
import { FriendChangelogs } from '../../../types';
/**
 * @internal
 */
export interface GetFriendChangeLogsByTokenRequestCommandParams {
    userId: string;
    token: string;
}
interface GetFriendChangeLogsByTokenRequestCommandPayload {
    token: string;
}
interface GetFriendChangeLogsByTokenResponseCommandPayload extends APIResponseCommandPayload {
    deleted: string[];
    has_more: boolean;
    updated: UserPayload[];
    added: UserPayload[];
    next: string;
}
/**
 * @internal
 */
export declare class GetFriendChangeLogsByTokenRequestCommand extends APIRequestCommand {
    params: GetFriendChangeLogsByTokenRequestCommandPayload;
    constructor({ userId, token }: GetFriendChangeLogsByTokenRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetFriendChangeLogsByTokenResponseCommand extends APIResponseCommand {
    changelogs: FriendChangelogs;
    constructor(_iid: string, payload: GetFriendChangeLogsByTokenResponseCommandPayload);
}
export {};
