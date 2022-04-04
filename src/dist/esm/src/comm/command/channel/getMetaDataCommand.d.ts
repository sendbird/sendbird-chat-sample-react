import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { ChannelType } from '../../../model/channel/types';
interface GetMetaDataRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    keys: string[];
}
interface GetMetaDataRequestCommandPayload {
    keys: string[];
    include_ts: boolean;
}
interface GetMetaDataResponseCommandPayload {
    metadata: object;
    ts?: number;
}
/**
 * @internal
 */
export declare class GetMetaDataRequestCommand extends APIRequestCommand {
    params: GetMetaDataRequestCommandPayload;
    constructor(params: GetMetaDataRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetMetaDataResponseCommand extends APIResponseCommand {
    readonly metadata: object;
    readonly ts: number;
    constructor(_iid: string, payload: GetMetaDataResponseCommandPayload);
}
export {};
