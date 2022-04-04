import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
import RestrictedUser, { RestrictedUserPayload } from '../../../model/restrictedUser';
import { ChannelType } from '../../../model/channel/types';
interface LoadBannedUserListRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    limit: number;
    token: string;
}
interface LoadBannedUserListRequestCommandPayload {
    limit: number;
    token: string;
}
interface BannedUserPayload {
    user: RestrictedUserPayload;
}
interface LoadBannedUserListResponseCommandPayload extends APIResponseCommandPayload {
    next: string;
    banned_list: BannedUserPayload[];
}
/**
 * @internal
 */
export declare class LoadBannedUserListRequestCommand extends APIRequestCommand {
    params: LoadBannedUserListRequestCommandPayload;
    constructor(params: LoadBannedUserListRequestCommandParams);
}
/**
 * @internal
 */
export declare class LoadBannedUserListResponseCommand extends APIResponseCommand {
    token: string;
    bannedUsers: RestrictedUser[];
    constructor(_iid: string, payload: LoadBannedUserListResponseCommandPayload);
}
export {};
