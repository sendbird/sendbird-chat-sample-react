import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
import RestrictedUser, { RestrictedUserPayload } from '../../../model/restrictedUser';
import { ChannelType } from '../../../model/channel/types';
import { MutedUserListQueryParams } from '../../../query/mutedUserListQuery';
interface LoadMutedUserListRequestCommandParams extends MutedUserListQueryParams {
    channelUrl: string;
    channelType: ChannelType;
    token: string;
}
interface LoadMutedUserListRequestCommandPayload {
    limit: number;
    token: string;
}
interface LoadMutedUserListResponseCommandPayload extends APIResponseCommandPayload {
    next: string;
    muted_list: RestrictedUserPayload[];
}
/**
 * @internal
 */
export declare class LoadMutedUserListRequestCommand extends APIRequestCommand {
    params: LoadMutedUserListRequestCommandPayload;
    constructor(params: LoadMutedUserListRequestCommandParams);
}
/**
 * @internal
 */
export declare class LoadMutedUserListResponseCommand extends APIResponseCommand {
    token: string;
    mutedUsers: RestrictedUser[];
    constructor(_iid: string, payload: LoadMutedUserListResponseCommandPayload);
}
export {};
