import { FriendDiscovery } from '../../../types';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface FriendDiscoveryParams {
    friendDiscoveryKey?: string;
    friendName?: string;
}
interface FriendDiscoveryPayload {
    friend_discovery_key?: string;
    friend_name?: string;
}
/**
 * @internal
 */
export interface UploadFriendDiscoveriesRequestCommandParams {
    userId: string;
    discoveries: FriendDiscovery[];
}
interface UploadFriendDiscoveriesRequestCommandPayload {
    friend_discoveries: FriendDiscoveryPayload[];
}
interface UploadFriendDiscoveriesResponseCommandPayload {
    friend_discovery_request_id: string;
}
/**
 * @internal
 */
export declare class UploadFriendDiscoveriesRequestCommand extends APIRequestCommand {
    params: UploadFriendDiscoveriesRequestCommandPayload;
    constructor({ userId, discoveries }: UploadFriendDiscoveriesRequestCommandParams);
}
/**
 * @internal
 */
export declare class UploadFriendDiscoveriesResponseCommand extends APIResponseCommand {
    friendDiscoveryRequestId: string;
    constructor(_iid: string, payload: UploadFriendDiscoveriesResponseCommandPayload);
}
export {};
