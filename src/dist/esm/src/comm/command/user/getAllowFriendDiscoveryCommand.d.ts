import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface GetAllowFriendDiscoveryRequestCommandParams {
    userId: string;
}
/**
 * @internal
 */
export declare class GetAllowFriendDiscoveryRequestCommand extends APIRequestCommand {
    constructor({ userId }: GetAllowFriendDiscoveryRequestCommandParams);
}
/**
 * @internal
 */
export interface GetAllowFriendDiscoveryResponseCommandPayload {
    allow_friend_discovery: boolean;
}
/**
 * @internal
 */
export declare class GetAllowFriendDiscoveryResponseCommand extends APIResponseCommand {
    readonly allowFriendDiscovery: boolean;
    constructor(_iid: string, payload: GetAllowFriendDiscoveryResponseCommandPayload);
}
