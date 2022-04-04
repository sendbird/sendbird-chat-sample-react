import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { ChannelType } from '../../../model/channel/types';
interface GetMetaCountersRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    keys: string[];
}
interface GetMetaCountersRequestCommandPayload {
    keys: string[];
}
interface GetMetaCountersResponseCommandPayload {
    metaCounter: object;
}
/**
 * @internal
 */
export declare class GetMetaCountersRequestCommand extends APIRequestCommand {
    params: GetMetaCountersRequestCommandPayload;
    constructor(params: GetMetaCountersRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetMetaCountersResponseCommand extends APIResponseCommand {
    readonly metaCounter: object;
    constructor(_iid: string, payload: GetMetaCountersResponseCommandPayload);
}
export {};
