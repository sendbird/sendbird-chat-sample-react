import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { ChannelType } from '../../../model/channel/types';
interface DeleteAllMetaCountersRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
}
interface DeleteAllMetaCountersRequestCommandPayload {
}
/**
 * @internal
 */
export declare class DeleteAllMetaCountersRequestCommand extends APIRequestCommand {
    params: DeleteAllMetaCountersRequestCommandPayload;
    constructor(params: DeleteAllMetaCountersRequestCommandParams);
}
/**
 * @internal
 */
export declare class DeleteAllMetaCountersResponseCommand extends APIResponseCommand {
}
export {};
