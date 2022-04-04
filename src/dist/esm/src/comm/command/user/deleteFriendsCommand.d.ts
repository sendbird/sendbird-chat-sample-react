import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface DeleteFriendsRequestCommandParams {
    userId: string;
    userIds: string[];
}
interface DeleteFriendsRequestCommandPayload {
    user_ids: string[];
}
/**
 * @internal
 */
export declare class DeleteFriendsRequestCommand extends APIRequestCommand {
    params: DeleteFriendsRequestCommandPayload;
    constructor({ userId, userIds }: DeleteFriendsRequestCommandParams);
}
/**
 * @internal
 */
export declare class DeleteFriendsResponseCommand extends APIResponseCommand {
}
export {};
