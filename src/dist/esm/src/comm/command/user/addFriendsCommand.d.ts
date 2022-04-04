import User, { UserPayload } from '../../../model/user';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface AddFriendsRequestCommandParams {
    userId: string;
    userIds: string[];
}
interface AddFriendsRequestCommandPayload {
    user_ids: string[];
}
interface AddFriendsResponseCommandPayload extends APIResponseCommandPayload {
    users: UserPayload[];
}
/**
 * @internal
 */
export declare class AddFriendsRequestCommand extends APIRequestCommand {
    params: AddFriendsRequestCommandPayload;
    constructor({ userId, userIds }: AddFriendsRequestCommandParams);
}
/**
 * @internal
 */
export declare class AddFriendsResponseCommand extends APIResponseCommand {
    users: User[];
    constructor(_iid: string, payload: AddFriendsResponseCommandPayload);
}
export {};
