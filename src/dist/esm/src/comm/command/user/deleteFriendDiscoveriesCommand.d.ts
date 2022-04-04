import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface DeleteFriendDiscoveriesRequestCommandParams {
    userId: string;
    discoveryKeys: string[];
}
interface DeleteFriendDiscoveriesRequestCommandPayload {
    friend_discovery_keys: string[];
}
/**
 * @internal
 */
export declare class DeleteFriendDiscoveriesRequestCommand extends APIRequestCommand {
    params: DeleteFriendDiscoveriesRequestCommandPayload;
    constructor({ userId, discoveryKeys }: DeleteFriendDiscoveriesRequestCommandParams);
}
/**
 * @internal
 */
export declare class DeleteFriendDiscoveriesResponseCommand extends APIResponseCommand {
}
export {};
