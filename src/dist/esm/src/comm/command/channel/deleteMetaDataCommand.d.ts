import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { ChannelType } from '../../../model/channel/types';
interface DeleteMetaDataRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    key: string;
}
interface DeleteMetaDataRequestCommandPayload {
    include_ts: boolean;
}
interface DeleteMetaDataResponseCommandPayload {
    ts?: number;
}
/**
 * @internal
 */
export declare class DeleteMetaDataRequestCommand extends APIRequestCommand {
    params: DeleteMetaDataRequestCommandPayload;
    constructor(params: DeleteMetaDataRequestCommandParams);
}
/**
 * @internal
 */
export declare class DeleteMetaDataResponseCommand extends APIResponseCommand {
    readonly ts: number;
    constructor(_iid: string, payload: DeleteMetaDataResponseCommandPayload);
}
export {};
