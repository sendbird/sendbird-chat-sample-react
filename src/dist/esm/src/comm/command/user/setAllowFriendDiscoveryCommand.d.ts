import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface SetAllowFriendDiscoveryRequestCommandParams {
    userId: string;
    allowFriendDiscovery: boolean;
}
interface SetAllowFriendDiscoveryRequestCommandPayload {
    allow_friend_discovery: boolean;
}
/**
 * @internal
 */
export declare class SetAllowFriendDiscoveryRequestCommand extends APIRequestCommand {
    params: SetAllowFriendDiscoveryRequestCommandPayload;
    constructor({ userId, allowFriendDiscovery }: SetAllowFriendDiscoveryRequestCommandParams);
}
/**
 * @internal
 */
export declare class SetAllowFriendDiscoveryResponseCommand extends APIResponseCommand {
}
export {};
