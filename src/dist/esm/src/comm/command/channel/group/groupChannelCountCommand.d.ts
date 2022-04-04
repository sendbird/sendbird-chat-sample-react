import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
import GroupChannelCountParams from '../../../../model/params/groupChannelCountParams';
/**
 * @internal
 */
export interface GetGroupChannelCountRequestCommandParams {
    userId: string;
    filter: GroupChannelCountParams;
}
interface GetGroupChannelCountRequestCommandPayload {
    state: string;
}
interface GetGroupChannelCountResponseCommandPayload {
    group_channel_count: number;
}
/**
 * @internal
 */
export declare class GetGroupChannelCountRequestCommand extends APIRequestCommand {
    params: GetGroupChannelCountRequestCommandPayload;
    constructor({ userId, filter }: GetGroupChannelCountRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetGroupChannelCountResponseCommand extends APIResponseCommand {
    groupChannelCount: number;
    constructor(_iid: string, payload: GetGroupChannelCountResponseCommandPayload);
}
export {};
