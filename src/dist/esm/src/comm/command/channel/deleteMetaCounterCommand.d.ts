import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { ChannelType } from '../../../model/channel/types';
interface DeleteMetaCounterRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    key: string;
}
interface DeleteMetaCounterRequestCommandPayload {
}
interface DeleteMetaCounterResponseCommandPayload {
}
/**
 * @internal
 */
export declare class DeleteMetaCounterRequestCommand extends APIRequestCommand {
    params: DeleteMetaCounterRequestCommandPayload;
    constructor(params: DeleteMetaCounterRequestCommandParams);
}
/**
 * @internal
 */
export declare class DeleteMetaCounterResponseCommand extends APIResponseCommand {
    constructor(_iid: string, payload: DeleteMetaCounterResponseCommandPayload);
}
export {};
