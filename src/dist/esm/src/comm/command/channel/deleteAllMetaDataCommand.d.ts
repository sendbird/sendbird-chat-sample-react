import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { ChannelType } from '../../../model/channel/types';
interface DeleteAllMetaDataRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
}
interface DeleteAllMetaDataRequestCommandPayload {
    include_ts: boolean;
}
interface DeleteAllMetaDataResponseCommandPayload {
    ts?: number;
}
/**
 * @internal
 */
export declare class DeleteAllMetaDataRequestCommand extends APIRequestCommand {
    params: DeleteAllMetaDataRequestCommandPayload;
    constructor(params: DeleteAllMetaDataRequestCommandParams);
}
/**
 * @internal
 */
export declare class DeleteAllMetaDataResponseCommand extends APIResponseCommand {
    readonly ts: number;
    constructor(_iid: string, payload: DeleteAllMetaDataResponseCommandPayload);
}
export {};
